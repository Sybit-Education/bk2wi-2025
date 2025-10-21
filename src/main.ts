import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as FlowbiteVue from 'flowbite-vue'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Registriere alle Flowbite-vue Komponenten global
Object.entries(FlowbiteVue).forEach(([name, component]) => {
  if (name !== 'default' && typeof component === 'object') {
    app.component(name, component)
  }
})

app.mount('#app')
