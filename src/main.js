import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'

Vue.use(VueRouter)
Vue.use(VueAxios,axios)
Vue.use(ElementUI)

Vue.config.productionTip = true

new Vue({
  render: h => h(App),
}).$mount('#app')