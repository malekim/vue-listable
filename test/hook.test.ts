import { shallowMount } from '@vue/test-utils'
import Listable from '../src/js/components/Listable'
import ListableHead from '../src/js/components/ListableHead'

const first_page_data = [
  {
    id: 1,
    price: 500,
    paid: true,
  },
  {
    id: 2,
    price: 1000,
    paid: false,
  },
]

const second_page_data = [
  {
    id: 1,
    price: 3500,
    paid: false,
  },
  {
    id: 2,
    price: 4500,
    paid: true,
  },
]
test('Hooks', async () => {
  const onHook = (calculated: any, props: any, column: any) => {
    if (column == 'price') {
      calculated.class['paid'] = props.paid
    }
  }

  const onRowHook = (calculated: any, props: any) => {
    calculated.class['finished'] = props.paid
  }

  const headings = [
    {
      display: 'ID',
      column: 'id',
    },
    {
      display: 'Price',
      column: 'price',
    },
  ]

  const swrapper = shallowMount(Listable, {
    propsData: {
      headings: headings,
      data: first_page_data,
      hook: onHook,
      rowHook: onRowHook,
    },
    stubs: {
      ListableHead: ListableHead,
    },
  })

  const first_tr = swrapper.find('.listable-body .listable-tr:first-child')

  await swrapper.vm.$nextTick()
  const price_td = first_tr.find('.listable-td-col-price')
  expect(price_td.classes()).toContain('paid')
  expect(first_tr.classes()).toContain('finished')
  swrapper.setProps({ data: second_page_data })
  await swrapper.vm.$nextTick()
  expect(price_td.classes()).not.toContain('paid')
  expect(first_tr.classes()).not.toContain('finished')
  swrapper.setProps({ data: first_page_data })
  await swrapper.vm.$nextTick()
  expect(price_td.classes()).toContain('paid')
})
