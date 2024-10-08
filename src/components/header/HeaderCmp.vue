<!--
 담당자: 김경민
 시작 일자: 2024.09.02
 설명 : 메인 헤더 작성
 ---------------------
 2024.09.02 김경민 : 메인 헤더 작성
 2024.09.11 양건모 : a 태그 router-link로 변환, 관련 메서드 수정 삭제
 2024.09.19 오지수 : header 디자인 수정, 회원 정보 라우터 추가
 2024.09.25 양건모 : 알림 컴포넌트 연결
 2024.09.26 양건모 : url 변경 감지에 대한 watch 속성을 추가해 알림 창 자동 닫기
 2024.09.26 양건모 : 로그인 여부와 권한에 따라 메뉴, 알림 버튼 비활성화
 -->
<template>
  <nav class="navbar bg-light fixed-top">
    <div class="container-fluid">
      <button
        class="navbar-toggler"
        type="button"
        @click="toggleSidebar"
        v-if="!authStore.isLoggedIn || authStore.getAuth === 'ROLE_USER'"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div v-else></div>

      <!-- 로고 클릭 시 홈으로 이동 -->
      <router-link to="/" class="navbar-brand position-absolute start-50 translate-middle-x">
        <img src="@/assets/img/logo.png" style="height: 25px" alt="Parking Place" />
      </router-link>

      <!-- 알림 버튼 -->
      <div class="d-flex" v-if="authStore.isLoggedIn && authStore.getAuth === 'ROLE_USER'">
        <button href="#" class="nav-link text-dark" @click="toggleNotificationModal">
          <img src="@/assets/img/bell.svg" style="width: 20px; height: 20px; margin-right: 15px" />
        </button>
        <div
          id="notification-count"
          v-if="uncheckedNotificationCount > 0"
          @click="toggleNotificationModal"
        >
          {{ uncheckedNotificationCount }}
        </div>
        <header-notification-cmp
          v-if="isNotificationOpen"
          @closed="closeNotificationModal"
          @notificationChanged="getUncheckedNotificationCount"
        ></header-notification-cmp>
      </div>
      <div v-else></div>

      <!-- 사이드바 메뉴 -->
      <div :class="['sidebar', { active: isSidebarOpen }]">
        <div class="sidebar-header">
          <button class="btn-close" @click="toggleSidebar"></button>
        </div>
        <div class="sidebar-content">
          <div v-if="isLoggedIn">
            <div class="menu">메뉴</div>
            <div class="user-box" @click="handleAccount">
              <div>
                <strong>{{ username }}</strong> 님 안녕하세요!
              </div>
              <svg width="15" height="30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 30">
                <g fill="none" stroke="#9a64e8" stroke-width="4" stroke-linecap="round">
                  <path d="M 2 2 L 13 15 L 2 28" />
                </g>
              </svg>
            </div>
            <hr />
            <!-- 로그인 상태일 때 -->
            <ul class="list-unstyled">
              <li v-for="(menu, index) in menus" :key="index">
                <router-link :to="menu.path" @click="closeNavigation" class="menu-name">
                  {{ menu.name }} <img src="@/assets/img/arrow-right-grey.png" alt="arrow" />
                </router-link>
              </li>
              <li>
                <span class="logout" @click="HandelLogout">로그아웃</span>
              </li>
            </ul>
          </div>

          <!-- 비로그인 상태일 때 -->
          <div v-else class="unloggedin">
            <div class="unlogggedin-info">
              더 많은 서비스 이용을 원하신다면<br />
              로그인해 주세요.
            </div>
            <button class="login-btn" @click="handleLogin">로그인하러 가기</button>
            <p class="nav">
              <span>아직 계정이 없으신가요?</span
              ><router-link class="nav-register" to="/register" @click="closeNavigation"
                >간편 가입하기</router-link
              >
            </p>
          </div>
        </div>
      </div>
      <!-- 오버레이 -->
      <div v-if="isSidebarOpen" class="overlay" @click="toggleSidebar"></div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, watchEffect, computed, watch } from 'vue'
import { AuthStore } from '@/stores/store'
import { useRouter } from 'vue-router'
import { logout } from '@/service/authService'
import HeaderNotificationCmp from './HeaderNotificationCmp.vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const isSidebarOpen = ref(false)
const isLoggedIn = ref(false)

let isNotificationOpen = ref(false)
const route = useRoute()
const currentUrl = ref(route.fullPath)
const router = useRouter()

const uncheckedNotificationCount = ref(0)

const authStore = AuthStore()

