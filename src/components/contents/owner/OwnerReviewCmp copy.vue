<template>
  <!-- 화면 디자인: 김경민
  작성자: 오지수
  2024-09-26 -->
  <div class="main-container ">
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <h3 style="margin: 0;">주차장 리뷰 관리</h3>
      </div>
      <div class="search-container">
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
        <th scope="col">리뷰어 이름</th>
        <th scope="col">리뷰</th>
        <th scope="col">날짜</th>
        <th scope="col">신고</th>
      </tr>
      </thead>
      <tbody v-if="reviewData.length > 0">
      <tr v-for="(review, index) in reviewData" :key="index">
        <td>{{ index + 1}}</td>
        <td>{{ review.reviewer }}</td>
        <td>{{ review.review }}</td>
        <td>{{ review.reviewDate }}</td>
        <td>
          <button class="btn bg-red btn-red-sm" @click="viewDetails(parkingLot)">신고</button>
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
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: ['selectedLotId'],
  data() {
    return {

      searchOption: 'name',
      searchKeyword: '',
      reviewData: [],
      currentPage: 1,
      totalPages: 0,
      pageSize: 10,
      paginationSize: 10,
      from: null,
      to: null
    }
  },
  methods: {
    reloadParkingLotData() {
      // 상위 컴포넌트의 데이터를 다시 불러오는 로직
      this.getParkingLotData()
    },
    // 주차장 데이터를 가져오는 메서드
    async getParkingLotData(page = 1) {
      let params = {
        page: page - 1,
        size: this.pageSize,
        from: this.from,
        to: this.to
      }

      // 선택된 검색 옵션에 따라 파라미터 설정
      if (this.searchOption === 'name') {
        params.name = this.searchKeyword
      } else if (this.searchOption === 'address') {
        params.address = this.searchKeyword
      }

      try {
        const response = await axios.get(`/api/parking-manager/parkinglots/${this.$props.selectedLotId}/reviews/protected`, { params })
        console.log(response.data);
        this.reviewData = response.data.parkingReviews
        this.totalPages = response.data.totalPages
        this.currentPage = response.data.currentPage + 1
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
  width: 100%;
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

/* 이전, 다음 버튼에 보라색 적용 */
.pagination .page-item .page-link {
  color: #9A64E8; /* 보라색 텍스트 */
}

.pagination .page-item.disabled .page-link {
  color: #6c757d; /* 비활성화된 버튼 색상 */
}

.bg-purple {
  background-color: #9A64E8; /* 기본 보라색 */
  color: white;
}

.bg-red {
  font-size: 14px;
  background-color: #F93A41;
  color: white;
  padding: 3px 5px;
}
.btn.btn-red-sm:hover{
  background-color: #F93A41; /* 기본 보라색 */
  color: white;
}
</style>
