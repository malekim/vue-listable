import Listable from './components/Listable';

const VueListable = {
  install(Vue, options) {
    Vue.component("Listable", Listable);
  }
};
export default VueListable;
