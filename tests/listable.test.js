import { mount } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import Listable from '../src/js/listable';

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
        ],
        data: [
          {
            id: 1,
            name: "Test"
          }
        ]
      }
    })

    expect(wrapper.find('.listable-checkbox').exists()).toBe(true)
  })

  test('Expected error', () => {
    const consoleSpy = jest.spyOn(global.console, 'error');
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

    expect(consoleSpy).toHaveBeenCalledWith(
      'Data does not contain column name'
    );
    
    consoleSpy.mockReset();
  })
})
