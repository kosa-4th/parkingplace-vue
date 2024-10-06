<!--
@Author김경민
@Date 2024.09.19-2023.09.20
디자인 및 데이터 가져오기 및 승인 및 취소
-->

<template>
  <div class="main-container">
    <div class="tabs-container">
      <!-- 부트스트랩 네비게이션 탭 -->
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <a
            class="nav-link subtitle"
            :class="{ active: activeTab === 'not_approved' }"
            @click="switchTab('not_approved')"
          >
            미승인 된 예약
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link subtitle"
            :class="{ active: activeTab === 'approved' }"
            @click="switchTab('approved')"
          >
            승인 된 예약
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link subtitle"
            :class="{ active: activeTab === 'canceled' }"
            @click="switchTab('canceled')"
          >
            취소 된 예약
          </a>
        </li>
      </ul>
      <!-- 기간 선택 -->
      <div class="input-group mb-3 search-container mt-3">
        <div class="form-group">
          <input type="date" v-model="startDate" id="start-date" class="form-control" />
        </div>

        <div class="form-group mx-3">
          <input type="date" v-model="endDate" id="end-date" class="form-control" />
        </div>
        <button class="btn bg-purple btn-sm" @click="applyDateFilter">검색</button>
      </div>
    </div>

    <!-- 탭에 해당하는 콘텐츠 영역 -->
    <div class="tab-content">
      <!-- 미승인 예약 탭 -->
      <div v-if="activeTab === 'not_approved'">
        <table class="table table-bordered table-hover text-center">
          <thead class="thead-dark">
          <tr>
            <th scope="col">NO</th>
            <th scope="col">예약 날짜</th>
            <th scope="col">사용자 및 차량 조회</th>
            <th scope="col">부가서비스</th>
            <th scope="col">승인</th>
            <th scope="col">거부</th>
          </tr>
          </thead>
          <tbody>
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
            <td class="center-text">
              <button class="btn btn-sm bg-green" @click="permitReservation(reservation.reservationId)">허가</button>
            </td>
            <td class="center-text">
              <button class="btn btn-sm bg-red"
                      @click="ignoreReservation(reservation.reservationId, reservation.reservationUid)">거부
              </button>
            </td>
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
      <div v-if="activeTab === 'approved'">
        <table class="table table-bordered table-hover text-center">
          <thead class="thead-dark">
          <tr>
            <th scope="col">NO</th>
            <th scope="col">예약 날짜</th>
            <th scope="col">사용자 및 차량 조회</th>
            <th scope="col">부가서비스</th>
            <th scope="col">예약 삭제</th>
          </tr>
          </thead>
          <tbody>
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
            <td class="center-text">
              <button class="btn btn-sm bg-red"
                      @click="ignoreReservation(reservation.reservationId, reservation.reservationUid)">취소
              </button>
            </td>
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

      <!-- 취소된 예약 탭 -->
      <div v-if="activeTab === 'canceled'">
        <table class="table table-bordered table-hover text-center">
          <thead class="thead-dark">
          <tr>
            <th scope="col">NO</th>
            <th scope="col">예약 날짜</th>
            <th scope="col">사용자 및 차량 조회</th>
            <th scope="col">부가서비스</th>
          </tr>
          </thead>
          <tbody>
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
    

    <div v-if="isLoading" class="loading-container">
      <div class="loading">
        <Fade-loader />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import FadeLoader from 'vue-spinner/src/FadeLoader.vue'

