import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useKakao } from 'vue3-kakao-maps'

useKakao('518babc0abbb1482c00d27da382d813c')

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
