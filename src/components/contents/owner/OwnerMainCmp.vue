<!--
@Author김경민
@Date 2024.09.19-2023.09.20
디자인 및 데이터 가져오기 및 승인 및 취소
-->

<template>
  <div class="main-container">
    <h3>{{ formattedToday }} ## {{ parkingLotName }}의 현황 </h3>
    <br>
    <div class="tabs-container">
      <!-- 부트스트랩 네비게이션 탭 -->
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <a
            class="nav-link subtitle"
            :class="{ active: activeTab === 'entryScheduled' }"
            @click="switchTab('entryScheduled')"
          >
            입차 예정
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link subtitle"
            :class="{ active: activeTab === 'exitScheduled' }"
            @click="switchTab('exitScheduled')"
          >
            출차 예정
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link subtitle"
            :class="{ active: activeTab === 'exitCompleted' }"
            @click="switchTab('exitCompleted')"
          >
            출차 완료
          </a>
        </li>
      </ul>
      <!-- 기간 선택 -->
    </div>

    <!-- 탭에 해당하는 콘텐츠 영역 -->
    <div class="tab-content">
      <div v-if="activeTab === 'entryScheduled'">
        <table class="table table-bordered table-hover text-center">
          <thead class="thead-dark">
          <tr>
            <th scope="col">NO</th>
            <th scope="col">예약 날짜</th>
            <th scope="col">사용자 및 차량 조회</th>
            <th scope="col">부가서비스</th>
          </tr>
          </thead>
          <tbody v-if="reservationsData.length > 0">
          <tr v-for="(reservation, index) in reservationsData" :key="reservation.reservationId">
            <td>{{ index + 1 }}</td>
            <td>
              {{ formatDate(reservation.startTime) }} <br> {{ formatDate(reservation.endTime) }}
            </td>
            <td align="left">
              예약자명 : <span>{{ reservation.userName }}</span>
              <br>
              차량번호 : <span>{{ reservation.plateCarNumber }}</span>
            </td>
            <td>  <!-- 세차 여부 체크박스 -->
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :checked="reservation.wash === 'Y'"
                  disabled
                />
                <label class="form-check-label">세차</label>
              </div>

              <!-- 정비 여부 체크박스 -->
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :checked="reservation.maintenance === 'Y'"
                  disabled
                />
                <label class="form-check-label">정비</label>
              </div>
            </td>
          </tr>
          </tbody>
          <!-- 데이터가 없을 때 표시할 메시지 -->
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
      <div v-if="activeTab === 'exitScheduled'">
        <table class="table table-bordered table-hover text-center">
          <thead class="thead-dark">
          <tr>
            <th scope="col">NO</th>
            <th scope="col">예약 날짜</th>
            <th scope="col">사용자 및 차량 조회</th>
            <th scope="col">부가서비스</th>
          </tr>
          </thead>
          <tbody v-if="reservationsData.length > 0">
          <tr v-for="(reservation, index) in reservationsData" :key="reservation.reservationId">
            <td>{{ index + 1 }}</td>
            <td>
              {{ formatDate(reservation.startTime) }} <br> {{ formatDate(reservation.endTime) }}
            </td>
            <td align="left">
              예약자명 : <span>{{ reservation.userName }}</span>
              <br>
              차량번호 : <span>{{ reservation.plateCarNumber }}</span>
            </td>
            <td>  <!-- 세차 여부 체크박스 -->
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :checked="reservation.wash === 'Y'"
                  disabled
                />
                <label class="form-check-label">세차</label>
              </div>

              <!-- 정비 여부 체크박스 -->
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :checked="reservation.maintenance === 'Y'"
                  disabled
                />
                <label class="form-check-label">정비</label>
              </div>
            </td>
          </tr>
          </tbody>
          <!-- 데이터가 없을 때 표시할 메시지 -->
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

      <div v-if="activeTab === 'exitCompleted'">
        <table class="table table-bordered table-hover text-center">
          <thead class="thead-dark">
          <tr>
            <th scope="col">NO</th>
            <th scope="col">예약 날짜</th>
            <th scope="col">사용자 및 차량 조회</th>
            <th scope="col">부가서비스</th>
          </tr>
          </thead>
          <tbody v-if="reservationsData.length > 0">
          <tr v-for="(reservation, index) in reservationsData" :key="reservation.reservationId">
            <td>{{ index + 1 }}</td>
            <td>
              {{ formatDate(reservation.startTime) }} <br> {{ formatDate(reservation.endTime) }}
            </td>
            <td align="left">
              예약자명 : <span>{{ reservation.userName }}</span>
              <br>
              차량번호 : <span>{{ reservation.plateCarNumber }}</span>
            </td>
            <td>  <!-- 세차 여부 체크박스 -->
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :checked="reservation.wash === 'Y'"
                  disabled
                />
                <label class="form-check-label">세차</label>
              </div>

              <!-- 정비 여부 체크박스 -->
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :checked="reservation.maintenance === 'Y'"
                  disabled
                />
                <label class="form-check-label">정비</label>
              </div>
            </td>
          </tr>
          </tbody>
          <!-- 데이터가 없을 때 표시할 메시지 -->
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
  </div>
