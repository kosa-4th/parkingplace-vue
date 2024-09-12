<template>
  <div class="reservation-container">
    <!-- 미승인된 예약 섹션 -->
    <div class="reservation-section-box">
      <div class="reservation-section">
        <h3>미승인된 예약</h3>
        <table>
          <thead>
            <tr>
              <!-- 테이블 헤더 -->
              <th>NO</th>
              <th>예약 날짜</th>
              <th>사용자 및 차량 조회</th>
              <th>부가서비스</th>
              <th>예약 승인 여부</th>
              <th>예약 삭제</th>
            </tr>
          </thead>
          <tbody>
            <!-- 미승인된 예약 목록을 페이징 처리하여 표시 -->
            <tr v-for="(reservation, index) in paginatedPendingReservations" :key="index">
              <td>{{ index + 1 + (pendingCurrentPage - 1) * reservationsPerPage }}</td>
              <td>
                <div>{{ reservation.date1 }}</div>
                <div>{{ reservation.date2 }}</div>
              </td>
              <td><button @click="viewUserInfo(reservation)">조회하기</button></td>
              <td>{{ reservation.extraService }}</td>
              <td><input type="checkbox" v-model="reservation.approval" /></td>
              <td><button @click="deleteReservation(index)">삭제</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 미승인 예약 페이지네이션 -->
      <div class="pagination">
        <span @click="prevPendingPage">«</span>
        <span
          v-for="page in pendingTotalPages"
          :key="page"
          @click="goToPendingPage(page)"
          :class="{ active: pendingCurrentPage === page }"
          >{{ page }}</span
        >
        <span @click="nextPendingPage">»</span>
      </div>
    </div>

    <!-- 승인된 예약 섹션 -->
    <div class="reservation-section-box">
      <div class="reservation-section">
        <h3>승인된 예약</h3>
        <table>
          <thead>
            <tr>
              <!-- 테이블 헤더 -->
              <th>NO</th>
              <th>예약 날짜</th>
              <th>사용자 및 차량 조회</th>
              <th>부가서비스</th>
              <th>예약 승인 여부</th>
            </tr>
          </thead>
          <tbody>
            <!-- 승인된 예약 목록을 페이징 처리하여 표시 -->
            <tr v-for="(reservation, index) in paginatedApprovedReservations" :key="index">
              <td>{{ index + 1 + (approvedCurrentPage - 1) * reservationsPerPage }}</td>
              <td>
                <div>{{ reservation.date1 }}</div>
                <div>{{ reservation.date2 }}</div>
              </td>
              <td><button @click="viewUserInfo(reservation)">조회하기</button></td>
              <td>{{ reservation.extraService }}</td>
              <td><input type="checkbox" v-model="reservation.approval" disabled /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 승인된 예약 페이지네이션 -->
      <div class="pagination">
        <span @click="prevApprovedPage">«</span>
        <span
          v-for="page in approvedTotalPages"
          :key="page"
          @click="goToApprovedPage(page)"
          :class="{ active: approvedCurrentPage === page }"
          >{{ page }}</span
        >
        <span @click="nextApprovedPage">»</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 미승인 예약 데이터 샘플
      pendingReservations: [
        {
          date1: '2024-08-30 14:00',
          date2: '2024-08-31 14:00',
          extraService: '세차',
          approval: false
        },
        {
          date1: '2024-08-30 14:00',
          date2: '2024-08-31 14:00',
          extraService: '세차',
          approval: false
        },
        {
          date1: '2024-08-30 14:00',
          date2: '2024-08-31 14:00',
          extraService: '세차',
          approval: false
        }
      ],
      // 승인된 예약 데이터 샘플
      approvedReservations: [
        {
          date1: '2024-08-30 14:00',
          date2: '2024-08-31 14:00',
          extraService: '세차',
          approval: true
        },
        {
          date1: '2024-08-30 14:00',
          date2: '2024-08-31 14:00',
          extraService: '세차',
          approval: true
        },
        {
          date1: '2024-08-30 14:00',
          date2: '2024-08-31 14:00',
          extraService: '세차',
          approval: true
        }
      ],
      pendingCurrentPage: 1, // 미승인 예약 현재 페이지
      approvedCurrentPage: 1, // 승인된 예약 현재 페이지
      reservationsPerPage: 2 // 한 페이지당 보여줄 예약 수
    }
  },
  computed: {
    // 미승인된 예약의 총 페이지 수 계산
    pendingTotalPages() {
      return Math.ceil(this.pendingReservations.length / this.reservationsPerPage)
    },
    // 승인된 예약의 총 페이지 수 계산
    approvedTotalPages() {
      return Math.ceil(this.approvedReservations.length / this.reservationsPerPage)
    },
    // 현재 페이지에 맞게 미승인 예약을 페이징 처리하여 반환
    paginatedPendingReservations() {
      const start = (this.pendingCurrentPage - 1) * this.reservationsPerPage
      const end = start + this.reservationsPerPage
      return this.pendingReservations.slice(start, end)
    },
    // 현재 페이지에 맞게 승인된 예약을 페이징 처리하여 반환
    paginatedApprovedReservations() {
      const start = (this.approvedCurrentPage - 1) * this.reservationsPerPage
      const end = start + this.reservationsPerPage
      return this.approvedReservations.slice(start, end)
    }
  },
  methods: {
    // 사용자 정보를 조회하는 메서드
    viewUserInfo(reservation) {
      alert(`사용자 정보: ${reservation.date1}`)
    },
    // 미승인 예약을 삭제하는 메서드
    deleteReservation(index) {
      this.pendingReservations.splice(index, 1)
    },
    // 미승인 예약 페이지의 이전 페이지로 이동하는 메서드
    prevPendingPage() {
      if (this.pendingCurrentPage > 1) this.pendingCurrentPage--
    },
    // 미승인 예약 페이지의 다음 페이지로 이동하는 메서드
    nextPendingPage() {
      if (this.pendingCurrentPage < this.pendingTotalPages) this.pendingCurrentPage++
    },
    // 미승인 예약의 특정 페이지로 이동하는 메서드
    goToPendingPage(page) {
      this.pendingCurrentPage = page
    },
    // 승인된 예약 페이지의 이전 페이지로 이동하는 메서드
    prevApprovedPage() {
      if (this.approvedCurrentPage > 1) this.approvedCurrentPage--
    },
    // 승인된 예약 페이지의 다음 페이지로 이동하는 메서드
    nextApprovedPage() {
      if (this.approvedCurrentPage < this.approvedTotalPages) this.approvedCurrentPage++
    },
    // 승인된 예약의 특정 페이지로 이동하는 메서드
    goToApprovedPage(page) {
      this.approvedCurrentPage = page
    }
  }
}
</script>

