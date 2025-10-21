import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import FlowbitePlugin from 'flowbite-vue'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(FlowbitePlugin)

app.mount('#app')
