import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// import App from '../App.vue'

import UI from './components/index'


const app = createApp(App)

UI(app)

app.use(ElementPlus)

app.use(store).use(router).mount('#app')
