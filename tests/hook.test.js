import { shallowMount } from '@vue/test-utils'
import Listable from '../src/js/listable';

const first_page_data = [
  {
    id: 1,
    price: 500,
    paid: true
  },
  {
    id: 2,
    price: 1000,
    paid: false
  }
];

const second_page_data = [
  {
    id: 1,
    price: 3500,
    paid: false
  },
  {
    id: 2,
    price: 4500,
    paid: true
  }
];
describe('Component', () => {
  test('Hooks', () => {
    const onHook = function (calculated, props, column) {
      if (column == 'price') {
        calculated.class['paid'] = props.paid;
      }
    }

    const onRowHook = function (calculated, props) {
      calculated.class['finished'] = props.paid;
    }

    const headings = [
      {
        display: "ID",
        column: "id",
      },
      {
        display: "Price",
        column: "price"
      }
    ];
    let swrapper = shallowMount(Listable, {
      propsData: {
        headings: headings,
        hook: onHook,
        rowHook: onRowHook
      }
    });

    swrapper.setProps({ data: first_page_data })

    const first_tr = swrapper.find('.listable-body .listable-tr:first-child');

    swrapper.vm.$nextTick(() => {
      let price_td = first_tr.find('.listable-td-col-price');
      expect(price_td.classes()).toContain('paid');
      expect(first_tr.classes()).toContain('finished');
      swrapper.setProps({ data: second_page_data });
      swrapper.vm.$nextTick(() => {
        expect(price_td.classes()).not.toContain('paid');
        expect(first_tr.classes()).not.toContain('finished');
        swrapper.setProps({ data: first_page_data })
        swrapper.vm.$nextTick(() => {
          expect(price_td.classes()).toContain('paid');
        });
      });
    })
  })
})
