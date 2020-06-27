export default class Column {
  classes: Record<string, unknown>
  searchable: boolean
  isCheckbox: boolean
  display: string
  sortable: boolean
  column: string
  ascending: boolean
  descending: boolean
  defaultAscending: boolean
  constructor(
    searchable: boolean,
    isCheckbox: boolean,
    display: string,
    sortable: boolean,
    column: string,
    ascending: boolean
  ) {
    this.classes = {}
    this.searchable = !!searchable
    this.isCheckbox = !!isCheckbox
    this.display = display
    this.sortable = !!sortable
    this.column = column
    this.ascending = ascending !== undefined ? !!ascending : true
    this.descending = !this.ascending
    this.defaultAscending = !!this.ascending
    this.calculateClasses()
  }

  oppositeSort(): void {
    this.descending = !this.descending
    this.ascending = !this.ascending
    this.calculateClasses()
  }

  resetSort(): void {
    this.ascending = this.defaultAscending
    this.descending = !this.defaultAscending
    this.calculateClasses()
  }

  calculateClasses(): void {
    this.classes = {
      'listable-th': true,
      'listable-th-checkbox': this.isCheckbox,
      sortable: this.sortable,
      ascending: this.sortable && this.ascending,
      descending: this.sortable && this.descending,
    }
    if (this.column) {
      this.classes[`listable-th-col-${this.column}`] = true
    }
  }
}
