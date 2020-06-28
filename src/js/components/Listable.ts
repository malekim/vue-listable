import Vue, { CreateElement, PropType, VNode } from 'vue'
import ListableExpander from './ListableExpander'
import ListableHead from './ListableHead'
import Heading from '../entity/Heading'

const Listable = Vue.extend({
  name: 'VueListable',
  render(createElement: CreateElement): VNode {
    const table = this.generateTable(createElement)
    const paginator = this.generatePaginator(createElement)
    return createElement(
      'div',
      {
        class: 'listable-container',
        ref: 'container',
      },
      [table, paginator]
    )
  },
  components: {
    ListableExpander,
    ListableHead,
  },
  props: {
    headings: {
      type: Array as PropType<Heading[]>,
      default: (): Heading[] => [],
    },
    data: {
      type: Array as PropType<Record<string, unknown>[]>,
      default: (): Record<string, unknown>[] => [],
    },
    checkbox: {
      type: Boolean,
      default: false,
    },
    expandable: {
      type: Boolean,
      default: false,
    },
    responsive: {
      type: Boolean,
      default: true,
    },
    hook: {
      type: Function,
      default: (): any => {},
    },
    rowHook: {
      type: Function,
      default: (): any => {},
    },
  },
  data(): {
    columns: Array<any>
    checked: Array<any>
    expanded: Array<any>
    resizeTimeout: any
    responsiveMode: boolean
    responsiveMaxWidth: number
  } {
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
      responsiveMaxWidth: Infinity,
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.checkErrors()
      if (this.responsive) {
        window.addEventListener('resize', this.handleResponsive)
      }
    })
  },
  methods: {
    checkErrors(): void {
      for (let i = 0, len = this.headings.length; i < len; i++) {
        const column = this.headings[i].column
        for (let d = 0, dlen = this.data.length; d < dlen; d++) {
          if (!this.data[d].hasOwnProperty(column)) {
            console.error(`Data does not contain column ${column}`)
          }
        }
      }
    },
    generateTable(createElement: CreateElement): VNode {
      const head = this.generateHead(createElement)
      const body = this.generateBody(createElement)
      return createElement(
        'table',
        {
          class: {
            listable: true,
            'responsive-mode': this.responsiveMode,
          },
          ref: 'table',
        },
        [head, body]
      )
    },
    generateBody(createElement: CreateElement): VNode {
      return createElement(
        'tbody',
        {
          class: 'listable-body',
        },
        this.generateBodyRows(createElement)
      )
    },
    handleExpander(event: Event, index: number): void {
      event.stopPropagation()

      const idx = this.expanded.indexOf(index)
      if (idx !== -1) {
        this.expanded.splice(idx, 1)
      } else {
        this.expanded.push(index)
      }
      this.$emit('expanded', this.expanded)
    },
    handleCheckbox(event: Event, index: number): void {
      event.stopPropagation()

      const idx = this.checked.indexOf(index)
      if (idx !== -1) {
        this.checked.splice(idx, 1)
      } else {
        this.checked.push(index)
      }
      this.$emit('checked', this.checked)
    },
    handleAllCheckbox(event: Event): void {
      event.stopPropagation()

      // if all are checked, just uncheck all
      // if nothing is checked or some are checked, check all
      if (this.checked.length == this.data.length) {
        this.checked = []
      } else {
        this.checked = []
        for (const row_index in this.data) {
          this.checked.push(row_index)
        }
      }
      this.$emit('checked', this.checked)
    },
    generateEmptyRow(createElement: CreateElement): VNode {
      return createElement(
        'tr',
        {
          class: {
            'listable-tr': true,
            'listable-tr-empty': true,
          },
        },
        [
          createElement(
            'td',
            {
              class: 'listable-td',
              attrs: {
                colspan: this.columns.length,
              },
            },
            [this.$slots.empty]
          ),
        ]
      )
    },
    generateBodyRows(createElement: CreateElement): Array<VNode> {
      const body_rows = []
      if (this.data.length == 0) {
        body_rows.push(this.generateEmptyRow(createElement))
      }
      for (let index = 0; index < this.data.length; index++) {
        if (this.responsiveMode) {
          body_rows.push(
            createElement(
              'tr',
              {
                class: {
                  'listable-tr-checkbox': true,
                  'listable-tr-checked': this.checked.indexOf(index) !== -1,
                },
              },
              [
                createElement('td', {
                  class: {
                    'listable-checkbox': true,
                  },
                  on: {
                    click: (event: Event) => this.handleCheckbox(event, index),
                  },
                }),
              ]
            )
          )
        }
        const ref = `tr_${index}`
        const handlers = {
          click: Function(),
        }
        if (this.expandable) {
          handlers.click = (event: Event) => {
            this.handleExpander(event, index)
          }
        }
        const calculated = {
          class: {
            'listable-tr': true,
            'listable-tr-checked': this.checked.indexOf(index) !== -1,
          },
          style: {},
        }
        this.rowHook(calculated, this.data[index])
        body_rows.push(
          createElement(
            'tr',
            {
              class: calculated.class,
              style: calculated.style,
              on: handlers,
              ref: ref,
            },
            this.generateBodyRowCells(createElement, index, this.data[index])
          )
        )
        if (
          this.expandable &&
          this.expanded.indexOf(index) !== -1 &&
          this.$scopedSlots['expander']
        ) {
          body_rows.push(this.generateExpander(createElement, this.data[index]))
        }
      }
      return body_rows
    },
    generateBodyRowCells(
      createElement: CreateElement,
      row_index: number,
      row: any
    ): Array<VNode> {
      const row_cells = []
      if (this.checkbox) {
        row_cells.push(
          createElement(
            'td',
            {
              class: 'listable-td listable-td-checkbox',
            },
            [
              createElement('span', {
                class: 'listable-checkbox',
                on: {
                  click: (event: Event) =>
                    this.handleCheckbox(event, row_index),
                },
              }),
            ]
          )
        )
      }

      for (const index in this.columns) {
        if (this.columns[index].isCheckbox) {
          continue
        }
        const column_name = this.columns[index].column
        const ref = `td_${row_index}_${index}_${Date.now()}`
        let row_cell = null
        let responsive_th = null
        if (this.responsiveMode) {
          responsive_th = createElement(
            'div',
            {
              class: ['listable-td-th'],
            },
            this.columns[index].display
          )
        }
        const calculated = {
          class: {
            'listable-td': true,
          },
          style: {},
          parent: this.$refs[`tr_${row_index}`],
        }
        ;(calculated.class as any)[
          `listable-td-col-${this.columns[index].column}`
        ] = true
        this.hook(calculated, row, column_name)
        const scoped_slot = this.$scopedSlots[column_name]
        if (scoped_slot) {
          const slot = scoped_slot(row)
          row_cell = createElement(
            'td',
            {
              class: calculated.class,
              style: calculated.style,
              ref: ref,
            },
            [responsive_th, slot]
          )
        } else {
          row_cell = createElement(
            'td',
            {
              class: calculated.class,
              style: calculated.style,
              ref: ref,
            },
            [
              responsive_th,
              (() => {
                if (
                  row[column_name] === undefined ||
                  row[column_name] === null
                ) {
                  return ''
                }
                if (
                  row[column_name].constructor === Array ||
                  row[column_name].constructor === Object ||
                  row[column_name].constructor === Function
                ) {
                  return ''
                }
                return row[column_name]
              })(),
            ]
          )
        }
        row_cells.push(row_cell)
      }

      return row_cells
    },
    generateExpander(createElement: CreateElement, row: any): VNode {
      return createElement('ListableExpander', {
        props: {
          colspan: this.columns.length,
          expanderSlot: this.$scopedSlots['expander'],
          row: row,
        },
      })
    },
    generateHead(createElement: CreateElement): VNode {
      return createElement('ListableHead', {
        props: {
          checkbox: this.checkbox,
          checked: this.checked,
          data: this.data,
          headings: this.headings,
        },
        on: {
          updateColumns: this.updateColumns,
          handleAllCheckbox: this.handleAllCheckbox,
        },
      })
    },
    updateColumns(columns: Array<any>) {
      this.columns = columns
    },
    generatePaginator(createElement: CreateElement): VNode | null {
      if (this.$slots.paginator) {
        return createElement(
          'div',
          {
            class: 'listable-paginator',
          },
          this.$slots.paginator
        )
      }
      return null
    },
    handleResponsive() {
      clearTimeout(this.resizeTimeout)
      this.resizeTimeout = setTimeout(() => {
        const windowWidth = window.innerWidth
        const container: any = this.$refs.container
        const table: any = this.$refs.table
        let containerWidth = 0
        let tableWidth = 0
        if (container) {
          containerWidth = container.clientWidth
        }
        if (table) {
          tableWidth = table.clientWidth
        }

        if (windowWidth > this.responsiveMaxWidth) {
          this.responsiveMode = false
        }
        if (tableWidth > containerWidth) {
          this.responsiveMaxWidth = windowWidth
          this.responsiveMode = true
        }
      }, 100)
    },
  },
  watch: {
    data: {
      handler() {
        /**
         * Reset checked options when page turns
         */
        if (this.checkbox) {
          this.checked = []
        }
      },
    },
  },
  updated() {
    this.$nextTick(() => {
      if (this.responsive) {
        this.handleResponsive()
      }
    })
  },
  beforeDestroy() {
    if (this.responsive) {
      window.removeEventListener('resize', this.handleResponsive)
    }
  },
})

export default Listable
