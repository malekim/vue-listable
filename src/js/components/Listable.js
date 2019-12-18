import ListableExpander from './ListableExpander';
import ListableHead from './ListableHead';

const listable = {
  components: {
    ListableExpander,
    ListableHead
  },
  render(createElement) {
    const table = this.generateTable(createElement);
    const paginator = this.generatePaginator(createElement);
    return createElement(
      "div",
      {
        class: "listable-container",
        ref: "container"
      },
      [
        table,
        paginator
      ]
    );
  },
  props: {
    headings: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    },
    checkbox: {
      type: Boolean,
      default: false
    },
    expandable: {
      type: Boolean,
      default: false
    },
    responsive: {
      type: Boolean,
      default: true
    },
    hook: {
      type: Function,
      default: () => {}
    },
    rowHook: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      // columns
      columns: [],
      // IDs of marked rows
      checked: [],
      // IDs of expanded rows
      expanded: [],
      // needed to debounce resize
      resizeTimeout: null,
      // is responsive mode turned on
      responsiveMode: false,
      // is set after resize
      responsiveMaxWidth: Infinity
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.checkErrors();
      if (this.responsive) {
        window.addEventListener('resize', this.handleResponsive);
      }
    });
  },
  methods: {
    checkErrors() {
      for (const i in this.headings) {
        let column = this.headings[i].column;
        for (const d in this.data) {
          if (!this.data[d].hasOwnProperty(column)) {
            console.error(`Data does not contain column ${column}`);
          }
        }
      }
    },
    generateTable(createElement) {
      const head = this.generateHead(createElement);
      const body = this.generateBody(createElement);
      return createElement(
        "table",
        {
          class: {
            "listable": true,
            "responsive-mode": this.responsiveMode
          },
          ref: "table"
        },
        [
          head,
          body
        ]
      );
    },
    generateBody(createElement) {
      return createElement(
        "tbody",
        {
          class: "listable-body"
        },
        this.generateBodyRows(createElement)
      );
    },
    handleExpander(event, index) {
      event.stopPropagation();

      var idx = this.expanded.indexOf(index);
      if (idx !== -1) {
        this.expanded.splice(idx, 1);
      } 
      else {
        this.expanded.push(index);
      }
      this.$emit("expanded", this.expanded);
    },
    handleCheckbox(event, index) {
      event.stopPropagation();
      
      var idx = this.checked.indexOf(index);
      if (idx !== -1) {
        this.checked.splice(idx, 1);
      } else {
        this.checked.push(index);
      }
      this.$emit("checked", this.checked);
    },
    handleAllCheckbox(event) {
      event.stopPropagation();
      
      // if all are checked, just uncheck all
      // if nothing is checked or some are checked, check all
      if (this.checked.length == this.data.length) {
        this.checked = [];
      }
      else {
        this.checked = [];
        for (const row_index in this.data) {
          this.checked.push(row_index);
        }
      }
      this.$emit("checked", this.checked);
    },
    generateEmptyRow(createElement) {
      return createElement(
        "tr",
        {
          class: {
            "listable-tr": true,
            "listable-tr-empty": true
          }
        },
        [
          createElement(
            "td",
            {
              class: "listable-td",
              attrs: {
                colspan: this.columns.length
              }
            },
            [
              this.$slots.empty
            ]
          )
        ]
      )
    },
    generateBodyRows(createElement) {
      const body_rows = [];
      if (this.data.length == 0) {
        body_rows.push(this.generateEmptyRow(createElement))
      }
      for (const index in this.data) {
        if (this.responsiveMode) {
          body_rows.push(
            createElement(
              "tr",
              {
                class: {
                  "listable-tr-checkbox": true,
                  "listable-tr-checked": this.checked.indexOf(index) !== -1
                }
              },
              [
                createElement(
                  "td",
                  {
                    class: {
                      "listable-checkbox": true
                    },
                    on: {
                      click: (event) => this.handleCheckbox(event, index)
                    }
                  }
                )
              ]
            )
          );
        }
        let ref = `tr_${index}`;
        let handlers = {};
        if (this.expandable) {
          handlers.click = ((event) => {
            this.handleExpander(event, index);
          });
        }
        let calculated = {
          class: {
            "listable-tr": true,
            "listable-tr-checked": this.checked.indexOf(index) !== -1
          },
          style: {}
        };
        this.rowHook(calculated, this.data[index]);
        body_rows.push(
          createElement(
            "tr",
            {
              class: calculated.class,
              style: calculated.style,
              on: handlers,
              ref: ref
            },
            this.generateBodyRowCells(createElement, index, this.data[index])
          )
        );
        if (this.expandable && this.expanded.indexOf(index) !== -1 && this.$scopedSlots["expander"]) {
          body_rows.push(this.generateExpander(createElement, this.data[index]));
        }
      }
      return body_rows;
    },
    generateBodyRowCells(createElement, row_index, row) {
      const row_cells = [];
      if (this.checkbox) {
        row_cells.push(
          createElement(
            "td",
            {
              class: "listable-td listable-td-checkbox"
            },
            [
              createElement(
                "span",
                {
                  class: "listable-checkbox",
                  on: {
                    click: (event) => this.handleCheckbox(event, row_index)
                  }
                }
              )
            ]
          )
        );
      }

      for (const index in this.columns) {
        if (this.columns[index].isCheckbox) {
          continue;
        }
        let column_name = this.columns[index].column;
        let row_cell = null;
        let ref = `td_${row_index}_${index}_${Date.now()}`;
        let responsive_th = null;
        if (this.responsiveMode) {
          responsive_th = createElement(
            "div",
            {
              class: [
                "listable-td-th"
              ]
            },
            this.columns[index].display
          )
        }
        let calculated = {
          class: {
            "listable-td": true
          },
          style: {},
          parent: this.$refs[`tr_${row_index}`]
        };
        calculated.class[`listable-td-col-${this.columns[index].column}`] = true;
        this.hook(calculated, row, column_name);
        if (this.$scopedSlots[column_name]) {
          let slot = this.$scopedSlots[column_name](row);
          row_cell = createElement(
            "td",
            {
              class: calculated.class,
              style: calculated.style,
              ref: ref
            },
            [responsive_th, slot]
          )
        } 
        else {
          row_cell = createElement(
            "td",
            {
              class: calculated.class,
              style: calculated.style,
              ref: ref
            },
            [
              responsive_th,
              (() => {
                if (row[column_name] === undefined || row[column_name] === null) {
                  return "";
                }
                if (row[column_name].constructor === Array || row[column_name].constructor === Object || row[column_name].constructor === Function) {
                  return "";
                }
                return row[column_name]
              })()
            ]
          )
        }
        row_cells.push(row_cell);
      }

      return row_cells;
    },
    generateExpander(createElement, row) {
      return createElement(
        "ListableExpander",
        {
          props: {
            colspan: this.columns.length,
            expanderSlot: this.$scopedSlots["expander"],
            row: row
          }
        }
      );
    },
    generateHead(createElement, row) {
      return createElement(
        "ListableHead",
        {
          props: {
            checkbox: this.checkbox,
            checked: this.checked,
            data: this.data,
            headings: this.headings
          },
          on: {
            updateColumns: this.updateColumns,
            handleAllCheckbox: this.handleAllCheckbox
          }
        }
      );
    },
    updateColumns(columns) {
      this.columns = columns;
    },
    generatePaginator(createElement) {
      if (this.$slots.paginator) {
        return createElement(
          "div",
          {
            class: "listable-paginator"
          },
          this.$slots.paginator
        );
      }
      return null;
    },
    handleResponsive() {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        let windowWidth = window.innerWidth;
        let containerWidth = this.$refs.container.clientWidth;
        let tableWidth = this.$refs.table.clientWidth;
        if (windowWidth > this.responsiveMaxWidth) {
          this.responsiveMode = false;
        }
        if (tableWidth > containerWidth) {
          this.responsiveMaxWidth = windowWidth;
          this.responsiveMode = true;
        }
      }, 100);
    }
  },
  watch: {
    data: {
      handler() {
        /**
         * Reset checked options when page turns
         */
        if (this.checkbox) {
          this.checked = [];
        }
      }
    }
  },
  updated() {
    this.$nextTick(() => {
      this.handleResponsive();
    });
  },
  beforeDestroy() {
    if (this.responsive) {
      window.removeEventListener('resize', this.handleResponsive);
    }
  }
}
export default listable;