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
      <h2>{{ parkingLotDetail.parkingLotName }}</h2>
      <p>{{ parkingLotDetail.parkingLotType }}</p>
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
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
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
  text-align: center;
  margin-bottom: 20px;
}

.tab-buttons {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-bottom: 20px;
}

.tab-buttons .tab {
  padding: 10px 20px;
  text-decoration: none;
  background-color: #ddd;
  cursor: pointer;
  color: black;
  font-weight: bold;
  border-radius: 5px;
}

.tab-buttons .tab.active {
  background-color: #a663cc;
  color: white;
}

.tab-buttons .tab:hover {
  background-color: #a663cc;
  color: white;
}
</style>
