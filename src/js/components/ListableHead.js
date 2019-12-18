import Column from '../entity/Column';

const ListableHead = {
  render: function (createElement) {
    return createElement(
      "thead",
      {
        class: "listable-head"
      },
      this.generateHeaderRows(createElement)
    );
  },
  data() {
    return {
      columns: [],
      // is_searchable
      searchable: false,
      // columns with search
      searched: {},
      // needed to debounce search
      searchTimeout: null,
    }
  },
  props: {
    checkbox: {
      type: Boolean,
      default: false
    },
    checked: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    },
    headings: {
      type: Array,
      default: () => []
    }
  },
  mounted() {
    this.searchable = this.isSearchable();
    this.columns = this.calculateColumns();
    this.$emit("updateColumns", this.columns);
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
                  click: (event) => {
                    this.$emit('handleAllCheckbox', event);
                  }
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
                      this.$parent.$emit("search", this.searched);
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
      this.$parent.$emit("sorted", sortable);
      this.$forceUpdate();
    },
    isSearchable() {
      for (const index in this.headings) {
        if (this.headings[index].search) {
          return true;
        }
      }
      return false;
    }
  }
}
export default ListableHead;