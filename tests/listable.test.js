import { mount } from '@vue/test-utils'
import Listable from '../src/js/listable';

describe('Component', () => {
  test('Is a Vue instance', () => {
    const wrapper = mount(Listable)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
