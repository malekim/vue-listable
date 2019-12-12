import Vue from 'vue'
import { createLocalVue } from 'vue-test-utils'
import VueListable from '../src/index'

it('Usage', () => {
  const localVue = createLocalVue();
  expect(localVue.options.components['listable']).toBeUndefined();
  localVue.use(VueListable);
  expect(typeof localVue.options.components['listable']).toBe('function');
})