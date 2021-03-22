import Vue from 'vue'
import Vuex from 'vuex'

import utils from './modules/utils'
import cesium from './modules/cesium'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    utils,
    cesium
  }
})
