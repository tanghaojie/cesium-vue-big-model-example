import Vue from 'vue'
import VueResize from 'vue-resize'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import store from '@/store/index'
import App from './App.vue'
import 'vue-resize/dist/vue-resize.css'
import './assets/styles/main.css'
import svgIcon from './components/icon/svg-icon'
import importAll from './utils/import-all'

Vue.use(Antd)
Vue.use(VueResize)
importAll(require.context('./components/icon/svgs', false, /\.svg$/))
Vue.component('svg-icon', svgIcon)

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
