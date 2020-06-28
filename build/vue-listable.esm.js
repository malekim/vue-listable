import e from"vue";var t=e.extend({render:function(e){return e("tr",{class:{"listable-tr":!0,"listable-tr-expander":!0}},[e("td",{class:["listable-td"],attrs:{colspan:this.colspan}},this.expanderSlot(this.row))])},props:{colspan:{type:Number,default:0},row:{type:Object,default:function(){}},expanderSlot:{type:Function,default:function(){}}}}),s=function(){function e(e,t,s,n,a,i){this.classes={},this.searchable=!!e,this.isCheckbox=!!t,this.display=s,this.sortable=!!n,this.column=a,this.ascending=void 0===i||!!i,this.descending=!this.ascending,this.defaultAscending=!!this.ascending,this.calculateClasses()}return e.prototype.oppositeSort=function(){this.descending=!this.descending,this.ascending=!this.ascending,this.calculateClasses()},e.prototype.resetSort=function(){this.ascending=this.defaultAscending,this.descending=!this.defaultAscending,this.calculateClasses()},e.prototype.calculateClasses=function(){this.classes={"listable-th":!0,"listable-th-checkbox":this.isCheckbox,sortable:this.sortable,ascending:this.sortable&&this.ascending,descending:this.sortable&&this.descending},this.column&&(this.classes["listable-th-col-"+this.column]=!0)},e}(),n=e.extend({render:function(e){return e("thead",{class:"listable-head"},this.generateHeaderRows(e))},data:function(){return{columns:[],searchable:!1,searched:{},searchTimeout:null}},props:{checkbox:{type:Boolean,default:!1},checked:{type:Array,default:function(){return[]}},data:{type:Array,default:function(){return[]}},headings:{type:Array,default:function(){return[]}}},mounted:function(){this.searchable=this.isSearchable(),this.columns=this.calculateColumns(),this.$emit("updateColumns",this.columns)},methods:{calculateColumns:function(){var e=[];if(this.checkbox){var t=new s(!1,!0,"",!1,"",!0);e.push(t)}for(var n in this.headings){t=new s(this.headings[n].search,!1,this.headings[n].display,this.headings[n].sortable,this.headings[n].column,this.headings[n].ascending);e.push(t)}return e},generateHeaderRows:function(e){var t=[];return t.push(e("tr",{class:{"listable-tr":!0,"listable-tr-checked":this.checked.length>0&&this.checked.length===this.data.length}},[this.generateHeaderCells(e)])),this.searchable&&this.data.length>0&&t.push(e("tr",{class:{"listable-tr":!0,"listable-tr-checked":this.checked.length>0&&this.checked.length===this.data.length,"listable-tr-search":!0}},[this.generateHeaderSearchCells(e)])),t},generateHeaderCells:function(e){for(var t=this,s=[],n=function(n){var i=[];if(a.columns[n].isCheckbox){if(0==a.data.length)return"continue";i.push(e("span",{class:{"listable-checkbox":!0},on:{click:function(e){t.$emit("handleAllCheckbox",e)}}}))}a.columns[n].display&&i.push(a.columns[n].display);var c={click:Function()};a.columns[n].sortable&&(c.click=function(e){t.handleSort(e,n)});var o=e("th",{class:a.columns[n].classes,on:c},i);s.push(o)},a=this,i=0;i<this.columns.length;i++)n(i);return s},generateHeaderSearchCells:function(e){for(var t=this,s=[],n=0;n<this.columns.length;n++){var a=[];this.columns[n].searchable&&a.push(e("input",{class:"listable-search",on:{input:function(e){clearTimeout(t.searchTimeout),t.searchTimeout=setTimeout((function(){var s=e.target;t.$emit("input",s.value),t.searched=Object.assign({column:s.value},t.searched),t.$parent.$emit("search",t.searched)}),500)}}}));var i=e("th",{class:["listable-th"]},a);s.push(i)}return s},handleSort:function(e,t){e.stopPropagation();var s=this.columns[t];this.columns.map((function(e){e.column!=s.column&&e.resetSort()})),this.columns[t].oppositeSort();var n={column:s.column,ascending:s.ascending};this.$parent.$emit("sorted",n),this.$forceUpdate()},isSearchable:function(){for(var e in this.headings)if(this.headings[e].search)return!0;return!1}}}),a=e.extend({name:"VueListable",render:function(e){return e("div",{class:"listable-container",ref:"container"},[this.generateTable(e),this.generatePaginator(e)])},components:{ListableExpander:t,ListableHead:n},props:{headings:{type:Array,default:function(){return[]}},data:{type:Array,default:function(){return[]}},checkbox:{type:Boolean,default:!1},expandable:{type:Boolean,default:!1},responsive:{type:Boolean,default:!0},hook:{type:Function,default:function(){}},rowHook:{type:Function,default:function(){}}},data:function(){return{columns:[],checked:[],expanded:[],resizeTimeout:null,responsiveMode:!1,responsiveMaxWidth:1/0}},mounted:function(){var e=this;this.$nextTick((function(){e.checkErrors(),e.responsive&&window.addEventListener("resize",e.handleResponsive)}))},methods:{checkErrors:function(){for(var e=0,t=this.headings.length;e<t;e++)for(var s=this.headings[e].column,n=0,a=this.data.length;n<a;n++)this.data[n].hasOwnProperty(s)||console.error("Data does not contain column "+s)},generateTable:function(e){var t=this.generateHead(e),s=this.generateBody(e);return e("table",{class:{listable:!0,"responsive-mode":this.responsiveMode},ref:"table"},[t,s])},generateBody:function(e){return e("tbody",{class:"listable-body"},this.generateBodyRows(e))},handleExpander:function(e,t){e.stopPropagation();var s=this.expanded.indexOf(t);-1!==s?this.expanded.splice(s,1):this.expanded.push(t),this.$emit("expanded",this.expanded)},handleCheckbox:function(e,t){e.stopPropagation();var s=this.checked.indexOf(t);-1!==s?this.checked.splice(s,1):this.checked.push(t),this.$emit("checked",this.checked)},handleAllCheckbox:function(e){if(e.stopPropagation(),this.checked.length==this.data.length)this.checked=[];else for(var t in this.checked=[],this.data)this.checked.push(t);this.$emit("checked",this.checked)},generateEmptyRow:function(e){return e("tr",{class:{"listable-tr":!0,"listable-tr-empty":!0}},[e("td",{class:"listable-td",attrs:{colspan:this.columns.length}},[this.$slots.empty])])},generateBodyRows:function(e){var t=this,s=[];0==this.data.length&&s.push(this.generateEmptyRow(e));for(var n=function(n){a.responsiveMode&&s.push(e("tr",{class:{"listable-tr-checkbox":!0,"listable-tr-checked":-1!==a.checked.indexOf(n)}},[e("td",{class:{"listable-checkbox":!0},on:{click:function(e){return t.handleCheckbox(e,n)}}})]));var i="tr_"+n,c={click:Function()};a.expandable&&(c.click=function(e){t.handleExpander(e,n)});var o={class:{"listable-tr":!0,"listable-tr-checked":-1!==a.checked.indexOf(n)},style:{}};a.rowHook(o,a.data[n]),s.push(e("tr",{class:o.class,style:o.style,on:c,ref:i},a.generateBodyRowCells(e,n,a.data[n]))),a.expandable&&-1!==a.expanded.indexOf(n)&&a.$scopedSlots.expander&&s.push(a.generateExpander(e,a.data[n]))},a=this,i=0;i<this.data.length;i++)n(i);return s},generateBodyRowCells:function(e,t,s){var n=this,a=[];this.checkbox&&a.push(e("td",{class:"listable-td listable-td-checkbox"},[e("span",{class:"listable-checkbox",on:{click:function(e){return n.handleCheckbox(e,t)}}})]));var i=function(n){if(c.columns[n].isCheckbox)return"continue";var i=c.columns[n].column,o="td_"+t+"_"+n+"_"+Date.now(),l=null,r=null;c.responsiveMode&&(r=e("div",{class:["listable-td-th"]},c.columns[n].display));var h={class:{"listable-td":!0},style:{},parent:c.$refs["tr_"+t]};h.class["listable-td-col-"+c.columns[n].column]=!0,c.hook(h,s,i);var d=c.$scopedSlots[i];if(d){var u=d(s);l=e("td",{class:h.class,style:h.style,ref:o},[r,u])}else l=e("td",{class:h.class,style:h.style,ref:o},[r,void 0===s[i]||null===s[i]||s[i].constructor===Array||s[i].constructor===Object||s[i].constructor===Function?"":s[i]]);a.push(l)},c=this;for(var o in this.columns)i(o);return a},generateExpander:function(e,t){return e("ListableExpander",{props:{colspan:this.columns.length,expanderSlot:this.$scopedSlots.expander,row:t}})},generateHead:function(e){return e("ListableHead",{props:{checkbox:this.checkbox,checked:this.checked,data:this.data,headings:this.headings},on:{updateColumns:this.updateColumns,handleAllCheckbox:this.handleAllCheckbox}})},updateColumns:function(e){this.columns=e},generatePaginator:function(e){return this.$slots.paginator?e("div",{class:"listable-paginator"},this.$slots.paginator):null},handleResponsive:function(){var e=this;clearTimeout(this.resizeTimeout),this.resizeTimeout=setTimeout((function(){var t=window.innerWidth,s=e.$refs.container,n=e.$refs.table,a=0,i=0;s&&(a=s.clientWidth),n&&(i=n.clientWidth),t>e.responsiveMaxWidth&&(e.responsiveMode=!1),i>a&&(e.responsiveMaxWidth=t,e.responsiveMode=!0)}),100)}},watch:{data:{handler:function(){this.checkbox&&(this.checked=[])}}},updated:function(){var e=this;this.$nextTick((function(){e.responsive&&e.handleResponsive()}))},beforeDestroy:function(){this.responsive&&window.removeEventListener("resize",this.handleResponsive)}}),i={install:function(e){e.component("Listable",a)}};export default i;
