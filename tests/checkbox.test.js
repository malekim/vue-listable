import { shallowMount } from '@vue/test-utils'
import Listable from '../src/js/components/listable';

const headings = [
  {
    display: "ID",
    column: "id",
  },
  {
    display: "Price",
    column: "price"
  },
  {
    display: "Name",
    column: "name",
    search: true
  }
];

const first_page_data = [
  {
    id: 1,
    price: 500,
    paid: true,
    name: "Apple"
  },
  {
    id: 2,
    price: 1000,
    paid: false,
    name: "Banana"
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

test('Checkbox', async () => {
  const onCheck = jest.fn()

  const wrapper = shallowMount(Listable, {
    propsData: {
      headings: headings,
      data: first_page_data,
      checked: onCheck
    }
  })

  wrapper.setProps({ checkbox: true })
  await wrapper.vm.$nextTick();
  expect(wrapper.element).toMatchSnapshot()
  expect(wrapper.find('.listable-checkbox').exists()).toBe(true);

  wrapper.find('.listable-th .listable-checkbox').trigger('click');
  expect(wrapper.emitted('checked')).toBeTruthy();
  // checked all means all data must be in checked array
  expect(wrapper.vm.$data.checked.length).toBe(first_page_data.length);
  // uncheck all
  wrapper.find('.listable-th .listable-checkbox').trigger('click')
  expect(wrapper.emitted('checked')).toBeTruthy();
  expect(wrapper.vm.$data.checked.length).toBe(0);
  // check single
  const tr = wrapper.find('.listable-body .listable-tr:first-child')
  const checkbox = tr.find('.listable-td .listable-checkbox')
  checkbox.trigger('click')
  expect(wrapper.vm.$data.checked.length).toBe(1);
  await wrapper.vm.$nextTick();
  expect(tr.classes()).toContain('listable-tr-checked')
  // uncheck single
  wrapper.find('.listable-td .listable-checkbox:first-child').trigger('click')
  expect(wrapper.vm.$data.checked.length).toBe(0);
})

test('Checkbox with empty data', () => {
  const wrapper = shallowMount(Listable, {
    propsData: { 
      checkbox: true,
      headings: [
        {
          display: "ID",
          column: "id",
        },
        {
          display: "Name",
          column: "name",
        }
      ]
    }
  })

  expect(wrapper.find('.listable-checkbox').exists()).toBe(false)
})

test('Data change', async () => {
  const onHook = function (calculated, props, column) {
    if (column == 'price') {
      calculated.class['paid'] = props.paid;
    }
  }

  const onRowHook = function (calculated, props) {
    calculated.class['finished'] = props.paid;
  }

  let wrapper = shallowMount(Listable, {
    propsData: {
      checkbox: true,
      headings: headings,
      hook: onHook,
      rowHook: onRowHook
    }
  });

  wrapper.setProps({ data: first_page_data })
  await wrapper.vm.$nextTick();
  wrapper.find('.listable-th .listable-checkbox').trigger('click');
  await wrapper.vm.$nextTick();
  expect(wrapper.emitted('checked')).toBeTruthy();
  expect(wrapper.vm.$data.checked.length).toBe(first_page_data.length);
  wrapper.setProps({ data: second_page_data });
  await wrapper.vm.$nextTick();
  expect(wrapper.vm.$data.checked.length).toBe(0);
})

