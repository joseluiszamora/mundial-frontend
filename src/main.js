// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import Vuetify from 'vuetify'
import Snotify, { SnotifyPosition } from 'vue-snotify'
import App from './App'
import router from './router'
import store from './store'
import 'vue-snotify/styles/simple.css'
import * as VueGoogleMaps from 'vue2-google-maps'
import VueImg from 'v-img'
import VAnimateCss from 'v-animate-css'
import ECharts from 'vue-echarts/components/ECharts'

const options = {
  toast: {
    position: SnotifyPosition.rightTop,
    timeout: 2000,
    showProgressBar: false
  }
  /* timeout: 2000,
  showProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true */
}

Vue.use(Vuetify)
Vue.use(VAnimateCss)
Vue.use(Snotify, options)
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyAUqdO6ZMuxr4iDGaSVXMOhGlODPXlZ_Ac'
    // libraries: 'places' // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)
  }
})
Vue.component('chart', ECharts)
Vue.use(VueImg)

import '@/stylus/main.styl'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
