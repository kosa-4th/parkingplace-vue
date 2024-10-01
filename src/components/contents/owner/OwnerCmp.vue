<!--
 담당자: 양건모
 시작 일자: 2024.09.18
 설명 : 주차장 업주 컴포넌트
 ---------------------
 2024.09.18 양건모 | 주차장 선택 관련 기능 추가
 2024.09.19 김경민 | 메뉴바 처리
 -->
<template>
  <div class="owner-container">
    <div class="sidebar" @mouseover="showMenu" @mouseleave="hideMenu">
      <owner-menu-cmp
        :myLots="myLots"
        :selectedLotId="selectedLotId"
        @select-change="
          (localSelectedLotId) => {
            this.selectedLotId = localSelectedLotId
          }
        "
      ></owner-menu-cmp>
    </div>
    <div class="main-content">
      <router-view v-if="myLots.length > 0" :selectedLotId="selectedLotId"></router-view>
      <div v-else>나의 주차장 없음</div>
    </div>
  </div>
</template>

<script>
import OwnerMenuCmp from './OwnerMenuCmp.vue'
import axios from 'axios'
import { AuthStore } from '@/stores/store'

export default {
  components: { OwnerMenuCmp },
  data() {
    return {
      authStore: AuthStore(),
      myLots: [],
      selectedLotId: null,
      menuVisible: false // 메뉴가 보이는 상태를 관리
    }
  },
  async mounted() {
    await this.getMyLots()
  },
  methods: {
    async getMyLots() {
      await axios({
        method: 'get',
        url: '/api/parkinglots/my/protected',
        headers: {
          Authorization: `Bearer ${this.authStore.token}`,
          'Content-Type': 'application/json'
        }
      })
        .then((response) => {
          this.myLots = response.data.parkingLots
          if (this.myLots.length > 0) {
            this.selectedLotId = this.myLots[0].id
          }
        })
        .catch(function (e) {
          alert(e)
        })
    },
    showMenu() {
      this.menuVisible = true
    },
    hideMenu() {
      this.menuVisible = false
    }
  },
  watch: {
    selectedLotId() {}
  }
}
</script>

<style scoped>
.owner-container {
  display: flex;
  height: 100vh; /* 화면 전체 높이 사용 */
  width: 100%; /* 화면 전체 너비 사용 */
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