const username = computed(() => authStore.getUsername)

const menus = [
  { path: '/my/reservations', name: '내 예약 내역' },
  { path: '/my/cars', name: '내 차량 관리' },
  { path: '/my/favorites', name: '즐겨찾기한 주차장' },
  { path: '/my/reviews', name: '내 리뷰' },
  { path: '/my/inquiries', name: '내 문의' }
]

const closeNavigation = () => {
  isSidebarOpen.value = false
}

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const handleLogin = () => {
  isSidebarOpen.value = !isSidebarOpen.value
  router.push('/login')
}

const handleAccount = () => {
  isSidebarOpen.value = !isSidebarOpen.value
  router.push('/my')
}

const HandelLogout = () => {
  isSidebarOpen.value = !isSidebarOpen.value
  logout()
  router.push('/')
}

watchEffect(() => {
  isLoggedIn.value = authStore.isLoggedIn
})

onMounted(() => {
  isLoggedIn.value = authStore.isLoggedIn
})

const toggleNotificationModal = () => {
  isNotificationOpen.value = !isNotificationOpen.value
}

const closeNotificationModal = () => {
  isNotificationOpen.value = false
}

const getUncheckedNotificationCount = async () => {
  await axios({
    method: 'get',
    url: `${import.meta.env.VITE_API_URL}/api/notifications/count/protected`,
    headers: {
      Authorization: `Bearer ${authStore.token}`, // 'this' 없이 사용
      'Content-Type': 'application/json'
    }
  })
    .then((response) => {
      uncheckedNotificationCount.value = response.data.uncheckedNotificationCount
    })
    .catch(function (e) {
      console.error(e)
    })
}

onMounted(() => {
  getUncheckedNotificationCount()
})

watch(
  () => route.fullPath, // fullPath를 감시
  (newUrl, oldUrl) => {
    console.log('URL이 변경되었습니다:', oldUrl, '=>', newUrl)
    currentUrl.value = newUrl
    isNotificationOpen.value = false
    getUncheckedNotificationCount()
  }
)
</script>

<style scoped>
.menu {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 25px;
}
.user-box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: white;
  border: 1px solid #9a64e8;
  border-radius: 3px;
  margin: 10px 0;
  padding: 10px;
  align-items: center;
}
.navbar {
  height: 50px;
}
.navbar-toggler-icon {
  width: 20px;
  height: 20px;
}
.navbar-brand,
.navbar-nav .nav-link {
  line-height: 1;
}

/* 사이드바 스타일 */
.sidebar {
  position: fixed;
  top: 0;
  left: -400px;
  width: 100%;
  max-width: 400px;
  height: 100%;
  background: #f5f4f7;
  z-index: 1050;
  transition: left 0.3s ease;
}

.sidebar.active {
  left: 0;
  background-color: #f5f4f7;
}

.sidebar-header {
  padding: 15px;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.sidebar-content {
  padding: 15px;
  margin: 20px auto;
  width: 90%;
}

.sidebar-content ul {
  padding: 0;
  list-style: none;
}

.sidebar-content ul li a {
  display: block;
  padding: 10px 0;
}

.sidebar-content ul li img {
  width: 30px;
  height: 30px;
  margin-top: -5px;
}

.menu-name {
  text-decoration: none;
  color: #4a4a4a;
}

/* hover -> 선택 된 배색  */
.sidebar-content ul li a:hover {
  background-color: #ebebeb;
  color: #7b2ca6;
}

.logout {
  display: block;
  font-size: 13px;
  margin-top: 30px;
  text-decoration: underline;
  cursor: pointer;
}

/* 오버레이 스타일 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}

.unloggedin {
  display: flex;
  flex-direction: column;
}
.unlogggedin-info {
  width: 100%;
  background-color: white;
  border: 1px solid #9a64e8;
  border-radius: 3px;
  height: 150px;
  padding: auto;
  margin: 30px auto;

  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
}

.login-btn {
  width: 100%;
  margin: 0 auto 20px;
  height: 40px;
  background-color: #9a64e8;
  color: white;
  border-radius: 5px;
  border: none;
}

.nav {
  display: flex;
  flex-direction: row;
  font-size: 13px;
  gap: 10px;
  margin: auto;
}

.nav span {
  display: block;
}

.nav-register {
  color: black;
  font-weight: 600;
}

.d-flex {
  position: relative;
}

#notification-count {
  position: absolute;
  top: -5px;
  right: 10px;
  background-color: red;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  font-size: 12px;
  font-weight: bold;
}
</style>
