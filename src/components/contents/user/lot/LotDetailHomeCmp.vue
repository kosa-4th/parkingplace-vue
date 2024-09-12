<template>
  <!-- 
    작성자: 오지수
    주차장 상세 페이지: 홈 (주차장 상세 정보)
    2024.09.09 양건모 | 에약하기 버튼 클릭시 예약하기 페이지로 이동
  -->
  <div class="home-detail">
    <!-- 주소 -->
    <div class="detail-item">
      <!-- <i class="icon location"></i> -->
      <img src="@/assets/img/icon-position.png" alt="Location Icon" class="icon">
      <p>{{ parkingLotDetail.address }}</p>
    </div>

    <!-- 전화번호 -->
    <div class="detail-item" v-if="!parkingLotDetail.phone==''">
      <!-- <i class="icon phone"></i> -->
      <img src="@/assets/img/icon-call.png" alt="Phone Icon" class="icon">
      <p>{{ parkingLotDetail.phone }}</p>
    </div>

    <!-- 영업시간 -->
    <div class="detail-item-col">
      <div>
        <!-- <i class="icon clock"></i> -->
        <img src="@/assets/img/icon-clock.png" alt="Clock Icon" class="icon">
        <p>영업시간</p>
        <!-- <p>영업시간</p> -->
      </div>
        <p>평일 {{ parkingLotDetail.weekdayTime }}</p>
        <p>주말 {{ parkingLotDetail.weekendTime }}</p>
    </div>

    <!-- 가격 -->
    <div class="detail-item-col">
      
      <div>
        <!-- <i class="icon price"></i> -->
        <img src="@/assets/img/icon-won.png" alt="Price Icon" class="icon">
        <p>가격</p>
      </div>
        <p>평일 {{ lib.getNumberFormatted(parkingLotDetail.weekdayPrice) }}원</p>
        <p>주말 {{ lib.getNumberFormatted(parkingLotDetail.weekendPrice) }}원</p>
      
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
  width: 90%;
  max-width: 700px;
  /* padding: 20px; */
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 10px 0;
}

.detail-item {
  display: flex;
  align-items: center;
}

/* i {
  font-size: 20px;
  margin-right: 10px;
} */
.icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}
.detail-item p {
  margin: 0;
}

.detail-item-col {
  display: flex;
  flex-direction: column;
}

.detail-item-col > div > p {
  margin: 0;
}

.detail-item-col > div{
  display: flex;
  flex-direction: row;
  align-items: center;
}

.detail-item-col > p {
  margin: 0;
  padding-left: 38px;
}

/* .icon.location::before {
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
} */

.reservation-button {
  background-color: #9a64e8;
  color: white;
  padding: auto;
  border: none;
  border-radius: 5px;
  font-size: 17px;
  cursor: pointer;
  width: 100%;
  height: 40px;
  margin-top: 10px;
  margin-bottom: 20px;
}

.reservation-button:hover {
  background-color: #8e49b2;
}
</style>
