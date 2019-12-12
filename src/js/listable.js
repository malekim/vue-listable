import Expander from './expander';
import Column from './model/column';

const listable = {
  components: {
    Expander
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
      // is_searchable
      searchable: false,
      // columns with search
      searched: {},
      // needed to debounce search
      searchTimeout: null,
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
      this.columns = this.calculateColumns();
      this.searchable = this.isSearchable();
      if (this.responsive) {
        window.addEventListener('resize', this.handleResponsive);
      }
    });
  },
  methods: {
    calculateColumns() {
      let columns = [];
      if (this.checkbox) {
        let column = new Column(
          false,
          true,
          "",
          false,
          "",
          true
        );
        columns.push(column);
      }
      for (const index in this.headings) {
        let column = new Column(
          this.headings[index].search,
          false,
          this.headings[index].display,
          this.headings[index].sortable,
          this.headings[index].column,
          this.headings[index].ascending
        );
        columns.push(column);
      }
      return columns;
    },
    checkErrors() {
      if (this.data.length > 0 && this.headings.length !== this.data[0].length) {
        console.error(`Header's row length (${this.headings.length}) and body's row length (${this.data[0].length}) are not equal.`);
      }
    },
    generateTable(createElement) {
      const header = this.generateHeader(createElement);
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
          header,
          body
        ]
      );
    },
    generateHeader(createElement) {
      return createElement(
        "thead",
        {
          class: "listable-header"
        },
        this.generateHeaderRows(createElement)
      );
    },
    generateHeaderRows(createElement) {
      const header_rows = [];

      header_rows.push(createElement(
        "tr",
        {
          class: {
            "listable-tr": true,
            "listable-tr-checked": this.checked.length > 0 && this.checked.length === this.data.length
          }
        },
        [
          this.generateHeaderCells(createElement)
        ]
      ));
      
      if (this.searchable && this.data.length > 0) {
        header_rows.push(createElement(
          "tr",
          {
            class: {
              "listable-tr": true,
              "listable-tr-checked": this.checked.length > 0 && this.checked.length === this.data.length,
              "listable-tr-search": true
            }
          },
          [
            this.generateHeaderSearchCells(createElement)
          ]
        ));
      }

      return header_rows;
    },
    isSearchable() {
      for (const index in this.headings) {
        if (this.headings[index].search) {
          return true;
        }
      }
      return false;
    },
    generateHeaderSearchCells(createElement) {
      const header_cells = [];
      for (const index in this.columns) {
        let elements = [];
        if (this.columns[index].searchable) {
          elements.push(
            createElement(
              "input",
              {
                class: "listable-search",
                on: {
                  input: (event) => {
                    // debounce
                    clearTimeout(this.searchTimeout);
                    this.searchTimeout = setTimeout(() => {
                      this.$emit("input", event.target.value);
                      this.searched[this.columns[index].column] = event.target.value;
                      this.$emit("search", this.searched);
                    }, 500);
                  }
                }
              }
            )
          );
        }
        let header_cell = createElement(
          "th",
          {
            class: [
              "listable-th"
            ]
          },
          elements
        )
        header_cells.push(header_cell);
      }
      return header_cells;
    },
    generateHeaderCells(createElement) {
      const header_cells = [];
      for (const index in this.columns) {
        let elements = [];
        if (this.columns[index].isCheckbox) {
          // if no data, do not render empty checkbox column
          if (this.data.length == 0) {
            continue;
          }
          elements.push(
            createElement(
              "span",
              {
                class: {
                  "listable-checkbox": true
                },
                on: {
                  click: this.handleAllCheckbox
                }
              }
            )
          );
        }
        if (this.columns[index].display) {
          elements.push(this.columns[index].display);
        }
        let handlers = {};
        if (this.columns[index].sortable) {
          handlers.click = ((event) => {
            this.handleSort(event, index);
          });
        }

        let header_cell = createElement(
          "th",
          {
            class: this.columns[index].classes,
            on: handlers
          },
          elements
        )
        header_cells.push(header_cell);
      }
      return header_cells;
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
    handleSort(event, index) {
      event.stopPropagation();
      // find column by index
      let column = this.columns[index];
      this.columns.map((obj) => {
        if (obj.column != column.column) {
          obj.resetSort();
        }
      });
      this.columns[index].oppositeSort();
      let sortable = {
        column: column.column,
        ascending: column.ascending
      };
      this.$emit("sorted", sortable);
      this.$forceUpdate();
    },
    handleAllCheckbox(event) {
      event.stopPropagation();

      if (this.checked.length > 0) {
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
        let ref = `tr_${index}_${Date.now()}`;
        body_rows.push(
          createElement(
            "tr",
            {
              class: {
                "listable-tr": true,
                "listable-tr-checked": this.checked.indexOf(index) !== -1
              },
              on: {
                click: (event) => {
                  event.stopPropagation();
                  if (!this.expandable) {
                    return;
                  }
                  var idx = this.expanded.indexOf(index);
                  if (idx !== -1) {
                    this.expanded.splice(idx, 1);
                  } 
                  else {
                    this.expanded.push(index);
                  }
                  this.$emit("expanded", this.expanded);
                }
              },
              ref: ref
            },
            this.generateBodyRowCells(createElement, index, this.data[index])
          )
        );
        if (this.expandable && this.expanded.indexOf(index) !== -1) {
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
                "td",
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
        if (this.$scopedSlots[column_name]) {
          let slot = this.$scopedSlots[column_name](row);
          row_cell = createElement(
            "td",
            {
              class: [
                "listable-td",
                `listable-td-col-${this.columns[index].column}`,
                ref
              ],
              style: [],
              ref: ref
            },
            [responsive_th, slot]
          )
        } 
        else {
          row_cell = createElement(
            "td",
            {
              class: [
                "listable-td",
                `listable-td-col-${this.columns[index].column}`,
                ref
              ],
              style: [],
              ref: ref
            },
            [
              responsive_th,
              (() => {
                if (row[column_name] === undefined || row[column_name] === null) {
                  return "";
                }
                if (row[column_name].constructor === Array) {
                  return "";
                }
                if (row[column_name].constructor === Object) {
                  return "";
                }
                return row[column_name]
              })()
            ]
          )
        }
        row_cells.push(row_cell);
        this.$nextTick(() => {
          this.$emit("hook", this.$refs[ref], column_name, row);
        });
      }

      return row_cells;
    },
    generateExpander(createElement, row) {
      if (this.$scopedSlots["expander"]) {
        return createElement(
          "Expander",
          {
            props: {
              colspan: this.columns.length,
              expanderSlot: this.$scopedSlots["expander"],
              row: row
            }
          }
        );
      }
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
        if (this.$refs.container) {
          let containerWidth = this.$refs.container.clientWidth;
          let tableWidth = this.$refs.table.clientWidth;
          if (windowWidth > this.responsiveMaxWidth) {
            this.responsiveMode = false;
          }
          if (tableWidth > containerWidth) {
            this.responsiveMaxWidth = windowWidth;
            this.responsiveMode = true;
          }
        }
      }, 100);
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