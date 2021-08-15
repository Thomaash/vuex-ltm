import type { Store, StoreOptions } from 'vuex'

import * as vue from 'vue'
import * as vuex from 'vuex'

const { default: Vue, createApp } = vue as any
const { default: Vuex, createStore } = vuex as any

if (typeof Vue !== 'undefined' && 'use' in Vue) {
  Vue.use(Vuex)
}

function getNewVuex3<S>(options: StoreOptions<S>): Store<S> {
  return new Vuex.Store(options)
}

function getNewVuex4<S>(options: StoreOptions<S>): Store<S> {
  const store = createStore(options)
  const app = createApp({
    name: 'App',
    template: '<div>TEST</div>',
  })
  app.use(store)
  return store
}

export const getNewVuex: <S>(options: StoreOptions<S>) => Store<S> =
  typeof createApp === 'undefined' || typeof createStore === 'undefined'
    ? getNewVuex3
    : getNewVuex4
