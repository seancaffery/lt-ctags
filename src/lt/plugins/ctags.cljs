(ns lt.plugins.ctags
  (:require [lt.object :as object]
            [lt.objs.command :as cmd]
            [lt.objs.editor :as editor]
            [lt.objs.editor.pool :as pool]
            [lt.objs.files :as files]
            [lt.util.load :as load]
            [lt.objs.search :as search]
            [lt.objs.jump-stack :as jump-stack]
            [lt.objs.notifos :as notifos])
  (:require-macros [lt.macros :refer [behavior background]]))

(def shell (load/node-module "shelljs"))

(defn workspace-root [path]
  (first (filter #(re-find (re-pattern %) path)
                 (map #(:path @%) (:folders @lt.objs.sidebar.workspace/tree)))))

(defn tags-file [ed]
  (let [file-path (-> @ed :info :path)
        path (str (workspace-root file-path) "/tags")]
    path))

(defn tags-file-exists? [ed]
  (let [tags-file (tags-file ed)
        res (files/exists? tags-file)]
  res))

(defn load-tags [ed]
  (if (empty? (:ctags @ctags))
    (let [lines (remove #(re-find #"^!" %) (clojure.string/split-lines
                                            (:content (files/open-sync (tags-file ed)))))
          tags (reduce (fn [res l]
                         (let [parts (clojure.string/split l #"\t")
                               tag-key (keyword (first parts))]
                           (if-not (vector? tag-key)
                             (assoc res tag-key (vec [])))
                           (assoc res tag-key
                             (vec (conj (tag-key res) {:path (nth parts 1)
                                                       :ex (nth parts 2) :type (nth parts 3)}))))) {} lines)]
      (object/merge! ctags {:ctags tags})
      tags)
    (:ctags @ctags)))

(defn select-tag [tags]
  (first tags))

(defn lookup-tag [ed token]
  (let [tags  (load-tags ed)
        tag ((keyword token) tags)
        file-path (-> @ed :info :path)
        path (str (workspace-root file-path) "/" (:path (select-tag tag)))]
    (if tag
      (if (js/isNaN (js/parseInt (:ex (select-tag tag))))
        (search/search! ed {:search (str "/" token "/") :paths [path]})
        (object/raise jump-stack/jump-stack :jump-stack.push! ed path {:line (dec (js/parseInt (:ex (select-tag tag)))) :ch 0}))
      (notifos/set-msg! "Ctags: Definition not found" {:class "error"}))))

(object/object* ::ctags
                :ctags {})

(def ctags (object/create ::ctags))

(behavior ::on-result
          :triggers #{:result}
          :reaction (fn [this result]
                      (let [path (.-file result)
                            line (.-line (first (.-results result)))]
                      (object/raise jump-stack/jump-stack :jump-stack.push! this path {:line (dec line) :ch 0}))))

(behavior ::go-to-tag
          :triggers #{::go-to-tag}
          :desc "Ctags: Jump to tag definition"
          :reaction (fn [this]
                      (if (tags-file-exists? this)
                        (let [token (:string (editor/->token this (editor/->cursor this)))]
                          (lookup-tag this token))
                        (notifos/set-msg! "Ctags: No tags file found" {:class "error"}))))

(cmd/command {:command ::go-to-tag
              :desc "Ctags: Jump to definition"
              :exec (fn []
                      (object/raise (pool/last-active) ::go-to-tag))})
