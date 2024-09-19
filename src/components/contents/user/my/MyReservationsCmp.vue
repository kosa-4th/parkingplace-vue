<template>
  <div class="reservation-container">
    <div class="reservation-toggle">
      <div class="title">예약 내역</div>
  
      <!-- 토글 버튼 -->
      <div class="toggle-search">
        <button @click="toggleDatepicker" class="toggle-btn">
          <img src="@/assets/img/search-purple.png" alt="search" class="toggle-icon">
        </button>
      </div>
    </div>

    <!-- 날짜 선택 -->
    <div v-if="showDatePicker" class="date-picker">
      <img src="@/assets/img/arrow-top-grey.png" @click="toggleDatepicker" alt="arrow" class="arrow-img">
      <div>
        <label>시작 날짜</label>
        <Datepicker
          class="date-input"
          v-model="startDate"
          format="yyyy-MM-dd"
          clearable="true"
          enable-time-picker="false"
        />
      </div>
      <div>
        <label>마지막 날짜</label>
        <Datepicker
          class="date-input"
          v-model="endDate"
          format="yyyy-MM-dd"
          clearable="true"
          enable-time-picker="false"
        />
      </div>
      <button class="search-btn" @click="getNewReservations">검색하기</button>
    </div>

    <div v-if="reservations.length === 0" class="no-reservations">
      예약 내역이 없습니다.
    </div>

    <div v-else class="reservation-list">
      <div
        v-for="(reservation, index) in reservations"
        :key="index"
        class="reservation-item"
        :class="{ 'canceled': reservation.status === 'canceled'}"
      >
        <div class="reservation-status" :class="getStatusClass(reservation.status)">
          {{ reservation.status }}
        </div>
        <div class="reservation-info">
          <div class="parking-name">{{ reservation.parkingLotName }}</div>
          <div class="car-info">{{ reservation.carNumber }} | {{ reservation.carType }}</div>
          <div class="reservation-dates">
            주차 시간: {{ DateFormat(reservation.startDate) }} <br />
            출차 시간: {{ DateFormat(reservation.endDate) }}
          </div>
        </div>
        <div class="reservation-btns">
          <router-link
            :to="`/my/reservations/${reservation.reservationId}`"
            class="detail-btn"
            >예약상세</router-link>
          <router-link
            :to="`/lot/${reservation.parkinglotId}`"
            class="rebook-btn"
            >재예약</router-link>
        </div>
      </div>
    </div>

    <!-- 더보기 버튼 -->
    <hr class="more-separatior" v-if="hasMoreData">
    <button class="more-btn" v-if="hasMoreData" @click="getMoreReservations">더보기 ∨</button>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

// const dateData = {
//   startDate: null,
//   endDate: null,
//   locale: 'kr',
//   to: new Date(),
//   from: new Date(2000, 0, 1)
// }

const showDatePicker = ref(false);
const startDate = ref(new Date(2000, 0, 1));
const endDate = ref(new Date());
endDate.value.setDate(endDate.value.getDate() + 30);
const page = ref(0);
const size = 5;
const hasMoreData = ref(true);

const reservations = ref([]);

// 예약 가져오기
const getMyReservations = async () => {
  try {
    const response = await axios.get("/api/users/reservations/protected", {
      params: {
        startDate: formatDate(startDate.value),
        endDate: formatDate(endDate.value),
        page:page.value,
        size: size
      }
    });
    const newReserve = response.data.reservations;
    reservations.value = [...reservations.value, ...newReserve];
    hasMoreData.value = response.data.nextPage;
    console.log(response.data);
  } catch (error){
    console.log(error.response.data);
  }
}

// date 변환해서 보내기
const formatDate = (date) => {
  return date.toISOString().substring(0, 19);
}

//토클
const toggleDatepicker = () => {
  showDatePicker.value = !showDatePicker.value;
}

//Date 포맷
const DateFormat = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(/\./g, '-').replace(/\s/g, ' ');
}

//글씨 색
const getStatusClass = (status) => {
  switch (status) {
    case '예약취소':
      return 'canceled';
    case '예약대기':
      return 'pending';
    case '예약확정':
      return 'confirmed';
  }
}

const getMoreReservations  = () => {
  page.value++;
  getMyReservations();
}

const getNewReservations = () => {
  page.value = 0;
  reservations.value = [];
  getMoreReservations();
}

onMounted(() => {
  getMyReservations();
})

</script>

<style scoped>
.reservation-toggle {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
  margin: 5px 0 10px 0;
}

.title {
  font-size: 20px;
  font-weight: 700;
}

.date-picker {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  width: 100%;
}

.date-picker label {
  /* width: 130px; */
  flex: 1;
  padding: 0 0 10px 5px ;
}

.date-picker div {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.date-input {
  flex:2;
  width: 100%;
}

.reservation-list {
  margin-top: 20px;
}

.reservation-item {
  border: 1px solid #ddd;
  padding: 20px;
  margin-bottom: 10px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.reservation-status {
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 10px;
}

.parking-name {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 5px;
}

.car-info {
}

.reservation-dates {
}

.toggle-btn {
  width: 29px;
  height: 29px;
  background-color: white;
  color: #9A64E8;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
}

.toggle-icon {
  display: flex;
  flex-direction: column;
  width: 200%;
  margin-left: -6px;
}

.arrow-img {
  width: 29px;
  height: 29px;
  margin-bottom: 5px;
}
.search-btn {
  width: 100%;
  height: 40px;
  border: none;
  background-color: #9A64E8;
  border-radius: 5px;
  /* margin-top: 10px; */
  color: white;
  font-weight: 700;
}

.reservation-btns {
  display: flex;
  justify-content: space-between;
}

.detail-btn, .rebook-btn {
  width: 45%;
  padding: 10px;
  margin-right: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: white;
  cursor: pointer;
  text-align: center;
}

.toggle-search {
  /* text-align: right; */
  /* margin-bottom: 10px; */
  display: flex;
  justify-content: center;
  align-items: center;
  width: 29px;
  height: 29px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.fa-search {
  cursor: pointer;
}

.canceled {
  color: #F93A41;
}

.pending {
  color: #9A64E8;
}

.confirmed {
  color: #76D672;
}
</style>