var Column = class Column {
  constructor(searchable, isCheckbox, display, sortable, column, ascending) {
    this.searchable = !!searchable;
    this.isCheckbox = !!isCheckbox;
    this.display = display;
    this.sortable = !!sortable;
    this.column = column;
    this.ascending = ascending !== undefined ? !!ascending : true;
    this.descending = !this.ascending;
    this.defaultAscending = !!this.ascending;
    this.calculateClasses();
  }

  oppositeSort() {
    this.descending = !this.descending;
    this.ascending = !this.ascending;
    this.calculateClasses();
  }

  resetSort() {
    this.ascending = this.defaultAscending;
    this.descending = !this.defaultAscending;
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
    if (this.column) {
      this.classes[`listable-th-col-${this.column}`] = true;
    }
  }
}

export default Column;