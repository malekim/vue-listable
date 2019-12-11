var Column = class Column {
  constructor(searchable, isCheckbox, display, sortable, column, descending) {
    this.searchable = !!searchable;
    this.isCheckbox = !!isCheckbox;
    this.display = display;
    this.sortable = !!sortable;
    this.column = column;
    this.descending = !!descending;
    this.ascending = !descending;
    this.calculateClasses();
  }

  oppositeSort() {
    this.descending = !this.descending;
    this.ascending = !this.ascending;
    this.calculateClasses();
  }

  calculateClasses() {
    this.classes = {
      "listable-th": true,
      "listable-th-checkbox": this.isCheckbox,
      "sortable": this.sortable,
      "ascending": this.sortable && this.ascending,
      "descending": this.sortable && this.descending
    };
  }
}

export default Column;