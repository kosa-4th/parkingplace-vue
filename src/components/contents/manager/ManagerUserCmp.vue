<!--
@Author김경민
@Date 2024.09.19-2023.09.20
디자인 및 데이터 가져오기 및 승인 및 취소
-->

<template>

    <div class="tabs-container">
      <!-- 부트스트랩 네비게이션 탭 -->
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <a
            class="nav-link subtitle"
            :class="{ active: activeTab === 'parkingManager' }"
            @click="switchTab('parkingManager')"
          >
            주차장 회원 정보
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link subtitle"
            :class="{ active: activeTab === 'user' }"
            @click="switchTab('user')"
          >
            일반 회원 정보
          </a>
        </li>
      </ul>
    </div>

    <div class="tab-content">
      <div v-if="activeTab === 'parkingManager'">
        <table class="table table-bordered table-hover text-center">
          <thead class="thead-dark">
          <tr>
            <th scope="col">NO</th>
            <th scope="col">E-mail</th>
            <th scope="col">주차장 업주명</th>
            <th scope="col">자세히 보기</th>
          </tr>
          </thead>
          <tbody v-if="userData.length > 0">
          <tr v-for="(user, index) in userData" :key="user.id">
            <td>{{ index + 1 }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.userName }}</td>
            <td>
              <button class="btn btn-info" @click="viewDetails(user.userId)">자세히 보기</button>
            </td>
          </tr>
          </tbody>
          <tbody v-else>
          <tr>
            <td colspan="4">데이터가 존재하지 않습니다.</td>
          </tr>
          </tbody>
        </table>

        <!-- 페이지네이션 -->
        <nav>
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Previous</a>
            </li>
            <li
              class="page-item"
              v-for="page in totalPages"
              :key="page"
              :class="{ active: currentPage === page }"
            >
              <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Next</a>
            </li>
          </ul>
        </nav>
      </div>

      <!-- 승인된 예약 탭 -->
      <div v-if="activeTab === 'user'">
        <table class="table table-bordered table-hover text-center">
          <thead class="thead-dark">
          <tr>
            <th scope="col">NO</th>
            <th scope="col">E-mail</th>
            <th scope="col">주차장 업주명</th>
            <th scope="col">자세히 보기</th>
          </tr>
          </thead>
          <tbody v-if="userData.length > 0">
          <tr v-for="(user, index) in userData" :key="user.id">
            <td>{{ index + 1 }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.userName }}</td>
            <td>
              <button class="btn btn-info" @click="viewDetails(user.userId)">자세히 보기</button>
            </td>
          </tr>
          </tbody>
          <tbody v-else>
          <tr>
            <td colspan="4">데이터가 존재하지 않습니다.</td>
          </tr>
          </tbody>
        </table>

        <!-- 페이지네이션 -->
        <nav>
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Previous</a>
            </li>
            <li
              class="page-item"
              v-for="page in totalPages"
              :key="page"
              :class="{ active: currentPage === page }"
            >
              <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Next</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  <!-- 외부 모달 창 -->
  <ShowDetailModal
    v-if="showModal"
    :userId="selectedUserId"
    @close-modal="closeModal" />
</template>

<script>

import axios from 'axios'
import ShowDetailModal from '@/components/contents/manager/ShowDetailModal.vue'
export default {
  components: { ShowDetailModal },

  data() {

    return {
      activeTab: 'parkingManager', // 기본으로 첫 번째 탭이 활성화됨
      userData: [],
      showModal: false, // 모달 표시 여부
      selectedUserId: null, // 선택된 사용자 ID
      currentPage: 1,
      totalPages: 0,
      pageSize: 5
    }
  },
  methods: {
    viewDetails(userId) {
      console.log('Opening Modal for userId : ', userId)
      this.selectedUserId = userId;  // 선택된 사용자 ID를 설정
      this.showModal = true;  // 모달을 열기
    },
    closeModal() {
      this.showModal = false;
      this.selectedUserId = null;
    },
    async getAllUserData() {
      try {
        const response = await axios.get('/api/System-Manager/userData/protected', {
          params: {
            requestAuth: this.getUserRole(),  // 상태에 맞는 데이터를 요청
            page: this.currentPage - 1,
            size: this.pageSize
          }
        })
        this.userData = response.data.content
        this.totalPages = response.data.totalPages
      } catch (error) {
        console.error('데이터를 불러오는 중 오류가 발생했습니다:', error)
      }
    },

    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        this.getAllUserData(this.getUserRole(), this.currentPage, this.pageSize)
      }
    },

    switchTab(tabName) {
      this.activeTab = tabName
      this.currentPage = 1 // 탭을 변경할 때 페이지를 1로 초기화
      this.getAllUserData(this.getUserRole(), this.currentPage, this.pageSize)
    },

    getUserRole() {
      if (this.activeTab === 'parkingManager') return 'ROLE_PARKING_MANAGER'
      if (this.activeTab === 'user') return 'ROLE_USER'
      return ''
    }


  },
  mounted() {
    this.getAllUserData()
  }
}
</script>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 80vw;
}

.table {
  border-color: #dddddd;
}

.table th,
.table td {
  border-color: #dddddd; /* 테이블 셀의 선 색상 */
}

.tabs-container {
  width: 100%;
}

.nav-tabs {
  justify-content: flex-start;
}

.tab-content {
  width: 100%;
  margin-left: 5px;
}

.nav-item {
}

.subtitle {
  color: #6c757d;
}

.subtitle:hover {
  color: #6c757d;
}

.subtitle.active {
  font-weight: bold; /* 활성화된 탭 굵기 */
}


.table {
  margin-bottom: 30px;
}

.pagination {
  margin-top: 20px;
}
/* active 페이지에 보라색 배경 적용 */
.pagination .page-item.active .page-link {
  background-color: #9A64E8; /* 보라색 */
  color: white; /* 흰색 텍스트 */
  border-color: #9A64E8; /* 보라색 테두리 */
}

/* hover 시에도 동일한 스타일 유지 */
.pagination .page-item .page-link:hover {
  background-color: #9A64E8;
  color: white;
  border-color: #9A64E8;
}

/* 이전, 다음 버튼에 보라색 적용 */
.pagination .page-item .page-link {
  color: #9A64E8; /* 보라색 텍스트 */
}

.pagination .page-item.disabled .page-link {
  color: #6c757d; /* 비활성화된 버튼 색상 */
}
</style>