if(!lt.util.load.provided_QMARK_('lt.plugins.ctags')) {
goog.provide('lt.plugins.ctags');
goog.require('cljs.core');
goog.require('lt.objs.files');
goog.require('lt.objs.jump_stack');
goog.require('lt.objs.search');
goog.require('lt.objs.notifos');
goog.require('lt.objs.search');
goog.require('lt.objs.jump_stack');
goog.require('lt.objs.notifos');
goog.require('lt.objs.editor.pool');
goog.require('lt.objs.command');
goog.require('lt.objs.files');
goog.require('lt.util.load');
goog.require('lt.objs.editor');
goog.require('lt.object');
goog.require('lt.object');
goog.require('lt.util.load');
goog.require('lt.objs.editor');
goog.require('lt.objs.editor.pool');
goog.require('lt.objs.command');
lt.plugins.ctags.shell = lt.util.load.node_module.call(null,"shelljs");
lt.plugins.ctags.workspace_root = (function workspace_root(path){return cljs.core.first.call(null,cljs.core.filter.call(null,(function (p1__8229_SHARP_){return cljs.core.re_find.call(null,cljs.core.re_pattern.call(null,p1__8229_SHARP_),path);
}),cljs.core.map.call(null,(function (p1__8230_SHARP_){return new cljs.core.Keyword(null,"path","path",1017337751).cljs$core$IFn$_invoke$arity$1(cljs.core.deref.call(null,p1__8230_SHARP_));
}),new cljs.core.Keyword(null,"folders","folders",4625622327).cljs$core$IFn$_invoke$arity$1(cljs.core.deref.call(null,lt.objs.sidebar.workspace.tree)))));
});
lt.plugins.ctags.tags_file = (function tags_file(ed){var file_path = new cljs.core.Keyword(null,"path","path",1017337751).cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"info","info",1017141280).cljs$core$IFn$_invoke$arity$1(cljs.core.deref.call(null,ed)));var path = [cljs.core.str(lt.plugins.ctags.workspace_root.call(null,file_path)),cljs.core.str("/tags")].join('');return path;
});
lt.plugins.ctags.tags_file_exists_QMARK_ = (function tags_file_exists_QMARK_(ed){var tags_file = lt.plugins.ctags.tags_file.call(null,ed);var res = lt.objs.files.exists_QMARK_.call(null,tags_file);return res;
});
lt.plugins.ctags.load_tags = (function load_tags(ed){if(cljs.core.empty_QMARK_.call(null,new cljs.core.Keyword(null,"ctags","ctags",1108885102).cljs$core$IFn$_invoke$arity$1(cljs.core.deref.call(null,lt.plugins.ctags.ctags))))
{var lines = cljs.core.remove.call(null,(function (p1__8231_SHARP_){return cljs.core.re_find.call(null,/^!/,p1__8231_SHARP_);
}),clojure.string.split_lines.call(null,new cljs.core.Keyword(null,"content","content",1965434859).cljs$core$IFn$_invoke$arity$1(lt.objs.files.open_sync.call(null,lt.plugins.ctags.tags_file.call(null,ed)))));var tags = cljs.core.reduce.call(null,((function (lines){
return (function (res,l){var parts = clojure.string.split.call(null,l,/\t/);var tag_key = cljs.core.keyword.call(null,cljs.core.first.call(null,parts));if(!(cljs.core.vector_QMARK_.call(null,tag_key)))
{cljs.core.assoc.call(null,res,tag_key,cljs.core.vec.call(null,cljs.core.PersistentVector.EMPTY));
} else
{}
return cljs.core.assoc.call(null,res,tag_key,cljs.core.vec.call(null,cljs.core.conj.call(null,tag_key.call(null,res),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"path","path",1017337751),cljs.core.nth.call(null,parts,1),new cljs.core.Keyword(null,"ex","ex",1013907493),cljs.core.nth.call(null,parts,2),new cljs.core.Keyword(null,"type","type",1017479852),cljs.core.nth.call(null,parts,3)], null))));
});})(lines))
,cljs.core.PersistentArrayMap.EMPTY,lines);lt.object.merge_BANG_.call(null,lt.plugins.ctags.ctags,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"ctags","ctags",1108885102),tags], null));
return tags;
} else
{return new cljs.core.Keyword(null,"ctags","ctags",1108885102).cljs$core$IFn$_invoke$arity$1(cljs.core.deref.call(null,lt.plugins.ctags.ctags));
}
});
lt.plugins.ctags.select_tag = (function select_tag(tags){return cljs.core.first.call(null,tags);
});
lt.plugins.ctags.lookup_tag = (function lookup_tag(ed,token){var tags = lt.plugins.ctags.load_tags.call(null,ed);var tag = cljs.core.keyword.call(null,token).call(null,tags);var file_path = new cljs.core.Keyword(null,"path","path",1017337751).cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"info","info",1017141280).cljs$core$IFn$_invoke$arity$1(cljs.core.deref.call(null,ed)));var path = [cljs.core.str(lt.plugins.ctags.workspace_root.call(null,file_path)),cljs.core.str("/"),cljs.core.str(new cljs.core.Keyword(null,"path","path",1017337751).cljs$core$IFn$_invoke$arity$1(lt.plugins.ctags.select_tag.call(null,tag)))].join('');if(cljs.core.truth_(tag))
{if(cljs.core.truth_(isNaN(parseInt(new cljs.core.Keyword(null,"ex","ex",1013907493).cljs$core$IFn$_invoke$arity$1(lt.plugins.ctags.select_tag.call(null,tag))))))
{return lt.objs.search.search_BANG_.call(null,ed,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"search","search",4402534682),[cljs.core.str("/"),cljs.core.str(token),cljs.core.str("/")].join(''),new cljs.core.Keyword(null,"paths","paths",1120343136),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [path], null)], null));
} else
{return lt.object.raise.call(null,lt.objs.jump_stack.jump_stack,new cljs.core.Keyword(null,"jump-stack.push!","jump-stack.push!",4063822260),ed,path,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"line","line",1017226086),(parseInt(new cljs.core.Keyword(null,"ex","ex",1013907493).cljs$core$IFn$_invoke$arity$1(lt.plugins.ctags.select_tag.call(null,tag))) - 1),new cljs.core.Keyword(null,"ch","ch",1013907415),0], null));
}
} else
{return lt.objs.notifos.set_msg_BANG_.call(null,"Ctags: Definition not found",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"class","class",1108647146),"error"], null));
}
});
lt.object.object_STAR_.call(null,new cljs.core.Keyword("lt.plugins.ctags","ctags","lt.plugins.ctags/ctags",4482022408),new cljs.core.Keyword(null,"ctags","ctags",1108885102),cljs.core.PersistentArrayMap.EMPTY);
lt.plugins.ctags.ctags = lt.object.create.call(null,new cljs.core.Keyword("lt.plugins.ctags","ctags","lt.plugins.ctags/ctags",4482022408));
lt.plugins.ctags.__BEH__on_result = (function __BEH__on_result(this$,result){var path = result.file;var line = cljs.core.first.call(null,result.results).line;return lt.object.raise.call(null,lt.objs.jump_stack.jump_stack,new cljs.core.Keyword(null,"jump-stack.push!","jump-stack.push!",4063822260),this$,path,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"line","line",1017226086),(line - 1),new cljs.core.Keyword(null,"ch","ch",1013907415),0], null));
});
lt.object.behavior_STAR_.call(null,new cljs.core.Keyword("lt.plugins.ctags","on-result","lt.plugins.ctags/on-result",798813271),new cljs.core.Keyword(null,"reaction","reaction",4441361819),lt.plugins.ctags.__BEH__on_result,new cljs.core.Keyword(null,"triggers","triggers",2516997421),new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"result","result",4374444943),null], null), null));
lt.plugins.ctags.__BEH__go_to_tag = (function __BEH__go_to_tag(this$){if(cljs.core.truth_(lt.plugins.ctags.tags_file_exists_QMARK_.call(null,this$)))
{var token = new cljs.core.Keyword(null,"string","string",4416885635).cljs$core$IFn$_invoke$arity$1(lt.objs.editor.__GT_token.call(null,this$,lt.objs.editor.__GT_cursor.call(null,this$)));return lt.plugins.ctags.lookup_tag.call(null,this$,token);
} else
{return lt.objs.notifos.set_msg_BANG_.call(null,"Ctags: No tags file found",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"class","class",1108647146),"error"], null));
}
});
lt.object.behavior_STAR_.call(null,new cljs.core.Keyword("lt.plugins.ctags","go-to-tag","lt.plugins.ctags/go-to-tag",1177060937),new cljs.core.Keyword(null,"reaction","reaction",4441361819),lt.plugins.ctags.__BEH__go_to_tag,new cljs.core.Keyword(null,"desc","desc",1016984067),"Ctags: Jump to tag definition",new cljs.core.Keyword(null,"triggers","triggers",2516997421),new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword("lt.plugins.ctags","go-to-tag","lt.plugins.ctags/go-to-tag",1177060937),null], null), null));
lt.objs.command.command.call(null,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"command","command",1964298941),new cljs.core.Keyword("lt.plugins.ctags","go-to-tag","lt.plugins.ctags/go-to-tag",1177060937),new cljs.core.Keyword(null,"desc","desc",1016984067),"Ctags: Jump to definition",new cljs.core.Keyword(null,"exec","exec",1017031683),(function (){return lt.object.raise.call(null,lt.objs.editor.pool.last_active.call(null),new cljs.core.Keyword("lt.plugins.ctags","go-to-tag","lt.plugins.ctags/go-to-tag",1177060937));
})], null));
}

//# sourceMappingURL=ctags_compiled.js.map