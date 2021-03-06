import { mount } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import Listable from '../src/js/components/Listable';
import ListableHead from '../src/js/components/ListableHead';

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
      stubs: {
        ListableHead: ListableHead
      }
    });

    wrapper.setProps({ responsive: true })

    wrapper.vm.$nextTick(() => {
      expect(wrapper.find('.listable-td-col-name').html()).toContain('<div class="name">Name: test</div>')
    })
  })

  test('Search', async () => {
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
        headings: headings,
        data: data
      },
      listeners: {
        search: onSearch
      },
      stubs: {
        ListableHead: ListableHead
      }
    });

    await swrapper.vm.$nextTick();
    expect(swrapper.find('.listable-tr-search').exists()).toBe(true)
    swrapper.find(".listable-search").setValue("Lukas")
    swrapper.find(".listable-search").trigger("input")
    expect(setTimeout).toHaveBeenCalled();
    jest.runAllTimers()
    expect(swrapper.emitted('search')).toBeTruthy();
  })

  test('Sortable', async () => {
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
        headings: headings,
        data: data
      },
      listeners: {
        sorted: onSort
      },
      stubs: {
        ListableHead: ListableHead
      }
    });

    await swrapper.vm.$nextTick();
    expect(swrapper.find('.sortable.listable-th-col-name').exists()).toBe(true)
    swrapper.find('.sortable.listable-th-col-name').trigger('click')
    expect(swrapper.emitted('sorted')).toBeTruthy();
  })


  test('Expected bad data', () => {
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
        id: [1],
        name: {test: "test"}
      },
      {
        id: 2,
        name: "test2"
      },
      {
        id: 3,
        name: () => ["test"]
      }
    ];
    let wrapper = shallowMount(Listable, {
      propsData: {
        headings: headings,
        data: data
      },
      stubs: {
        ListableHead: ListableHead
      }
    });

    wrapper.setProps({ responsive: true })

    wrapper.vm.$nextTick(() => {
      expect(wrapper.html()).toContain('<td class="listable-td listable-td-col-id"></td>');
      expect(wrapper.html()).toContain('<td class="listable-td listable-td-col-name"></td>');
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
