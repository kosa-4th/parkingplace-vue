<!--
 만든이 : 김경민
 시작일자 2024.09.20
 설명 : 총괄 매니저 페이지 컴포넌트
 --------------------------
 2024.09.20 : 시작
 -->
<template>
  <div class="manager-menu">
    <div class="manager-side-container">
      <div class="manager-side-top">
        <div class="manager-name-box">
          <p>{{ authStore.getUsername }}님 &nbsp;</p>
        </div>
        <div>
        </div>
        <ul>
          <li
            v-for="(menuItem, index) in menuItems"
            :key="index"
            :class="{ active: isActive(menuItem.link) }"
          >
            <router-link :to="menuItem.link">{{ menuItem.text }}</router-link>
          </li>
        </ul>
      </div>
      <div class="logout" @click="logout()">로그아웃</div>
    </div>
  </div>
</template>

<script>
import { AuthStore } from '@/stores/store.js'
import router from '@/router/index.js'

export default {
  data() {
    return {
      authStore: AuthStore(),
      localSelectedLotId: this.selectedLotId, // props로 받은 값을 로컬 데이터로 설정
      menuItems: [
        { text: '회원 관리', link: '/manager' },
        { text: '주차장 관리', link: '/lot' },
        { text: '신고 리뷰 관리', link: '/review'}
      ]
    }
  },
  methods: {
    isActive(route) {
      return this.$route.path === route
    },
    logout() {
      this.authStore.clearAuthData()
      router.push('/')
    },
    toSelectedLot() {}
  }
}
</script>

<style scoped>
p {
  margin-bottom: 10px;
}

/* 메뉴 전체 박스 스타일 */
.manager-menu {
  padding: 20px;
  background: #faf6ff; /* 연한 보라색 배경 */
  display: flex;
  flex-direction: column; /* 세로 배치 */
  justify-content: space-between;
  align-items: center;
  position: fixed; /* 고정된 위치 */
  left: 0; /* 왼쪽 고정 */
  top: 0; /* 상단 고정 */
  height: 100%; /* 화면 전체 높이 */
  width: 240px; /* 메뉴 너비 */
  z-index: 1050; /* 다른 요소 위에 표시될 수 있도록 z-index 설정 */
}

/* 메뉴 내용 컨테이너 */
.manager-side-container {
  height: 100%; /* 컨테이너 전체 높이 */
  display: flex;
  flex-direction: column; /* 세로 방향 배치 */
  justify-content: space-between; /* 상단과 하단 사이에 여유 공간 */
  align-items: center;
}

/* 사용자 이름과 아이콘이 들어간 박스 */
.manager-name-box {
  display: flex;
  flex-direction: row;
  align-items: center; /* 중앙 정렬 */
  color: #9a64e8; /* 텍스트 색상 */
  height: 50px;
  margin-top: 50px;
  justify-content: space-around; /* 가운데 정렬 */
}


/* 상단 메뉴 섹션 */
.manager-side-top {
  margin-top: 20px; /* 상단 여백 */
}

/* 사용자 이름 텍스트 스타일 */
.manager-side-top p {
  font-size: 18px; /* 텍스트 크기 */
  font-weight: 700; /* 굵은 글씨체 */
}

/* 메뉴 리스트 스타일 */
.manager-side-top ul {
  display: flex;
  margin-top: 50px; /* 위쪽 마진 */
  flex-direction: column; /* 세로 정렬 */
  align-content: center;
  justify-content: center;
  padding: 0; /* 리스트 패딩 없음 */
}

/* 리스트 항목 스타일 */
.manager-side-top ul li {
  list-style-type: none; /* 리스트 스타일 없앰 */
  margin-bottom: 15px; /* 리스트 항목 간 간격 */
  width: 100%; /* 전체 너비 차지 */
  text-align: center; /* 텍스트 중앙 정렬 */
  padding: 10px 0; /* 상하 패딩 */
  transition: all 0.3s ease-in-out; /* 부드러운 애니메이션 효과 */
  border-radius: 8px; /* 둥근 모서리 */
}

/* li 항목 hover 시 배경색과 크기 변화 효과 */
.manager-side-top ul li:hover {
  background-color: #e8d3ff; /* hover 시 연한 보라색 배경 */
  transform: scale(1.05); /* 약간 커지게 */
}

/* li 안의 링크 스타일 */
.manager-side-top ul li a {
  text-decoration: none; /* 링크의 밑줄 제거 */
  font-size: 16px; /* 텍스트 크기 */
  font-weight: 500; /* 중간 굵기 */
  color: #9a64e8; /* 텍스트 색상 */
  transition: color 0.3s ease-in-out; /* 텍스트 색상 변화 애니메이션 */
}

/* 링크 hover 시 텍스트 강조 효과 */
.manager-side-top ul li:hover a {
  color: #4c2f91; /* hover 시 텍스트 색상 변경 */
  font-weight: bold; /* 텍스트 굵게 */
}

/* 현재 활성화된 메뉴 항목 스타일 */
.manager-side-top ul li.active {
  background-color: #9a64e8; /* 활성화된 항목의 배경색 */
}

/* 활성화된 메뉴 항목의 링크 텍스트 스타일 */
.manager-side-top ul li.active a {
  color: #fff; /* 활성화된 항목의 텍스트 색상 */
  font-weight: 700;
}

/* 활성화된 메뉴 항목은 hover 시 크기 변화 없음 */
.manager-side-top ul li.active:hover {
  transform: none;
}
.logout {
  font-size: 13px;
  margin: auto;
  cursor: pointer;
  text-decoration: underline;
}
</style>
