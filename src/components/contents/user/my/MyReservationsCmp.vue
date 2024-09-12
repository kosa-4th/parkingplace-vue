<template>
  <div class="reservation-container">
    <h2>예약 내역</h2>

    <!-- 날짜 선택 -->
    <div class="date-picker">
      <Datepicker
        class="date-input"
        v-model="startDate"
        format="yyyy-MM-dd HH:mm:ss"
        :upperLimit="dateData.to"
        :lowerLimit="dateData.from"
        clearable="true"
        enable-time-picker="false"
        :max-date="dateData.endDate"
        />
      <span> ~ </span>
      <Datepicker
        class="date-input"
        v-model="endDate"
        format="yyyy-MM-dd HH:mm:ss"
        :upperLimit="dateData.to"
        :lowerLimit="dateData.from"
        clearable="true"
        enable-time-picker="false"
        :min-date="dateData.startDate"
        />
      <button class="search-btn" @click="getMyReservations"><i class="fa fa-search"></i></button>
    </div>

    <!-- 예약내역 목록 -->
    <div v-if="reservations.length === 0" class="no-reservations">
      예약 내역이 없습니다.
    </div>

    <div v-else class="reservation-list">
      <div v-for="(reservation, index) in reservations" :key="index" class="reservation-item">
        <div class="reservation-info">
          <span class="parking-name">{{ reservation.parkingName }}</span>
          <div class="reservation-dates">
            {{ reservation.startDate }} {{ reservation.startTime }} <br />
            {{ reservation.endDate }} {{ reservation.endTime }}
          </div>
        </div>
        <button class="detail-btn" @click="gotoReservationDetail(reservation.id)">예약 상세</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const dateData = {
  startDate: null,
  endDate: null,
  locale: 'kr',
  to: new Date(),
  from: new Date(1999, 1, 1),
}
const page = ref(0);
const size = 5;

const startDate = ref(new Date());
const endDate = ref(new Date());
const reservations = ref([]);

const getMyReservations = async () => {
  console.log("시작날짜야~ :" +startDate.value);
  const response = await axios.post("/api/users/reservations/protected", {
      startDate: formatDate(startDate.value),
      endDate: formatDate(endDate.value),
      page:page.value,
      size: size
  });
  console.log(response.data)
}

const gotoReservationDetail = (reservationId) => {
  console.log(reservationId);
}

onMounted(() => {
  getMyReservations();
})

const formatDate = (date) => {
  return date.toISOString().substring(0, 19);
}
</script>

<style scoped>
.reservation-container {
  width: 90%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.date-picker {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.date-input {
  width: 150px;
  padding: 8px;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.search-btn {
  border: 1px solid #9A64E8;
  color: #9A64E8;
  cursor: pointer;
}

.search-btn i{
  font-size: 16px;
}

.reservation-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.reservation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
}

.reservation-info {
  font-size: 14px;
}

.parking-name {
  font-weight: 700;
  display: block;
  margin-bottom: 5px;
}

.detail-btn {
  background-color: #9A64E8;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 12px;
  cursor: pointer;
}

.no-reservation {
  text-align: center;
  font-size: 16px;
  color: #888;
}

</style>
