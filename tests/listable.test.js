import { mount } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import Listable from '../src/js/listable';

jest.useFakeTimers();

describe('Component', () => {
  test('Is a Vue instance', () => {
    const wrapper = mount(Listable)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  test('Component render', () => {
    const wrapper = shallowMount(Listable)

    expect(wrapper.find('.listable').exists()).toBe(true)
  })

  test('Checkbox with empty data', () => {
    const wrapper = shallowMount(Listable)

    expect(wrapper.find('.listable-checkbox').exists()).toBe(false)
  })

  test('Checkbox', () => {
    const onCheck = jest.fn()

    const wrapper = shallowMount(Listable, {
      propsData: {
        headings: [
          {
            display: "ID",
            column: "id",
          },
          {
            display: "Name",
            column: "name",
          }
        ],
        data: [
          {
            id: 1,
            name: "Test"
          }
        ],
        checked: onCheck
      }
    })

    wrapper.setProps({ checkbox: true })
    wrapper.vm.$nextTick(() => {
      expect(wrapper.find('.listable-checkbox').exists()).toBe(true)
      wrapper.find('.listable-checkbox').trigger('click')
      //console.log(wrapper.html())
      expect(wrapper.emitted('checked')).toBeTruthy();
    });
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

  test('Search', () => {
    const onSearch = jest.fn()
    const headings = [
      {
        display: "ID",
        column: "id",
      },
      {
        display: "Name",
        column: "name",
        search: true
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
    let swrapper = shallowMount(Listable, {
      propsData: {
        search: onSearch
      }
    });

    swrapper.setProps({ headings: headings, data: data })

    swrapper.vm.$nextTick(() => {
      expect(swrapper.find('.listable-tr-search').exists()).toBe(true)
      swrapper.find(".listable-search").setValue("Lukas")
      swrapper.find(".listable-search").trigger("input")
      expect(setTimeout).toHaveBeenCalled();
      jest.runAllTimers()
      expect(swrapper.emitted('search')).toBeTruthy();
    })
  })

  test('Sortable', () => {
    const onSort = jest.fn()
    const headings = [
      {
        display: "ID",
        column: "id",
      },
      {
        display: "Name",
        column: "name",
        sortable: true
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
    let swrapper = shallowMount(Listable, {
      propsData: {
        sorted: onSort
      }
    });

    swrapper.setProps({ headings: headings, data: data })

    swrapper.vm.$nextTick(() => {
      expect(swrapper.find('.sortable.listable-th-col-name').exists()).toBe(true)
      swrapper.find('.sortable.listable-th-col-name').trigger('click')
      expect(swrapper.emitted('sorted')).toBeTruthy();
    })
  })

  test('Expected error', () => {
    const consoleSpy = jest.spyOn(console, 'error');
    
    const wrapper = shallowMount(Listable, {
      propsData: { 
        headings: [
          {
            display: "ID",
            column: "id",
          },
          {
            display: "Name",
            column: "name",
          }
        ],
        data: [
          {
            id: 1
          }
        ]
      }
    })

    console.error = (...args) => {
      expect(args.includes('Data does not contain column name')).toBe(true);
    };
    
    consoleSpy.mockReset();
  })
})
