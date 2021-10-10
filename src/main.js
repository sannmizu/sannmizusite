import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import './antd'
import './vmd'
import JSON_BIG from 'json-bigint'

Vue.config.productionTip = false
Vue.config.devtools = true

axios.defaults.baseURL = process.env.VUE_APP_BASE_URL
axios.defaults.transformResponse = data => {
  try{
    return JSON_BIG.parse(data);
  }catch (err) {
    console.log(err);
    return JSON.parse(data)
  }
}
Vue.use(VueAxios, axios)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
