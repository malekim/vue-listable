const listable = {
  render: function (createElement) {
    const table = this.generateTable(createElement);
    const paginator = this.generatePaginator(createElement);
    this.searchable = this.isSearchable();
    return createElement(
      "div",
      {
        class: "listable-container"
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
      default: true
    }
  },
  data() {
    return {
      // IDs of marked rows
      checked: [],
      // is_searchable
      searchable: false,
      // columns with search
      searched: {}
    };
  },
  mounted() {
    this.checkErrors();
  },
  methods: {
    checkErrors() {
      if (this.data.length > 0 && this.headings.length !== this.data[0].length) {
        console.error(`Header length(${this.headings.length}) and row length(${this.data[0].length}) are not equal.`);
      }
    },
    generateTable(createElement) {
      const header = this.generateHeader(createElement);
      const body = this.generateBody(createElement);

      return createElement(
        "div",
        {
          class: "listable"
        },
        [
          header,
          body
        ]
      );
    },
    generateHeader(createElement) {
      return createElement(
        "div",
        {
          class: "listable-header"
        },
        this.generateHeaderRows(createElement)
      );
    },
    generateHeaderRows(createElement) {
      const header_rows = [];

      header_rows.push(createElement(
        "div",
        {
          class: {
            "listable-tr": true,
            "listable-tr-active": this.checked.length > 0 && this.checked.length === this.data.length
          }
        },
        [
          this.generateHeaderCells(createElement, false)
        ]
      ));
      
      if (this.searchable) {
        header_rows.push(createElement(
          "div",
          {
            class: {
              "listable-tr": true,
              "listable-tr-search": true
            }
          },
          [
            this.generateHeaderCells(createElement, true)
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
    generateHeaderCells(createElement, search_row) {
      const header_cells = [];
      if (this.checkbox) {
        header_cells.push(
          createElement(
            "div",
            {
              class: {
                "listable-th": true,
                "listable-th-checkbox": true
              }
            },
            [
              (() => {
                if (search_row) {
                  return null;
                }
                return createElement(
                  "div",
                  {
                    class: {
                      "listable-checkbox": true
                    },
                    on: {
                      click: () => {
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
                      }
                    }
                  }
                )
              })()
            ]
          )
        );
      }
      for (const index in this.headings) {
        let search_subcell = null;
        // if it is search row inside header
        if (search_row) {
          if (this.headings[index].search) {
            var timeout = null;
            search_subcell = createElement(
              "input",
              {
                class: "listable-search",
                on: {
                  input: (event) => {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => {
                      this.$emit("input", event.target.value);
                      this.searched[this.headings[index].column] = event.target.value;
                      this.$emit("search", this.searched);
                    }, 500);
                  }
                }
              }
            );
          }
        }
        let display_label = null;
        if (!search_row) {
          display_label = this.headings[index].display;
        }
        header_cells.push(
          createElement(
            "div",
            {
              class: "listable-th"
            },
            [
              display_label,
              search_subcell
            ]
          )
        );
      }
      return header_cells;
    },
    generateBody(createElement) {
      return createElement(
        "div",
        {
          class: "listable-body"
        },
        this.generateBodyRows(createElement)
      );
    },
    generateBodyRows(createElement) {
      const body_rows = [];
      for (const index in this.data) {
        let ref = `tr_${index}`;
        body_rows.push(
          createElement(
            "div",
            {
              class: {
                "listable-tr": true,
                "listable-tr-active": this.checked.indexOf(index) !== -1
              },
              ref: ref
            },
            this.generateBodyRowCells(createElement, index, this.data[index])
          )
        );
      }
      return body_rows;
    },
    generateBodyRowCells(createElement, row_index, row) {
      const row_cells = [];
      if (this.checkbox) {
        row_cells.push(
          createElement(
            "div",
            {
              class: "listable-td listable-td-checkbox"
            },
            [
              createElement(
                "div",
                {
                  class: "listable-checkbox",
                  on: {
                    click: () => {
                      var idx = this.checked.indexOf(row_index);
                      if (idx !== -1) {
                        this.checked.splice(idx, 1);
                      } else {
                        this.checked.push(row_index);
                      }
                      this.$emit("checked", this.checked);
                    }
                  }
                }
              )
            ]
          )
        );
      }
      for (const index in this.headings) {
        let column_name = this.headings[index].column;
        let row_cell = null;
        let ref = `td_${row_index}_${index}`;
        if (this.$scopedSlots[column_name]) {
          let slot = this.$scopedSlots[column_name](row);
          row_cell = createElement(
            "div",
            {
              class: [
                "listable-td"
              ],
              style: [],
              ref: ref
            },
            [slot]
          )
        } else {
          row_cell = createElement(
            "div",
            {
              class: [
                "listable-td"
              ],
              style: [],
              ref: ref
            },
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
          )
        }
        row_cells.push(row_cell);
        
        this.$nextTick(() => {
          this.$emit("hook", this.$refs[ref], column_name, row);
        });
      }

      return row_cells;
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
    }
  },
  beforeDestroy() {
    //
  }
}
export default listable;