import listable from './components/listable';

const VueListable = {
  install(Vue, options) {
    Vue.component("listable", listable);
  }
};
export default VueListable;
