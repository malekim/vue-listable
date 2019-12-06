var e={render:function(e){var t=this.generateTable(e),a=this.generatePaginator(e);return this.searchable=this.isSearchable(),e("div",{class:"listable-container"},[t,a])},props:{headings:{type:Array,default:function(){return[]}},data:{type:Array,default:function(){return[]}},checkbox:{type:Boolean,default:!0}},data:function(){return{checked:[],searchable:!1,searched:{}}},mounted:function(){this.checkErrors()},methods:{checkErrors:function(){this.data.length>0&&this.headings.length!==this.data[0].length&&console.error("Header length("+this.headings.length+") and row length("+this.data[0].length+") are not equal.")},generateTable:function(e){return e("div",{class:"listable"},[this.generateHeader(e),this.generateBody(e)])},generateHeader:function(e){return e("div",{class:"listable-header"},this.generateHeaderRows(e))},generateHeaderRows:function(e){var t=[];return t.push(e("div",{class:{"listable-tr":!0,"listable-tr-active":this.checked.length>0&&this.checked.length===this.data.length}},[this.generateHeaderCells(e,!1)])),this.searchable&&t.push(e("div",{class:{"listable-tr":!0,"listable-tr-search":!0}},[this.generateHeaderCells(e,!0)])),t},isSearchable:function(){for(var e in this.headings)if(this.headings[e].search)return!0;return!1},generateHeaderCells:function(e,t){var a=this,s=[];this.checkbox&&s.push(e("div",{class:{"listable-th":!0,"listable-th-checkbox":!0}},[t?null:e("div",{class:{"listable-checkbox":!0},on:{click:function(){if(a.checked.length>0)a.checked=[];else for(var e in a.checked=[],a.data)a.checked.push(e);a.$emit("checked",a.checked)}}})]));var i=function(i){var n=null;if(t&&a.headings[i].search){var r=null;n=e("input",{class:"listable-search",on:{input:function(e){clearTimeout(r),r=setTimeout((function(){a.$emit("input",e.target.value),a.searched[a.headings[i].column]=e.target.value,a.$emit("search",a.searched)}),500)}}})}var l=null;t||(l=a.headings[i].display),s.push(e("div",{class:"listable-th"},[l,n]))};for(var n in a.headings)i(n);return s},generateBody:function(e){return e("div",{class:"listable-body"},this.generateBodyRows(e))},generateBodyRows:function(e){var t=[];for(var a in this.data){var s="tr_"+a;t.push(e("div",{class:{"listable-tr":!0,"listable-tr-active":-1!==this.checked.indexOf(a)},ref:s},this.generateBodyRowCells(e,a,this.data[a])))}return t},generateBodyRowCells:function(e,t,a){var s=this,i=[];this.checkbox&&i.push(e("div",{class:"listable-td listable-td-checkbox"},[e("div",{class:"listable-checkbox",on:{click:function(){var e=s.checked.indexOf(t);-1!==e?s.checked.splice(e,1):s.checked.push(t),s.$emit("checked",s.checked)}}})]));var n=function(n){var r=s.headings[n].column,l=null,c="td_"+t+"_"+n;if(s.$scopedSlots[r]){var h=s.$scopedSlots[r](a);l=e("div",{class:["listable-td"],style:[],ref:c},[h])}else l=e("div",{class:["listable-td"],style:[],ref:c},void 0===a[r]||null===a[r]?"":a[r].constructor===Array?"":a[r].constructor===Object?"":a[r]);i.push(l),s.$nextTick((function(){s.$emit("hook",s.$refs[c],r,a)}))};for(var r in s.headings)n(r);return i},generatePaginator:function(e){return this.$slots.paginator?e("div",{class:"listable-paginator"},this.$slots.paginator):null}},beforeDestroy:function(){}},t={install:function(t,a){t.component("listable",e)}};export default t;
