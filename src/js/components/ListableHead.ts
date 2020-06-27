import Vue, { CreateElement, PropType, VNode } from 'vue'

import Column from '../entity/Column'
import Heading from '../entity/Heading'

const ListableHead = Vue.extend({
  render(createElement: CreateElement): VNode {
    return createElement(
      'thead',
      {
        class: 'listable-head',
      },
      this.generateHeaderRows(createElement)
    )
  },
  data(): {
    columns: Array<Column>
    searchable: boolean
    // columns with search
    searched: any
    // needed to debounce search
    searchTimeout: any
  } {
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
      default: false,
    },
    checked: {
      type: Array as PropType<Record<string, unknown>[]>,
      default: (): Record<string, unknown>[] => [],
    },
    data: {
      type: Array as PropType<Record<string, unknown>[]>,
      default: (): Record<string, unknown>[] => [],
    },
    headings: {
      type: Array as PropType<Heading[]>,
      default: (): Heading[] => [],
    },
  },
  mounted() {
    this.searchable = this.isSearchable()
    this.columns = this.calculateColumns()
    this.$emit('updateColumns', this.columns)
  },
  methods: {
    calculateColumns(): Array<Column> {
      const columns = []
      if (this.checkbox) {
        const column = new Column(false, true, '', false, '', true)
        columns.push(column)
      }
      for (const index in this.headings) {
        const column = new Column(
          this.headings[index].search,
          false,
          this.headings[index].display,
          this.headings[index].sortable,
          this.headings[index].column,
          this.headings[index].ascending
        )
        columns.push(column)
      }
      return columns
    },
    generateHeaderRows(createElement: CreateElement): Array<VNode> {
      const header_rows = []

      header_rows.push(
        createElement(
          'tr',
          {
            class: {
              'listable-tr': true,
              'listable-tr-checked':
                this.checked.length > 0 &&
                this.checked.length === this.data.length,
            },
          },
          [this.generateHeaderCells(createElement)]
        )
      )

      if (this.searchable && this.data.length > 0) {
        header_rows.push(
          createElement(
            'tr',
            {
              class: {
                'listable-tr': true,
                'listable-tr-checked':
                  this.checked.length > 0 &&
                  this.checked.length === this.data.length,
                'listable-tr-search': true,
              },
            },
            [this.generateHeaderSearchCells(createElement)]
          )
        )
      }

      return header_rows
    },
    generateHeaderCells(createElement: CreateElement): Array<VNode> {
      const header_cells = []
      for (let index = 0; index < this.columns.length; index++) {
        const elements: any = []
        if (this.columns[index].isCheckbox) {
          // if no data, do not render empty checkbox column
          if (this.data.length == 0) {
            continue
          }
          elements.push(
            createElement('span', {
              class: {
                'listable-checkbox': true,
              },
              on: {
                click: (event: Event) => {
                  this.$emit('handleAllCheckbox', event)
                },
              },
            })
          )
        }
        if (this.columns[index].display) {
          elements.push(this.columns[index].display)
        }
        const handlers = {
          click: Function(),
        }
        if (this.columns[index].sortable) {
          handlers.click = (event: Event) => {
            this.handleSort(event, index)
          }
        }

        const header_cell = createElement(
          'th',
          {
            class: this.columns[index].classes,
            on: handlers,
          },
          elements
        )
        header_cells.push(header_cell)
      }
      return header_cells
    },
    generateHeaderSearchCells(createElement: CreateElement): Array<VNode> {
      const header_cells = []
      for (let index = 0; index < this.columns.length; index++) {
        const elements = []
        if (this.columns[index].searchable) {
          elements.push(
            createElement('input', {
              class: 'listable-search',
              on: {
                input: (event: Event) => {
                  // debounce
                  clearTimeout(this.searchTimeout)
                  this.searchTimeout = setTimeout(() => {
                    const element = event.target as HTMLInputElement
                    this.$emit('input', element.value)
                    this.searched = Object.assign(
                      { column: element.value },
                      this.searched
                    )
                    this.$parent.$emit('search', this.searched)
                  }, 500)
                },
              },
            })
          )
        }
        const header_cell = createElement(
          'th',
          {
            class: ['listable-th'],
          },
          elements
        )
        header_cells.push(header_cell)
      }
      return header_cells
    },
    handleSort(event: Event, index: number): void {
      event.stopPropagation()
      // find column by index
      const column = this.columns[index]
      this.columns.map((obj) => {
        if (obj.column != column.column) {
          obj.resetSort()
        }
      })
      this.columns[index].oppositeSort()
      const sortable = {
        column: column.column,
        ascending: column.ascending,
      }
      this.$parent.$emit('sorted', sortable)
      this.$forceUpdate()
    },
    isSearchable(): boolean {
      for (const index in this.headings) {
        if (this.headings[index].search) {
          return true
        }
      }
      return false
    },
  },
})

export default ListableHead
