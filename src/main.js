import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import VMdEditor from './vmd'

createApp(App).use(router).use(store).use(Antd).use(VMdEditor).mount('#app')
