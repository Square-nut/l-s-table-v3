import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import UI from './ui'

createApp(App).use(store).use(router).mount('#app')
