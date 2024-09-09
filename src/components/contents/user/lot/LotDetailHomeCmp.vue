<template>
  <!-- 
    작성자: 오지수
    주차장 상세 페이지: 홈 (주차장 상세 정보)
    2024.09.09 양건모 | 에약하기 버튼 클릭시 예약하기 페이지로 이동
  -->
  <div class="home-detail">
    <!-- 주소 -->
    <div class="detail-item">
      <i class="icon location"></i>
      <p>{{ parkingLotDetail.address }}</p>
    </div>

    <!-- 전화번호 -->
    <div class="detail-item">
      <i class="icon phone"></i>
      <p>{{ parkingLotDetail.phone }}</p>
    </div>

    <!-- 영업시간 -->
    <div class="detail-item">
      <i class="icon clock"></i>
      <div>
        <p>영업시간</p>
        <p>평일 {{ parkingLotDetail.weekdayTime }}</p>
        <p>주말 {{ parkingLotDetail.weekendTime }}</p>
      </div>
    </div>

    <!-- 가격 -->
    <div class="detail-item">
      <i class="icon price"></i>
      <div>
        <p>가격</p>
        <p>평일 {{ lib.getNumberFormatted(parkingLotDetail.weekdayPrice) }}원</p>
        <p>주말 {{ lib.getNumberFormatted(parkingLotDetail.weekendPrice) }}원</p>
      </div>
    </div>

    <!-- 예약 버튼 -->
    <button @click="toReservation()" class="reservation-button">예약하기</button>
  </div>
</template>

<script setup>
import router from '@/router'
import { useRoute } from 'vue-router'
import lib from '@/scripts/lib'

const route = useRoute()

const props = defineProps({
  parkingLotDetail: {
    type: Object,
    required: true
  }
})

const toReservation = function () {
  router.push(`/reservation/${route.params.lotId}`)
}
</script>

<style scoped>
.home-detail {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-item {
  display: flex;
  align-items: center;
}

.detail-item i {
  font-size: 20px;
  margin-right: 10px;
}

.detail-item p {
  margin: 0;
}

.icon.location::before {
  content: '📍';
}

.icon.phone::before {
  content: '📞';
}

.icon.clock::before {
  content: '⏰';
}

.icon.price::before {
  content: '💰';
}

.reservation-button {
  background-color: #a663cc;
  color: white;
  padding: 15px 20px;
  border: none;
  border-radius: 5px;
  font-size: 17px;
  cursor: pointer;
  width: 100%;
}

.reservation-button:hover {
  background-color: #8e49b2;
}
</style>
