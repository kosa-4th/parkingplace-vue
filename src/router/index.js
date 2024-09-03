import { createRouter, createWebHistory } from 'vue-router'
import mainRoute from './main-route'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...mainRoute]
});


export default router;
