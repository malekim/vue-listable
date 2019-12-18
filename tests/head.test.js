
import { mount } from '@vue/test-utils'
import ListableHead from '../src/js/components/ListableHead';

describe('Head component', () => {
  test('Is a Vue instance', () => {
    const wrapper = mount(ListableHead)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
