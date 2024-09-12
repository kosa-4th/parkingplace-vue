<template>
  <div class="owner-menu">
    <div class="owner-side-container">
      <div class="owner-side-top">
        <!-- 사용자 이름과 아이콘을 담은 박스 -->
        <div class="owner-name-box">
          <div class="owner-name-circle">
            <p>G</p>
            <!-- 사용자 이름의 첫 글자 -->
          </div>
          <p>혜화주차장님</p>
          <!-- 사용자 전체 이름 표시 -->
        </div>
        <!-- 메뉴 항목 리스트 -->
        <ul>
          <!-- v-for을 사용하여 menuItems 배열을 반복 렌더링 -->
          <li
            v-for="(menuItem, index) in menuItems"
            :key="index"
            :class="{ active: isActive(menuItem.link) }"
          >
            <!-- 각 메뉴 항목의 링크 -->
            <router-link :to="menuItem.link">{{ menuItem.text }}</router-link>
          </li>
        </ul>
      </div>

      <!-- 메뉴로 돌아가기 위한 링크 -->
      <span style="margin-bottom: 20px"><router-link to="/owner">MENU</router-link></span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 메뉴 항목을 배열로 정의. 각 항목은 텍스트와 링크를 포함함
      menuItems: [
        { text: '수익 통계', link: '/owner/incomes' },
        { text: '주차자 관리', link: '/owner/lots' },
        { text: '예약 관리', link: '/owner/reservations' },
        { text: '문의 관리', link: '/owner/qna' }
      ]
    }
  },
  methods: {
    // 현재 경로가 menuItem의 링크와 일치하는지 확인하여 true/false 반환
    isActive(route) {
      return this.$route.path === route
    }
  }
}
</script>

<style scoped>
p {
  margin-bottom: 10px;
}
/* 사용자 이름이 들어가는 원형 아이콘 */
.owner-name-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 100%; /* 원형으로 만들기 */
  background-color: #9a64e8; /* 아이콘 배경색 */
  margin-bottom: 10px;
  margin-right: 10px;
}

/* 원형 아이콘 내부 텍스트 */
.owner-name-circle p {
  color: #fff; /* 텍스트 색상 흰색 */
  margin: auto;
  font-weight: bold; /* 굵은 텍스트 */
  font-size: 18px; /* 텍스트 크기 */
}

/* 메뉴 전체 박스 스타일 */
.owner-menu {
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
  z-index: 2000; /* 다른 요소 위에 표시될 수 있도록 z-index 설정 */
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
  height: 100px;
  justify-content: center; /* 가운데 정렬 */
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
  margin-top: 20px; /* 위쪽 마진 */
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
}

/* 활성화된 메뉴 항목은 hover 시 크기 변화 없음 */
.owner-side-top ul li.active:hover {
  transform: none;
}
</style>
