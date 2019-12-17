const Expander = {
  render: function (createElement) {
    return createElement(
      "tr",
      {
        class: {
          "listable-tr": true,
          "listable-tr-expander": true
        }
      },
      [
        createElement(
          "td",
          {
            class: [
              "listable-td"
            ],
            attrs: {
              colspan: this.colspan
            }
          },
          this.expanderSlot(this.row)
        )
      ]
    );
  },
  props: {
    colspan: {
      type: Number,
      default: 0
    },
    row: {
      type: Object,
      default: () => {}
    },
    expanderSlot: {
      type: Function,
      default: () => {}
    }
  }
}
export default Expander;