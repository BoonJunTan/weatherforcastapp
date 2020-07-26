import Vue from 'vue'
import App from './App.vue'
import store from './store'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

Vue.config.productionTip = false

new Vue({
	store,
	render: h => h(App),
	created() {
		window.addEventListener('offline', () => {
      store.dispatch('setConnected', false)
    })
    window.addEventListener('online', () => {
      store.dispatch('setConnected', true)
    })
  }
}).$mount('#app')