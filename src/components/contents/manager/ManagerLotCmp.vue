<!--
@Author김경민
@Date 2024.09.23-24
23일 주차장 데이터 가져오기
24일 모달 및 수정하기
-->
<template>
  <div>
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <h3 style="margin: 0;">주차장 관리</h3>
        <button class="btn bg-purple btn-sm" @click="openCreateModal">신규 주차장 등록</button>
      </div>
      <div class="search-container">
        <select v-model="searchOption" class="form-control search-select">
          <option value="name">주차장 이름</option>
          <option value="address">주소</option>
        </select>
        <input
          type="text"
          v-model="searchKeyword"
          placeholder="검색어 입력"
          class="form-control search-input"
        />
        <button class="btn bg-purple btn-sm" @click="getParkingLotData(1)">검색</button>
      </div>
    </div>
    <table class="table table-bordered table-hover text-center">
      <thead class="thead-dark">
      <tr>
        <th scope="col">NO</th>
        <th scope="col">주차장명</th>
        <th scope="col">주소</th>
        <th scope="col">전화번호</th>
        <th scope="col">관리자명</th>
        <th scope="col">상세보기</th>
      </tr>
      </thead>
      <tbody v-if="lotData.length > 0">
      <tr v-for="(parkingLot, index) in lotData" :key="parkingLot.id">
        <td>{{ (index + 1) + ((currentPage - 1) * pageSize) }}</td>
        <td>{{ parkingLot.name }}</td>
        <td>{{ parkingLot.address }}</td>
        <td>{{ parkingLot.tel }}</td>
        <td>{{ parkingLot.user ? parkingLot.user.userName : 'N/A' }}</td>
        <td>
          <button class="btn bg-purple btn-sm" @click="viewDetails(parkingLot)">보기 및 수정</button>
        </td>
      </tr>
      </tbody>
      <tbody v-else>
      <tr>
        <td colspan="6">데이터가 존재하지 않습니다.</td>
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
          v-for="page in visiblePages"
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
    <ShowDetailLotModal
      v-if="showModifyModal"
      :lotData="selectedLotData"
      @close-modal="closeModifyModal"
      @refreshData="reloadParkingLotData"
    />
    <!-- 신규 주차장 등록 모달 -->
    <ShowCreateLotModal
      v-if="showCreateModal"
      @close-modal="closeCreateModal"
      @refreshData="reloadParkingLotData"
    />
  </div>
</template>

<script>
import axios from 'axios'
import ShowDetailLotModal from '@/components/contents/manager/ShowDetailLotModal.vue'
import ShowCreateLotModal from '@/components/contents/manager/ShowCreateLotModal.vue'

export default {
  components: { ShowCreateLotModal, ShowDetailLotModal },
  data() {
    return {
      searchOption: 'name', // 기본 검색 옵션 (주차장 이름)
      searchKeyword: '',    // 검색 키워드
      lotData: [],           // 주차장 데이터 리스트
      currentPage: 1,         // 현재 페이지 번호
      totalPages: 0,          // 총 페이지 수
      pageSize: 10,           // 한 페이지에 보여줄 데이터 수
      searchName: '',         // 검색할 주차장 이름
      searchAddress: '',       // 검색할 주소
      paginationSize: 10,  // 한번에 표시할 페이지 버튼 수
      showModifyModal: false, //상세보기 모달
      showCreateModal: false, //주자장 만들기 모달
      selectedLotData: this.lotData // 선택된 주차장 데이터
    }
  },
  methods: {
    openCreateModal() {
      this.showCreateModal = true
    },
    closeCreateModal() {
      this.showCreateModal = false
    },
    viewDetails(parkingLot) {
      console.log('Opening Modal for userId : ', parkingLot)
      this.selectedLotData = parkingLot
      this.showModifyModal = true  // 모달을 열기
    },
    closeModifyModal() {
      this.showModifyModal = false
      this.selectedUserId = null
    },
    reloadParkingLotData() {
      // 상위 컴포넌트의 데이터를 다시 불러오는 로직
      this.getParkingLotData()
    },
    // 주차장 데이터를 가져오는 메서드
    async getParkingLotData(page = 1) {
      let params = {
        page: page - 1,
        size: this.pageSize
      }

      // 선택된 검색 옵션에 따라 파라미터 설정
      if (this.searchOption === 'name') {
        params.name = this.searchKeyword
      } else if (this.searchOption === 'address') {
        params.address = this.searchKeyword
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/System-Manager/parkingLotData/protected`, { params })
        this.lotData = response.data.content
        this.totalPages = response.data.totalPages
        this.currentPage = page
      } catch (error) {
        console.error('데이터를 불러오는 중 오류가 발생했습니다:', error)
      }
    },
    // 페이지 변경 메서드
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        this.getParkingLotData(page)  // 페이지 변경 시 데이터 다시 가져오기
      }
    }
  },
  computed: {
    visiblePages() {
      const start = Math.floor((this.currentPage - 1) / this.paginationSize) * this.paginationSize + 1
      const end = Math.min(start + this.paginationSize - 1, this.totalPages)
      const pages = []
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    }
  },
  mounted() {
    this.getParkingLotData(this.currentPage)  // 컴포넌트가 로드되면 주차장 데이터를 가져옴
  }
}
</script>

<style scoped>
.search-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px; /* 입력 필드와 버튼 사이의 간격 */
  margin-bottom: 20px; /* 검색 컨테이너 아래 여백 */
}

.search-select {
  flex: 1;
  max-width: 10%; /* 셀렉트 박스의 최대 너비 */
}

.search-input {
  width: 500px
}


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

.btn.btn-sm:hover{
  background-color: #9A64E8; /* 기본 보라색 */
  color: white;
}
.bg-purple {
  background-color: #9A64E8; /* 기본 보라색 */
  color: white;
}

/* 이전, 다음 버튼에 보라색 적용 */
.pagination .page-item .page-link {
  color: #9A64E8; /* 보라색 텍스트 */
}

.pagination .page-item.disabled .page-link {
  color: #6c757d; /* 비활성화된 버튼 색상 */
}


</style>
