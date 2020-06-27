import Vue, { CreateElement, PropType, VNode } from 'vue'

const ListableExpander = Vue.extend({
  render(createElement: CreateElement): VNode {
    return createElement(
      'tr',
      {
        class: {
          'listable-tr': true,
          'listable-tr-expander': true,
        },
      },
      [
        createElement(
          'td',
          {
            class: ['listable-td'],
            attrs: {
              colspan: this.colspan,
            },
          },
          this.expanderSlot(this.row)
        ),
      ]
    )
  },
  props: {
    colspan: {
      type: Number,
      default: 0,
    },
    row: {
      type: Object as PropType<Record<string, unknown>>,
      default: () => {},
    },
    expanderSlot: {
      type: Function,
      default: (): any => {},
    },
  },
})

export default ListableExpander
