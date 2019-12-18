import Vue from 'vue'
import { createLocalVue } from 'vue-test-utils'
import VueListable from '../src/js/index'

it('Usage', () => {
  const localVue = createLocalVue();
  expect(localVue.options.components['Listable']).toBeUndefined();
  localVue.use(VueListable);
  expect(typeof localVue.options.components['Listable']).toBe('function');
})