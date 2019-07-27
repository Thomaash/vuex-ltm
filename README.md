# Vuex - Long Term Memory

[![Greenkeeper badge](https://badges.greenkeeper.io/Thomaash/vuex-ltm.svg)](https://greenkeeper.io/)

Async modular persistence for Vuex store.

Documentation: https://thomaash.github.io/vuex-ltm/

## Simple example

```javascript
import Vue from "vue"
import Vuex from "vuex"
import {
  LTM,
  dummyFilter,
  localStorageWrapper,
  replace,
  saveAll,
  simplyExecute
} from "vuex-ltm"

const ltm = new LTM({
  // Persist immediatelly (even multiple times per second).
  execute: simplyExecute,
  // Persist all mutations.
  filter: dummyFilter,
  // Replace the state in Vuex when loading.
  merge: replace,
  // Persist the whole state.
  reduce: saveAll,
  // Persist into the localStorage as the 'app-state' item.
  storage: localStorageWrapper("app-state", localStorage)
})

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {},
  plugins: [ltm.plugin]
})
```

## Better example

```javascript
import Vue from 'vue'
import Vuex from 'vuex'
import {
  LTM,
  chromeSyncStorage,
  deepMerge,
  executeWithDelay,
  localStorage,
  mutationFilter,
  pickModules
} from 'vuex-ltm'

const ltm = new LTM({
  // Persist 2 seconds after the last change (prevents bursts).
  execute: executeWithDelay(2000),
  // Persist only after select mutations.
  filter: mutationFilter(['mutation-type-1', 'mutation-type-2']),
  // Merge the persisted state with the defaults in Vuex.
  merge: deepMerge,
  // Persist only some modules.
  reduce: pickModules(['sync']),
  // Persist into the chrome.storage.sync if in extension or into localStorage otherwise (dev/demo).
  storage: chrome && chrome.storage && chrome.storage.sync
    ? chromeSyncStorage('app-state')
    : localStorage('app-state'),
})

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {},
  modules: {
    local: …,
    sync: …
  },
  plugins: [ltm.plugin]
})

// You can also wait for the persisted state to be loaded (preferably with some nice spinner or something).
// Otherwise you'll have the defaults in Vuex before the persisted state is loaded.
;(async () => {
  await ltm.ready
  new Vue({
    store,
    render: h => h(App)
  }).$mount('#app')
})()
```

## License

This project is dual licensed under [Apache 2.0](./LICENSE-APACHE-2.0) and [ISC](./LICENSE-ISC). Pick whichever you like more.