export default {
  components: [FadeLoader],
  props: ['selectedLotId'],

  data() {
    const today = new Date();
    const startDate = today.toISOString().slice(0, 10); // YYYY-MM-DD 형식으로 변환
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 30); // 30일 더함
    const formattedEndDate = endDate.toISOString().slice(0, 10); // YYYY-MM-DD 형식으로 변환

    return {
      activeTab: 'not_approved', // 기본으로 첫 번째 탭이 활성화됨
      reservationsData: [],
      currentPage: 1,
      totalPages: 0,
      pageSize: 5,
      startDate: startDate,
      endDate: formattedEndDate,
      isLoading: false
    }
  },
  methods: {
    async ignoreReservation(reservationId, reservationUid) {
      try {
        this.isLoading = true;
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/parking-manager/reservation/cancel/${reservationId}/protected`, {
          merchantUid: reservationUid,
          reason: '주차장업주 환불'
        })
        this.isLoading = false;
        // 요청 성공 시 처리할 작업
        if (response.status === 200) {
          alert('예약 환불이 되었습니다..')
          window.location.reload()
        }
      } catch (error) {
        // 오류 처리
        console.error('예약 허가 중 오류 발생:', error)
        alert('예약을 허가하는 중 오류가 발생했습니다.')
      }
    },
    async permitReservation(reservationId) {
      try {
        // PUT 요청을 통해 예약 상태를 '허가'로 변경
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/parking-manager/reservation/${reservationId}`, {
          reservationConfirmed: 'Y' // 허가 상태를 'Y'로 설정
        })

        // 요청 성공 시 처리할 작업
        if (response.status === 200) {
          alert('예약이 허가되었습니다.')
          window.location.reload()
        }
      } catch (error) {
        // 오류 처리
        console.error('예약 허가 중 오류 발생:', error)
        alert('예약을 허가하는 중 오류가 발생했습니다.')
      }
    },
    async getReservationByConfirmed(reservationConfirmed, page = 1, size = 5) {
      try {

        // 필터 조건을 requestData 객체로 선언
        const requestData = {
          parkingLotId: this.$props.selectedLotId,
          reservationConfirmed, // 탭에 따른 상태값 설정
          startTime: this.startDate ? `${this.startDate}T00:00:00` : null,
          endTime: this.endDate ? `${this.endDate}T23:59:59` : null
        }

        // Axios 요청
        this.isLoading = true;
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/parking-manager/reservation`, {
          params: {
            ...requestData, // 필터 조건 추가
            page: page - 1, // 0-based pagination 처리
            size: size
          }
        })
        this.isLoading = false;
        if (response.status === 200) {
          this.reservationsData = response.data.content // 받은 데이터 설정
          this.totalPages = response.data.totalPages // 전체 페이지 수 업데이트
        } else if (response.status === 204) {
          console.log('데이터가 없습니다.')
          this.reservationsData = [] // 데이터가 없으면 빈 배열로 설정
        }
      } catch (error) {
        this.isLoading = false;
        console.error('오류 발생:', error)
      }
    },

    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        this.getReservationByConfirmed(this.getReservationStatus(), this.currentPage, this.pageSize)
      }
    },
    applyDateFilter() {
      if (this.startDate > this.endDate) {
        alert('입력 다시 해주세요.')
      } else {
        this.getReservationByConfirmed(this.getReservationStatus(), 1, this.pageSize) // 필터 적용 시 페이지 1로 초기화
      }
    },

    switchTab(tabName) {
      this.activeTab = tabName
      this.currentPage = 1 // 탭을 변경할 때 페이지를 1로 초기화
      this.getReservationByConfirmed(this.getReservationStatus(), this.currentPage, this.pageSize)
    },

    getReservationStatus() {
      // 탭에 따른 상태값 반환
      if (this.activeTab === 'not_approved') return 'C'
      if (this.activeTab === 'approved') return 'Y'
      if (this.activeTab === 'canceled') return 'D'
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
    this.getReservationByConfirmed(this.getReservationStatus(), this.currentPage, this.pageSize)
  },
  watch(){
    this.getReservationByConfirmed(this.getReservationStatus(), this.currentPage, this.pageSize)
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
.center-text {
  vertical-align: middle; /* 수직 가운데 정렬 */
}

.btn {
  display: inline-block;
  padding: 5px 10px;
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