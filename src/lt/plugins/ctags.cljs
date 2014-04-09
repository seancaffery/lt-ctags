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
          tag-map (map (fn [line]
                      (let [parts (clojure.string/split line #"\t")
                            tag-key (keyword (first parts))]
                        {:token tag-key
                         :path (.replace (nth parts 1) #"^\./" "")
                         :ex (nth parts 2)
                         :type (nth parts 3)
                         :namespace (.replace (get parts 4 "") "class:" "")})) lines)
          tags (group-by #(keyword (:token %))  tag-map)]

      (object/merge! ctags {:ctags tags})
      tags)
    (:ctags @ctags)))

(defn select-tag [ed tags]
  (let [path (-> @ed :info :path)
        ws-path (workspace-root path)
        rel-path (clojure.string/replace-first path (str ws-path "/") "")
        tags-matching-path (filter #(= rel-path (:path %)) tags)]
    (if-not (empty? tags-matching-path)
      (first tags-matching-path)
      (first tags))))

(defn lookup-tag [ed {:keys [token tag-ns]}]
  (if (tags-file-exists? ed)
    (let [tags  (load-tags ed)
          tag ((keyword token) tags)
          file-path (-> @ed :info :path)
          path (str (workspace-root file-path) "/" (:path (select-tag ed tag)))]
      (if tag
        (if (js/isNaN (js/parseInt (:ex (select-tag ed tag))))
          (search/search! ed {:search (str "/" token "/") :paths [path]})
          (object/raise jump-stack/jump-stack :jump-stack.push! ed path {:line (dec (js/parseInt (:ex (select-tag ed tag)))) :ch 0}))
        (notifos/set-msg! "Ctags: Definition not found" {:class "error"})))
    (notifos/set-msg! "Ctags: No tags file found" {:class "error"})))

(object/object* ::ctags
                :ctags {})

(def ctags (object/create ::ctags))

(behavior ::on-result
          :triggers #{:result}
          :reaction (fn [this result]
                      (let [path (.-file result)
                            line (.-line (first (.-results result)))]
                      (object/raise jump-stack/jump-stack :jump-stack.push! this path {:line (dec line) :ch 0}))))

(defn simple-lookup [editor]
  (lookup-tag editor
              {:token (:string (editor/->token editor (editor/->cursor editor)))
               :namespace nil}))

(behavior ::simple-jump-to-definition
          :triggers #{::go-to-tag :editor.jump-to-definition-at-cursor!}
          :desc "Ctags implementation of jump to definition"
          :reaction (fn [this]
                      (simple-lookup this)))

(behavior ::ruby-namespaced-jump-to-definition
          :triggers #{::go-to-tag :editor.jump-to-definition-at-cursor!}
          :desc "Ctags jump to definition with ruby namespacing"
          :reaction (fn [this]
                      (lookup-tag this
                                  {:token (-> (editor/->token this (editor/->cursor this))
                                              :string
                                              (.replace ":" ""))
                                   :namespace "FooBar.BazMan"})))

; Not sure of this commands relevance, there's already an LT command
; to trigger the appropriate jump to definition behaviors
(cmd/command {:command ::go-to-tag
              :desc "Ctags: Jump to definition"
              :exec (fn [] (simple-lookup (pool/last-active)))})
