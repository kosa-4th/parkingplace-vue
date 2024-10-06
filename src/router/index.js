/*
 담당자: 양건모
 시작 일자: 2024.09.02
 설명 : 라우터
 ---------------------
 2024.09.02 양건모 | 기능 구현
 2024.09.11 양건모 | navigation-guard 추가
 */
import { createRouter, createWebHistory } from 'vue-router'
import mainRoute from './main-route'
import { AuthStore } from '@/stores/store'
import { ref } from 'vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...mainRoute],
  scrollBehavior() {
    return {top : 0}
  }
})

const previousRoute = ref(null);

router.beforeEach((to, from, next) => {
  const authStore = AuthStore()
  const userRequires = ['/reservation', '/my']
  const ownerRequires = ['/owner']
  const managerRequires = ['/manager']
  const loginRequires = [...userRequires, ...ownerRequires, ...managerRequires]
  let redirectPath = null;

  previousRoute.value = from.fullPath;

  if (to.path === '/') {
    if (authStore.isLoggedIn) {
      if (authStore.getAuth === 'ROLE_PARKING_MANAGER') {
        redirectPath = '/owner'
      } else if (authStore.getAuth === 'ROLE_SYSTEM_MANAGER') {
        redirectPath = '/manager'
      }
    }
  } else if (loginRequires.some((path) => to.path.startsWith(path)) && !authStore.isLoggedIn) {
    redirectPath = '/login'
  } else if (
    userRequires.some((path) => to.path.startsWith(path)) &&
    authStore.getAuth !== 'ROLE_USER'
  ) {
    redirectPath = authStore.getAuth === 'ROLE_PARKING_MANAGER' ? '/owner' : '/manager'
  } else if (
    ownerRequires.some((path) => to.path.startsWith(path)) &&
    authStore.getAuth !== 'ROLE_PARKING_MANAGER'
  ) {
    redirectPath = authStore.getAuth === 'ROLE_USER' ? '/' : '/manager'
  } else if (
    managerRequires.some((path) => to.path.startsWith(path)) &&
    authStore.getAuth !== 'ROLE_SYSTEM_MANAGER'
  ) {
    redirectPath = authStore.getAuth === 'ROLE_USER' ? '/' : '/owner'
  } else if ((to.path === '/login' || to.path === '/register') && authStore.isLoggedIn) {
    redirectPath = '/'
  }

  if (redirectPath) {
    next(redirectPath)
  } else {
    next()
  }
})

export { router, previousRoute };