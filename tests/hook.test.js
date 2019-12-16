import { createLocalVue, mount } from '@vue/test-utils'
import Listable from '../src/js/listable';

describe('Component', () => {
  test('Hooks', () => {
    const localVue = createLocalVue();

    const onHook = function (ref, column, row) {
      if (column == 'price') {
        ref.classList.toggle('paid', row.paid);
      }
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
    let swrapper = mount(Listable, {
      localVue,
      propsData: {
        data: first_page_data,
        headings: headings
      },
      listeners: {
        hook: onHook
      }
    });

    const first_tr = swrapper.find('.listable-body .listable-tr:first-child');

    swrapper.vm.$nextTick(() => {
      swrapper.vm.$nextTick(() => {
        let price_td = first_tr.find('.listable-td-col-price');
        swrapper.vm.$nextTick(() => {
          expect(swrapper.emitted('hook')).toBeTruthy();
          expect(price_td.classes()).toContain('paid')
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
          swrapper.setProps({ data: second_page_data })
          swrapper.vm.$nextTick(() => {
            swrapper.vm.$nextTick(() => {
              // first td should not contain class paid
              expect(price_td.classes()).not.toContain('paid')
              swrapper.setProps({ data: first_page_data })
              swrapper.vm.$nextTick(() => {
                swrapper.vm.$nextTick(() => {
                  expect(price_td.classes()).toContain('paid')
                })
              })
            })
          })
        })
      })
    })
  })
})
