import { createApp } from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
// 使用繁體中文語言包
import locale from 'element-plus/lib/locale/lang/zh-tw'

import router from './router'
import store from './store'

import '@css/style.sass'

const app = createApp(App)

app.use(router).use(store).use(ElementPlus, { locale }).mount('#app')
