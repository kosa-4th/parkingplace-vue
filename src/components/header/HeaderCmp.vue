<!--
 담당자: 김경민
 시작 일자: 2024.09.02
 설명 : 메인 헤더 작성
 ---------------------
 2024.09.02 김경민 : 메인 헤더 작성
 2024.09.11 양건모 : a 태그 router-link로 변환, 관련 메서드 수정 삭제
 -->
<template>
  <nav class="navbar bg-light fixed-top">
    <div class="container-fluid">
      <button class="navbar-toggler" type="button" @click="toggleSidebar">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- 로고 클릭 시 홈으로 이동 -->
      <router-link to="/" class="navbar-brand position-absolute start-50 translate-middle-x">
        <img src="@/assets/img/logo.png" style="height: 25px" alt="Parking Place" />
      </router-link>
      <!-- 알림 버튼 -->

      <div class="d-flex">
        <a href="#" class="nav-link text-dark">
          <img src="@/assets/img/bell.svg" style="width: 20px; height: 20px; margin-right: 15px" />
        </a>
      </div>

      <!-- 사이드바 메뉴 -->
      <div :class="['sidebar', { active: isSidebarOpen }]">
        <div class="sidebar-header">
          <button class="btn-close" @click="toggleSidebar"></button>
        </div>
        <div class="sidebar-content">
          <div v-if="isLoggedIn">
            <p @click="handleAccount">{{ username }} 님 안녕하세요!</p>
            <!-- 로그인 상태일 때 -->
            <ul class="list-unstyled">
              <li>
                <router-link to="/my/reservations" @click="closeNavigation"
                  >내 예약 내역</router-link
                >
              </li>
              <li>
                <router-link to="/my/cars" @click="closeNavigation">내 차량 관리</router-link>
              </li>
              <li>
                <router-link to="/my/favorites" @click="closeNavigation">
                  즐겨찾기한 주차장
                </router-link>
              </li>
              <li><router-link to="/my/reviews" @click="closeNavigation">내 리뷰</router-link></li>
              <li @click="HandelLogout">로그아웃</li>
            </ul>
          </div>
          <!-- 비로그인 상태일 때 -->
          <div v-else>
            <p>로그인이 필요합니다</p>
            <ul class="list-unstyled">
              <li><a href="#" @click="handelSignup">회원가입</a></li>
              <li><a href="#" @click="handleLogin">로그인</a></li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 오버레이 -->
      <div v-if="isSidebarOpen" class="overlay" @click="toggleSidebar"></div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue'
import { AuthStore } from '@/stores/store'
import { useRouter } from 'vue-router'
import { logout } from '@/service/authService'

const isSidebarOpen = ref(false)
const isLoggedIn = ref(false)
const username = ref('')

const router = useRouter()
const authStore = AuthStore()

const closeNavigation = () => {
  isSidebarOpen.value = false
}

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

//비활성화 -> 양건모
// const handleAccount = () => {
//   isSidebarOpen.value = !isSidebarOpen.value
//   router.push('/my')
// }

//비활성화 -> 양건모
// const handleCar = () => {
//   isSidebarOpen.value = !isSidebarOpen.value
//   router.push('/my/cars')
// }

const handleLogin = () => {
  isSidebarOpen.value = !isSidebarOpen.value
  router.push('/login')
}

const handelSignup = () => {
  isSidebarOpen.value = !isSidebarOpen.value
  router.push('/register')
}

const HandelLogout = () => {
  isSidebarOpen.value = !isSidebarOpen.value
  logout()
}

watchEffect(() => {
  isLoggedIn.value = authStore.isLoggedIn
})

onMounted(() => {
  isLoggedIn.value = authStore.isLoggedIn
})
</script>

<style scoped>
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
  background: #f8f9fa;
  z-index: 1050;
  transition: left 0.3s ease;
}

.sidebar.active {
  left: 0;
  background-color: #d8d7d7;
}

.sidebar-header {
  padding: 15px;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.sidebar-content {
  padding: 15px;
}

.sidebar-content ul {
  padding: 0;
  list-style: none;
}

.sidebar-content ul li a {
  display: block;
  padding: 10px;
  color: #212529;
  text-decoration: none;
}

/* hover -> 선택 된 배색  */
.sidebar-content ul li a:hover {
  background-color: #e9ecef;
  color: #7b2ca6;
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
</style>
