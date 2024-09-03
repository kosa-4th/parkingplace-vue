import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { AuthStore } from './stores/store'

const app = createApp(App)

app.use(createPinia());
app.use(router);

const authStore = AuthStore();
authStore.loadAuthData();

app.mount('#app')
