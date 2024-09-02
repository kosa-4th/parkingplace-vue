<template>
  <nav class="navbar bg-light fixed-top" >
    <div class="container-fluid">
      <button class="navbar-toggler" type="button" @click="toggleSidebar">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- 로고 클릭 시 홈으로 이동 -->
      <router-link to="/" class="navbar-brand position-absolute start-50 translate-middle-x">
        <img src="@/assets/img/logo.png" style="height: 30px;" alt="Parking Place">
      </router-link>
      <!-- 알림 버튼 -->
      
      <div class="d-flex">
        <a href="#" class="nav-link text-dark">
          <img src="@/assets/img/bell.svg" style="width: 30px; height: 30px; margin-right: 15px">
        </a>
      </div>


      <!-- 사이드바 메뉴 -->
      <div :class="['sidebar', { 'active': isSidebarOpen }]">
        <div class="sidebar-header">
          <button class="btn-close" @click="toggleSidebar"></button>
        </div>
        <div class="sidebar-content">
          <div v-if="isLoggedIn">
            <p>{{ username }} 님 안녕하세요!</p>
            <!-- 로그인 상태일 때 -->
            <ul class="list-unstyled">
              <li><a href="#">내 예약 내역</a></li>
              <li><a href="#">내 차량 관리</a></li>
              <li><a href="#">즐겨찾기한 주차장</a></li>
              <li><a href="#">내 리뷰</a></li>
              <li><a href="#" @click="logout">로그아웃</a></li>
            </ul>
          </div>
          <!-- 비로그인 상태일 때 -->
          <div v-else>
            <p>로그인이 필요합니다</p>
            <ul class="list-unstyled">
              <li><a href="#">회원가입</a></li>
              <li><a href="#" @click="login">로그인</a></li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 오버레이 -->
      <div v-if="isSidebarOpen" class="overlay" @click="toggleSidebar"></div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      isSidebarOpen: false,
      isLoggedIn: true,
      username: '테스트',
    };
  },
  mounted() {
    console.log("mounted: isLoggedIn =", this.isLoggedIn);
    console.log("mounted: userName =", this.username);
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    login() {
      this.isLoggedIn = true;
      this.username = '테스트'; // 실제 앱에서는 로그인 API로부터 사용자 이름을 받아오겠죠.
      console.log("Login: isLoggedIn =", this.isLoggedIn);
      console.log("Login: username =", this.username);
    },
    logout() {
      this.isLoggedIn = false;
      this.username = '';
      console.log("Logout: isLoggedIn =", this.isLoggedIn);
      console.log("Logout: username =", this.username);
    },
  },
};
</script>
<style scoped>

/* 사이드바 스타일 */
.sidebar {
  position: fixed;
  top: 0;
  left: -250px;
  width: 250px;
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
