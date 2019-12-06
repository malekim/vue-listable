const listable = {
  render: function (createElement) {
    const table = this.generateTable(createElement);
    const paginator = this.generatePaginator(createElement);
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
    actions: {
      type: Array,
      default: () => []
    },
    cells: {
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
      // columns with search
      searched: {}
    };
  },
  mounted() {
    this.checkErrors();
  },
  methods: {
    checkErrors() {
      if (this.data.length > 0 && this.cells.length !== this.data[0].length) {
        console.error(`Header length(${this.cells.length}) and row length(${this.data[0].length}) are not equal.`);
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
          class: "listable-header-row"
        },
        [
          this.generateHeaderCells(createElement, false)
        ]
      ));

      header_rows.push(createElement(
        "div",
        {
          class: {
            "listable-header-row": true,
            "listable-header-search-row": true
          }
        },
        [
          this.generateHeaderCells(createElement, true)
        ]
      ));

      return header_rows;
    },
    generateHeaderCells(createElement, search_row) {
      const header_cells = [];
      if (this.checkbox) {
        header_cells.push(
          createElement(
            "div",
            {
              class: {
                "listable-header-cell": true,
                "listable-header-cell-checkbox": true
              }
            },
            []
          )
        );
      }
      for (const index in this.cells) {
        let search_subcell = null;
        // if it is search row inside header
        if (search_row) {
          if (this.cells[index].search) {
            var timeout = null;
            search_subcell = createElement(
              "input",
              {
                class: "listable-header-search",
                on: {
                  input: (event) => {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => {
                      this.$emit("input", event.target.value);
                      this.searched[this.cells[index].column] = event.target.value;
                      this.$emit("search", this.searched);
                    }, 500);
                  }
                }
              }
            );
          }
        }
        let name_subcell = null;
        if (!search_row) {
          name_subcell = this.cells[index].name;
        }
        header_cells.push(
          createElement(
            "div",
            {
              class: "listable-header-cell"
            },
            [
              name_subcell,
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
        body_rows.push(
          createElement(
            "div",
            {
              class: {
                "listable-row": true,
                "listable-row-active": this.checked.indexOf(index) !== -1
              }
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
              class: "listable-body-cell listable-body-cell-checkbox"
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
      for (const index in this.cells) {
        if (this.cells[index].column === "actions") {
          if (this.$scopedSlots.action) {
            row_cells.push(
              createElement(
                "div",
                {
                  class: "listable-body-cell"
                },
                [this.$scopedSlots.action(row)]
              )
            );
          }
        } else {
          row_cells.push(
            createElement(
              "div",
              {
                class: "listable-body-cell"
              },
              row[this.cells[index].column]
            )
          );
        }
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

  }
}
export default listable;