<template>
  <!-- 
    작성자: 오지수 
    주차장 상세 메인페이지
  -->
  <div class="parking-detail">
    <!-- 이미지 슬라이더 -->
    <div class="image-slider" v-if="hasImages">
      <swiper :navigation="images.length>1" :pagination="true" class="mySwiper">
        <swiper-slide v-for="(image, index) in images" :key="index">
          <img :src="image" alt="Parking Image" class="parking-image" />
        </swiper-slide>
      </swiper>
    </div>
    <div>
      <img src="../../../../assets/img/no-map.jpg" alt="Default Image" class="parking-image" />
    </div>

    <!-- 주차장 정보 -->
    <div class="parking-info">
      <div>
        <div class="parking-name">{{ parkingLotDetail.parkingLotName }}</div>
        |
        <div class="parking-type">{{ parkingLotDetail.parkingLotType }}</div>
      </div>
      <div>별</div>
    </div>

    <!-- 탭 버튼 -->
    <div class="tab-buttons">
      <router-link :to="`/lot/${parkinglotId}/home`" class="tab" :class="{ active: isActiveTab('home') }">홈</router-link>
      <router-link :to="`/lot/${parkinglotId}/review`" class="tab" :class="{ active: isActiveTab('review') }">리뷰</router-link>
      <router-link :to="`/lot/${parkinglotId}/inquiry`" class="tab" :class="{ active: isActiveTab('inquiry') }">문의</router-link>
    </div>

    <!-- 선택된 컴포넌트 출력 -->
    <router-view :parkingLotDetail="parkingLotDetail"></router-view>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {Swiper, SwiperSlide } from 'swiper/vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const parkinglotId = route.params.lotId;

const parkingLotDetail = ref([]);

const images = ref([]);

const hasImages = computed(() => images.value.length > 0);

const getParkingLotDetails = async () => {
  try {
    
    const response = await axios.get(`/api/parkinglots/${parkinglotId}`);
    console.log(response.data);
    parkingLotDetail.value = response.data;
  } catch (error) {
    console.log(error);
  }
}

onMounted(() => {
  getParkingLotDetails();
});


const isActiveTab = (tab) => route.path.includes(tab);
</script>

<style scoped>
.parking-detail {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-slider {
  width: 100%;
  height: 300px;
  margin-bottom: 20px;
}

.default-image {
  width: 100%;
  height: 300px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.parking-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.parking-info {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #ddd;
}

.parking-info div {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
}

.parking-name {
  font-size: 20px;
  font-weight: 700;
}

.parking-type {
  font-size: 12px;
}

.tab-buttons {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
}

.tab-buttons .tab {
  padding: 15px 5px;
  text-decoration: none;
  background-color: white;
  cursor: pointer;
  color: black;
}

.tab-buttons .tab.active {
  background-color: white;
  color: #9A64E8;
  font-weight: 700;
  border-bottom: 2px solid #757575;
}

.tab-buttons .tab:hover {
  background-color: white;
  color: #9A64E8;
}
</style>
