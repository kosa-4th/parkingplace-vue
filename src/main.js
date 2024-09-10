import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useKakao } from 'vue3-kakao-maps'
import { AuthStore } from './stores/store'
import DatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import TimePicker from 'vue3-timepicker';
import 'vue3-timepicker/dist/VueTimepicker.css';

useKakao('518babc0abbb1482c00d27da382d813c')

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.component('DatePicker', DatePicker);
app.component('TimePicker', TimePicker);

app.mount('#app')

const authStore = AuthStore()
authStore.loadAuthData()


