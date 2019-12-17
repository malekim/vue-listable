import { mount } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import Expander from '../src/js/components/expander';
import Listable from '../src/js/components/listable';

describe('Component', () => {
  test('Is a Vue instance', () => {
    const wex = mount(Expander)
    expect(wex.isVueInstance()).toBeTruthy()
  })

  test('Expander slot', () => {
    const headings = [
      {
        display: "ID",
        column: "id",
      },
      {
        display: "Name",
        column: "name",
      }
    ];
    const data = [
      {
        id: 1,
        name: "Test2"
      },
      {
        id: 2,
        name: "Test3"
      }
    ];
    let wrapper2 = shallowMount(Listable, {
      scopedSlots: {
        expander: '<div class="expander">Expander: {{ props.name }}</div>'
      },
      propsData: {
        headings: headings,
        data: data
      },
      stubs: {
        'expander': true
      }
    });

    // should still be false becuase there is no expandable option
    expect(wrapper2.find('.listable-tr-expander').exists()).toBe(false);

    wrapper2.setProps({ expandable: true })

    wrapper2.vm.$nextTick(() => {
      const tr = wrapper2.find('.listable-body .listable-tr');
      tr.trigger('click')
      wrapper2.vm.$nextTick(() => {
        expect(wrapper2.find('.listable-tr-expander').exists()).toBe(true);
        expect(wrapper2.find('.listable-tr-expander').html()).toContain('<div class="expander">Expander: Test2</div>');
        // test expander hide
        tr.trigger('click');
        wrapper2.vm.$nextTick(() => {
          expect(wrapper2.find('.listable-tr-expander').exists()).toBe(false);
        });
      })
    })
  })
})
