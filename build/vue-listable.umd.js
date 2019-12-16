!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).VueListable=t()}(this,(function(){"use strict";var e={render:function(e){return e("tr",{class:{"listable-tr":!0,"listable-tr-expander":!0}},[e("td",{class:["listable-td"],attrs:{colspan:this.colspan}},this.expanderSlot(this.row))])},props:{colspan:{type:Number,default:0},row:{type:Object,default:function(){}},expanderSlot:{type:Function,default:function(){}}}},t=function(){function e(e,t,s,n,a,i){this.searchable=!!e,this.isCheckbox=!!t,this.display=s,this.sortable=!!n,this.column=a,this.ascending=void 0===i||!!i,this.descending=!this.ascending,this.defaultAscending=!!this.ascending,this.calculateClasses()}return e.prototype.oppositeSort=function(){this.descending=!this.descending,this.ascending=!this.ascending,this.calculateClasses()},e.prototype.resetSort=function(){this.ascending=this.defaultAscending,this.descending=!this.defaultAscending,this.calculateClasses()},e.prototype.calculateClasses=function(){this.classes={"listable-th":!0,"listable-th-checkbox":this.isCheckbox,sortable:this.sortable,ascending:this.sortable&&this.ascending,descending:this.sortable&&this.descending},this.classes["listable-th-col-"+this.column]=!0},e}(),s={components:{Expander:e},render:function(e){return e("div",{class:"listable-container",ref:"container"},[this.generateTable(e),this.generatePaginator(e)])},props:{headings:{type:Array,default:function(){return[]}},data:{type:Array,default:function(){return[]}},checkbox:{type:Boolean,default:!1},expandable:{type:Boolean,default:!1},responsive:{type:Boolean,default:!0},hook:{type:Function,default:function(){}},rowHook:{type:Function,default:function(){}}},data:function(){return{columns:[],checked:[],expanded:[],searchable:!1,searched:{},searchTimeout:null,resizeTimeout:null,responsiveMode:!1,responsiveMaxWidth:1/0}},mounted:function(){var e=this;this.$nextTick((function(){e.checkErrors(),e.columns=e.calculateColumns(),e.searchable=e.isSearchable(),e.responsive&&window.addEventListener("resize",e.handleResponsive)}))},methods:{calculateColumns:function(){var e=[];if(this.checkbox){var s=new t(!1,!0,"",!1,"",!0);e.push(s)}for(var n in this.headings){var a=new t(this.headings[n].search,!1,this.headings[n].display,this.headings[n].sortable,this.headings[n].column,this.headings[n].ascending);e.push(a)}return e},checkErrors:function(){for(var e in this.headings){var t=this.headings[e].column;for(var s in this.data)this.data[s].hasOwnProperty(t)||console.error("Data does not contain column "+t)}},generateTable:function(e){var t=this.generateHeader(e),s=this.generateBody(e);return e("table",{class:{listable:!0,"responsive-mode":this.responsiveMode},ref:"table"},[t,s])},generateHeader:function(e){return e("thead",{class:"listable-header"},this.generateHeaderRows(e))},generateHeaderRows:function(e){var t=[];return t.push(e("tr",{class:{"listable-tr":!0,"listable-tr-checked":this.checked.length>0&&this.checked.length===this.data.length}},[this.generateHeaderCells(e)])),this.searchable&&this.data.length>0&&t.push(e("tr",{class:{"listable-tr":!0,"listable-tr-checked":this.checked.length>0&&this.checked.length===this.data.length,"listable-tr-search":!0}},[this.generateHeaderSearchCells(e)])),t},isSearchable:function(){for(var e in this.headings)if(this.headings[e].search)return!0;return!1},generateHeaderSearchCells:function(e){var t=this,s=[],n=function(n){var a=[];t.columns[n].searchable&&a.push(e("input",{class:"listable-search",on:{input:function(e){clearTimeout(t.searchTimeout),t.searchTimeout=setTimeout((function(){t.$emit("input",e.target.value),t.searched[t.columns[n].column]=e.target.value,t.$emit("search",t.searched)}),500)}}}));var i=e("th",{class:["listable-th"]},a);s.push(i)};for(var a in t.columns)n(a);return s},generateHeaderCells:function(e){var t=this,s=[],n=function(n){var a=[];if(t.columns[n].isCheckbox){if(0==t.data.length)return;a.push(e("span",{class:{"listable-checkbox":!0},on:{click:t.handleAllCheckbox}}))}t.columns[n].display&&a.push(t.columns[n].display);var i={};t.columns[n].sortable&&(i.click=function(e){t.handleSort(e,n)});var o=e("th",{class:t.columns[n].classes,on:i},a);s.push(o)};for(var a in t.columns)n(a);return s},generateBody:function(e){return e("tbody",{class:"listable-body"},this.generateBodyRows(e))},handleExpander:function(e,t){e.stopPropagation();var s=this.expanded.indexOf(t);-1!==s?this.expanded.splice(s,1):this.expanded.push(t),this.$emit("expanded",this.expanded)},handleCheckbox:function(e,t){e.stopPropagation();var s=this.checked.indexOf(t);-1!==s?this.checked.splice(s,1):this.checked.push(t),this.$emit("checked",this.checked)},handleSort:function(e,t){e.stopPropagation();var s=this.columns[t];this.columns.map((function(e){e.column!=s.column&&e.resetSort()})),this.columns[t].oppositeSort();var n={column:s.column,ascending:s.ascending};this.$emit("sorted",n),this.$forceUpdate()},handleAllCheckbox:function(e){if(e.stopPropagation(),this.checked.length>0)this.checked=[];else for(var t in this.checked=[],this.data)this.checked.push(t);this.$emit("checked",this.checked)},generateEmptyRow:function(e){return e("tr",{class:{"listable-tr":!0,"listable-tr-empty":!0}},[e("td",{class:"listable-td",attrs:{colspan:this.columns.length}},[this.$slots.empty])])},generateBodyRows:function(e){var t=this,s=[];0==this.data.length&&s.push(this.generateEmptyRow(e));var n=function(n){t.responsiveMode&&s.push(e("tr",{class:{"listable-tr-checkbox":!0,"listable-tr-checked":-1!==t.checked.indexOf(n)}},[e("td",{class:{"listable-checkbox":!0},on:{click:function(e){return t.handleCheckbox(e,n)}}})]));var a="tr_"+n,i={};t.expandable&&(i.click=function(e){t.handleExpander(e,n)});var o={class:{"listable-tr":!0,"listable-tr-checked":-1!==t.checked.indexOf(n)},style:{}};t.rowHook(o,t.data[n]),s.push(e("tr",{class:o.class,style:o.style,on:i,ref:a},t.generateBodyRowCells(e,n,t.data[n]))),t.expandable&&-1!==t.expanded.indexOf(n)&&t.$scopedSlots.expander&&s.push(t.generateExpander(e,t.data[n]))};for(var a in t.data)n(a);return s},generateBodyRowCells:function(e,t,s){var n=this,a=[];this.checkbox&&a.push(e("td",{class:"listable-td listable-td-checkbox"},[e("span",{class:"listable-checkbox",on:{click:function(e){return n.handleCheckbox(e,t)}}})]));var i=function(i){if(!n.columns[i].isCheckbox){var o=n.columns[i].column,c=null,l="td_"+t+"_"+i+"_"+Date.now(),r=null;n.responsiveMode&&(r=e("div",{class:["listable-td-th"]},n.columns[i].display));var h={class:{"listable-td":!0},style:{},parent:n.$refs["tr_"+t]};if(h.class["listable-td-col-"+n.columns[i].column]=!0,n.hook(h,s,o),n.$scopedSlots[o]){var d=n.$scopedSlots[o](s);c=e("td",{class:h.class,style:h.style,ref:l},[r,d])}else c=e("td",{class:h.class,style:h.style,ref:l},[r,void 0===s[o]||null===s[o]?"":s[o].constructor===Array||s[o].constructor===Object||s[o].constructor===Function?"":s[o]]);a.push(c)}};for(var o in n.columns)i(o);return a},generateExpander:function(e,t){return e("Expander",{props:{colspan:this.columns.length,expanderSlot:this.$scopedSlots.expander,row:t}})},generatePaginator:function(e){return this.$slots.paginator?e("div",{class:"listable-paginator"},this.$slots.paginator):null},handleResponsive:function(){var e=this;clearTimeout(this.resizeTimeout),this.resizeTimeout=setTimeout((function(){var t=window.innerWidth,s=e.$refs.container.clientWidth,n=e.$refs.table.clientWidth;t>e.responsiveMaxWidth&&(e.responsiveMode=!1),n>s&&(e.responsiveMaxWidth=t,e.responsiveMode=!0)}),100)}},updated:function(){var e=this;this.$nextTick((function(){e.handleResponsive()}))},beforeDestroy:function(){this.responsive&&window.removeEventListener("resize",this.handleResponsive)}};return{install:function(e,t){e.component("listable",s)}}}));
