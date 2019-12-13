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

    const data = [
      {
        id: 1,
        name: "Test"
      }
    ];

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
        data: data,
        checked: onCheck
      }
    })

    wrapper.setProps({ checkbox: true })
    wrapper.vm.$nextTick(() => {
      expect(wrapper.find('.listable-checkbox').exists()).toBe(true)
      wrapper.find('.listable-th .listable-checkbox').trigger('click')
      expect(wrapper.emitted('checked')).toBeTruthy();
      // checked all means all data must be in checked array
      expect(wrapper.vm.$data.checked.length).toBe(data.length);
      // uncheck all
      wrapper.find('.listable-th .listable-checkbox').trigger('click')
      expect(wrapper.emitted('checked')).toBeTruthy();
      expect(wrapper.vm.$data.checked.length).toBe(0);
      // check single
      const tr = wrapper.find('.listable-body .listable-tr:first-child')
      const checkbox = tr.find('.listable-td .listable-checkbox')
      checkbox.trigger('click')
      expect(wrapper.vm.$data.checked.length).toBe(1);
      wrapper.vm.$nextTick(() => {
        expect(tr.classes()).toContain('listable-tr-checked')
        // uncheck single
        wrapper.find('.listable-td .listable-checkbox:first-child').trigger('click')
        expect(wrapper.vm.$data.checked.length).toBe(0);
      })
    });
  })

  test('Scoped slots', () => {
    const headings = [
      {
        display: "ID",
        column: "id"
      },
      {
        display: "Name",
        column: "name"
      }
    ];
    const data = [
      {
        id: 1,
        name: "test"
      }
    ];
    let wrapper = shallowMount(Listable, {
      propsData: {
        headings: headings,
        data: data
      },
      scopedSlots: {
        name: '<div class="name">Name: {{ props.name }}</div>'
      },
    });

    wrapper.setProps({ responsive: true })

    wrapper.vm.$nextTick(() => {
      expect(wrapper.find('.listable-td-col-name').html()).toContain('<div class="name">Name: test</div>')
    })
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

  test('paginator', () => {
    const wrapper = shallowMount(Listable, {
      slots: {
        paginator: '<div class="paginator"></div>'
      },
    });
    expect(wrapper.find('.paginator').exists()).toBe(true)
  })
  
  test('destroy', () => {
    const wrapper = shallowMount(Listable);
    wrapper.destroy();
  })
})
