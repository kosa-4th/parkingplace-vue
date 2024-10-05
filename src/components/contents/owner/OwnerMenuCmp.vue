<!-- 
 담당자: 양건모
 시작 일자: 2024.09.10
 설명 : 주차장 업주 대시보드 사이드바
 ---------------------
 2024.09.11 김찬희 | 대략적 UI 구현
 2024.09.18 양건모 | 주차장 선택을 위한 드롭다운
 2024.09.26 양건모 | 수익통계 탭 삭제
 -->

<template>
  <div class="owner-menu">
    <div class="owner-side-container">
      <div class="owner-side-top">
        <div class="owner-name-box">
          <p>{{ authStore.getUsername }}님</p>
          <!-- <p @click="logout()"><small>로그아웃</small></p> -->
        </div>
        <div>
          <!-- v-model을 로컬 데이터인 localSelectedLotId로 연결 -->
          <select
            v-model="localSelectedLotId"
            @change="$emit('select-change', this.localSelectedLotId)"
          >
            <option v-for="(lot, idx) in myLots" :key="idx" :value="lot.id">
              {{ lot.name }}
            </option>
          </select>
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
import {router} from '@/router'
import { AuthStore } from '@/stores/store'

export default {
  props: ['myLots', 'selectedLotId'],
  data() {
    return {
      authStore: AuthStore(),
      localSelectedLotId: this.selectedLotId, // props로 받은 값을 로컬 데이터로 설정
      menuItems: [
        { text: '주차장 관리', link: '/owner/lots' },
        { text: '예약 관리', link: '/owner/reservations' },
        { text: '리뷰 관리', link: '/owner/reviews' },
        { text: '문의 관리', link: '/owner/qna' },
        { text: '수익 통계', link: '/owner/graph' },
      ]
    }
  },
  watch: {
    // 부모 컴포넌트로부터 selectedLotId가 변경되면 로컬 데이터도 업데이트
    selectedLotId(newVal) {
      this.localSelectedLotId = newVal
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
.owner-menu {
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
.owner-side-container {
  height: 100%; /* 컨테이너 전체 높이 */
  display: flex;
  flex-direction: column; /* 세로 방향 배치 */
  justify-content: space-between; /* 상단과 하단 사이에 여유 공간 */
  align-items: center;
}

/* 사용자 이름과 아이콘이 들어간 박스 */
.owner-name-box {
  display: flex;
  flex-direction: row;
  align-items: center; /* 중앙 정렬 */
  color: #9a64e8; /* 텍스트 색상 */
  height: 50px;
  margin-top: 50px;
  justify-content: space-around; /* 가운데 정렬 */
}

/* 상단 메뉴 섹션 */
.owner-side-top {
  margin-top: 20px; /* 상단 여백 */
}

/* 사용자 이름 텍스트 스타일 */
.owner-side-top p {
  font-size: 18px; /* 텍스트 크기 */
  font-weight: 700; /* 굵은 글씨체 */
}

/* 메뉴 리스트 스타일 */
.owner-side-top ul {
  display: flex;
  margin-top: 50px; /* 위쪽 마진 */
  flex-direction: column; /* 세로 정렬 */
  align-content: center;
  justify-content: center;
  padding: 0; /* 리스트 패딩 없음 */
}

/* 리스트 항목 스타일 */
.owner-side-top ul li {
  list-style-type: none; /* 리스트 스타일 없앰 */
  margin-bottom: 15px; /* 리스트 항목 간 간격 */
  width: 100%; /* 전체 너비 차지 */
  text-align: center; /* 텍스트 중앙 정렬 */
  padding: 10px 0; /* 상하 패딩 */
  transition: all 0.3s ease-in-out; /* 부드러운 애니메이션 효과 */
  border-radius: 8px; /* 둥근 모서리 */
}

/* li 항목 hover 시 배경색과 크기 변화 효과 */
.owner-side-top ul li:hover {
  background-color: #e8d3ff; /* hover 시 연한 보라색 배경 */
  transform: scale(1.05); /* 약간 커지게 */
}

/* li 안의 링크 스타일 */
.owner-side-top ul li a {
  text-decoration: none; /* 링크의 밑줄 제거 */
  font-size: 16px; /* 텍스트 크기 */
  font-weight: 500; /* 중간 굵기 */
  color: #9a64e8; /* 텍스트 색상 */
  transition: color 0.3s ease-in-out; /* 텍스트 색상 변화 애니메이션 */
}

/* 링크 hover 시 텍스트 강조 효과 */
.owner-side-top ul li:hover a {
  color: #4c2f91; /* hover 시 텍스트 색상 변경 */
  font-weight: bold; /* 텍스트 굵게 */
}

/* 현재 활성화된 메뉴 항목 스타일 */
.owner-side-top ul li.active {
  background-color: #9a64e8; /* 활성화된 항목의 배경색 */
}

/* 활성화된 메뉴 항목의 링크 텍스트 스타일 */
.owner-side-top ul li.active a {
  color: #fff; /* 활성화된 항목의 텍스트 색상 */
  font-weight: 700;
}

/* 활성화된 메뉴 항목은 hover 시 크기 변화 없음 */
.owner-side-top ul li.active:hover {
  transform: none;
}

select {
  display: block;
  width: 200px;
  padding: 10px;

  border: 1px solid #d3d3d3;
  border-radius: 5px;
  font-size: 15px;
  outline: none;
}

.logout {
  font-size: 13px;
  margin: auto;
  cursor: pointer;
  text-decoration: underline;
}
</style>
