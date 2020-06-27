import { createLocalVue } from 'vue-test-utils'
import VueListable from '../src/js/index'

test('Usage', () => {
  const localVue: any = createLocalVue()
  expect(localVue.options.components['Listable']).toBeUndefined()
  localVue.use(VueListable)
  expect(typeof localVue.options.components['Listable']).toBe('function')
})
