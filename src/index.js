import listable from './js/listable';

const VueListable = {
  install(Vue, options) {
    Vue.component("listable", listable);
  }
};
export default VueListable;
