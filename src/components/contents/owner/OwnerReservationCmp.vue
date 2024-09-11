<!--
 담당자: 양건모
 시작 일자: 2024.09.10
 설명 : 주차장 업주 대시보드 - 예약 관리
 ---------------------
 2024.09.11 김찬희 | UI 구현
 2024.09.11 양건모 | UI 수정
 
-->
<template>
  <div class="reservation-container">
    <div class="reservation-section">
      <h3>미승인된 예약</h3>
      <table>
        <thead>
          <tr>
            <th>NO</th>
            <th>예약 날짜</th>
            <th>사용자 및 차량 조회</th>
            <th>부가서비스</th>
            <th>예약 승인 여부</th>
            <th>예약 삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(reservation, index) in pendingReservations" :key="index">
            <td>{{ index + 1 }}</td>
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
      <!-- 페이지네이션 -->
      <div class="pagination">
        <span @click="prevPage">«</span>
        <span
          v-for="page in totalPages"
          :key="page"
          @click="goToPage(page)"
          :class="{ active: currentPage === page }"
          >{{ page }}</span
        >
        <span @click="nextPage">»</span>
      </div>
    </div>

    <div class="reservation-section">
      <h3>승인된 예약</h3>
      <table>
        <thead>
          <tr>
            <th>NO</th>
            <th>예약 날짜</th>
            <th>사용자 및 차량 조회</th>
            <th>부가서비스</th>
            <th>예약 승인 여부</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(reservation, index) in approvedReservations" :key="index">
            <td>{{ index + 1 }}</td>
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
      <!-- 페이지네이션 -->
      <div class="pagination">
        <span @click="prevPage">«</span>
        <span
          v-for="page in totalPages"
          :key="page"
          @click="goToPage(page)"
          :class="{ active: currentPage === page }"
          >{{ page }}</span
        >
        <span @click="nextPage">»</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pendingReservations: [
        // 샘플 데이터
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
      currentPage: 1,
      totalPages: 5
    }
  },
  methods: {
    viewUserInfo(reservation) {
      alert(`사용자 정보: ${reservation.date1}`)
    },
    deleteReservation(index) {
      this.pendingReservations.splice(index, 1)
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++
    },
    goToPage(page) {
      this.currentPage = page
    }
  }
}
</script>

<style scoped>
.reservation-container {
  display: flex;
  justify-content: space-between;
}

.reservation-section {
  width: 48%;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th,
td {
  padding: 12px 15px;
  text-align: center;
}

th {
  background-color: #f0f0f0;
  font-weight: bold;
}

td {
  background-color: #f9f9f9;
  border-bottom: 1px solid #ddd;
}

tbody tr:hover {
  background-color: #f1f1f1;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 6px 12px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.pagination span {
  margin: 0 5px;
  padding: 5px 10px;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.pagination span.active {
  background-color: #007bff;
  color: white;
}

.pagination span:hover {
  background-color: #e0e0e0;
}
</style>
