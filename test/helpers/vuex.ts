import Vue from 'vue'
import Vuex, { Store, StoreOptions } from 'vuex'

Vue.use(Vuex)

export function getNewVuex<S> (options: StoreOptions<S>): Store<S> {
  return new Vuex.Store(options)
}