</template>

<script>

import axios from 'axios'

export default {
  props: ['selectedLotId'],

  data() {
    const today = new Date()
// 연도를 두 자릿수로 표시
    const year = String(today.getFullYear()).slice(2)
// 월과 일을 두 자릿수로 표시
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
// 원하는 형식으로 변환
    const formattedToday = `${year}년 ${month}월 ${day}일`
    return {
      activeTab: 'entryScheduled', // 기본으로 첫 번째 탭이 활성화됨
      reservationsData: [],
      currentPage: 1,
      totalPages: 0,
      pageSize: 5,
      formattedToday: formattedToday,
      parkingLotName: null
    }
  },
  methods: {
    async getLotName() {
      try {
        const response = await axios.get('/api/parking-manager/parkingLotName', {
          params: {
            parkingLotId: this.selectedLotId
          }
        })
        this.parkingLotName = response.data.parkingLotName
      } catch (error) {
        alert('잘못된 접근입니다.', error)
      }
    },
    async fetchReservations() {
      try {
        const response = await axios.get('/api/parking-manager/reservations/today', {
          params: {
            parkingLotId: this.selectedLotId,
            status: this.getReservationStatus(),  // 상태에 맞는 데이터를 요청
            page: this.currentPage - 1,
            size: this.pageSize
          }
        })
        this.reservationsData = response.data.content
        this.totalPages = response.data.totalPages
      } catch (error) {
        console.error('데이터를 불러오는 중 오류가 발생했습니다:', error)
      }
    },

    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        this.fetchReservations(this.getReservationStatus(), this.currentPage, this.pageSize)
      }
    },

    switchTab(tabName) {
      this.activeTab = tabName
      this.currentPage = 1 // 탭을 변경할 때 페이지를 1로 초기화
      this.fetchReservations(this.getReservationStatus(), this.currentPage, this.pageSize)
    },

    getReservationStatus() {
      if (this.activeTab === 'entryScheduled') return 'ENTRY'
      if (this.activeTab === 'exitScheduled') return 'EXIT'
      if (this.activeTab === 'exitCompleted') return 'COMPLETED'
      return ''
    },

    formatDate(dateTime) {
      const date = new Date(dateTime)
      const year = String(date.getFullYear()).slice(2)
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hour = String(date.getHours()).padStart(2, '0')
      const minute = String(date.getMinutes()).padStart(2, '0')
      return `${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분`
    }
  },
  mounted() {
    // 페이지가 로드될 때 기본 탭에 해당하는 데이터를 가져옴
    this.getLotName()
    this.fetchReservations(this.getReservationStatus(), this.currentPage, this.pageSize)
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

.bg-purple {
  background-color: #9A64E8; /* 기본 보라색 */
  color: white;
}

.bg-purple:hover {
  background-color: #8e44ad; /* hover 시 보라색을 더 진하게 */
  color: white; /* 흰색이 아닌 다른 색을 사용하지 않음 */

}

.bg-green {
  background-color: #76D672; /* 기본 보라색 */
  color: white;
}

.bg-green:hover {
  background-color: #76D672; /* hover 시 보라색을 더 진하게 */
  color: white; /* 흰색이 아닌 다른 색을 사용하지 않음 */
}

.bg-red {
  background-color: #F93A41; /* 기본 보라색 */
  color: white;
}

.bg-red:hover {
  background-color: #F93A41; /* hover 시 보라색을 더 진하게 */
  color: white; /* 흰색이 아닌 다른 색을 사용하지 않음 */
}

/* date-picker 전체 영역을 오른쪽으로 배치 */
.search-container {
  display: flex;
  align-items: center;
  justify-content: flex-end; /* 오른쪽 정렬 */
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