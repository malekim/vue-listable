import { VueConstructor } from 'vue'
import Listable from './components/Listable'

const VueListable = {
  install(Vue: VueConstructor): void {
    Vue.component('Listable', Listable)
  },
}
export default VueListable
