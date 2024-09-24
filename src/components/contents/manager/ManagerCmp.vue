<template>
  <div>
    <div class="manager-container">
      <div class="sidebar" @mouseover="showMenu" @mouseleave="hideMenu">
        <manager-menu-cmp></manager-menu-cmp>
      </div>
    </div>
    <div class="main-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import ManagerMenuCmp from './ManagerMenuCmp.vue'
// import axios from 'axios'
import { AuthStore } from '@/stores/store.js'

export default {
  components: { ManagerMenuCmp },
  data() {
    return {
      authStore: AuthStore(),
      menuVisible: false
    }
  },
  methods: {
    showMenu() {
      this.menuVisible = true
    },
    hideMenu() {
      this.menuVisible = false
    }
  }
}
</script>

<style scoped>
.manager-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* background-color: whitesmoke; */
  display: flex;
  flex-direction: column;
  font-size: 17px;
}

/* 메뉴바 스타일 (기본적으로 숨겨져 있음) */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 240px;
  height: 100vh;
  background-color: #faf6ff;
  transform: translateX(-220px); /* 기본적으로 메뉴를 화면 밖에 숨김 */
  transition: transform 0.3s ease-in-out;
  z-index: 1000;
  padding-top: 20px;
}

.sidebar:hover {
  transform: translateX(0); /* 마우스를 올리면 메뉴가 슬라이드로 나타남 */
}

.main-content {
  flex-grow: 1;
  margin-left: 20px;
  padding: 20px;
  min-height: 100vh;
  overflow-y: auto;
}

/* 스크롤바를 숨기는 CSS */
.main-content::-webkit-scrollbar {
  display: none; /* 크롬, 사파리, 엣지에서 스크롤 바 숨기기 */
}

.main-content {
  -ms-overflow-style: none; /* 인터넷 익스플로러와 엣지에서 스크롤 바 숨기기 */
  scrollbar-width: none; /* 파이어폭스에서 스크롤 바 숨기기 */
}

</style>
