import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App/App.vue'
import './assets/styles/main.scss'
import ToastPlugin from './plugins/toast'

const app = createApp(App)
app.use(createPinia())
app.use(ToastPlugin, {
  position: 'top-right',
  maxToasts: 5
})
app.mount('#app')