<style scoped>
/* 예약 섹션 박스 설정: 상하 공간 분배를 위한 flex 사용 */
.reservation-section-box {
  display: flex;
  height: 800px;
  flex-direction: column;
  align-content: center;
  justify-content: space-between;
}

/* 전체 컨테이너 스타일 */
.reservation-container {
  display: flex;
  align-items: center;
  gap: 20px;
  height: 100%;
}

/* 예약 섹션의 스타일: 테두리 및 그림자 적용 */
.reservation-section {
  width: 100%;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

/* 테이블 스타일 */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

/* 테이블 셀 스타일 */
th,
td {
  padding: 12px 15px;
  text-align: center;
}

/* 테이블 헤더 스타일 */
th {
  background-color: #f0f0f0;
  font-weight: bold;
}

/* 테이블 바디 셀 스타일 */
td {
  background-color: #f9f9f9;
  border-bottom: 1px solid #ddd;
}

/* 마우스를 올렸을 때 테이블 행 배경색 변경 */
tbody tr:hover {
  background-color: #f1f1f1;
}

/* 버튼 기본 스타일 */
button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 6px 12px;
  cursor: pointer;
}

/* 버튼 호버 시 배경색 변경 */
button:hover {
  background-color: #0056b3;
}

/* 페이지네이션 스타일: 중앙 정렬 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}

/* 페이지네이션 버튼 스타일 */
.pagination span {
  margin: 0 5px;
  padding: 5px 10px;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 5px;
}

/* 현재 페이지 버튼 스타일 */
.pagination span.active {
  background-color: #007bff;
  color: white;
}

/* 페이지네이션 버튼 호버 시 배경색 변경 */
.pagination span:hover {
  background-color: #e0e0e0;
}
</style>
