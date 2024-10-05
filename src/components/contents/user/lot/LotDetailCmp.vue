<template>
  <!-- 
    작성자: 오지수 
    주차장 상세 메인페이지
  -->
  <div class="parking-detail">
    <!-- 이미지 슬라이더 -->
    <div v-if="images.length === 0">
      <img src="@/assets/img/no-map.jpg" alt="Default Image" class="parking-image" />
    </div>

    <div v-else-if="images.length === 1">
      <img :src="removeFileProtocol(images[0])" alt="Parking Image" class="parking-image" />
    </div>

    <div v-else>
      <swiper class="mySwiper">
        <swiper-slide v-for="(image, index) in images" :key="index">
          <img :src="removeFileProtocol(image)" alt="Parking image" class="parking-image" />
        </swiper-slide>
      </swiper>
    </div>

    <!-- 주차장 정보 -->
    <div class="parking-info">
      <div>
        <div class="parking-name">{{ parkingLotDetail.parkingLotName }}</div>
        |
        <div class="parking-type">{{ parkingLotDetail.parkingLotType }}</div>
      </div>
      <div id="favorite" v-if="authStore.isLoggedIn">
        <img
          class="favorite-image"
          src="@/assets/img/favorite-filled.png"
          v-if="hasFavorite"
          @click="toggleFavorite()"
        />
        <img
          class="favorite-image"
          src="@/assets/img/favorite-empty.png"
          v-else
          @click="toggleFavorite()"
        />
      </div>
    </div>

    <!-- 탭 버튼 -->
    <div class="tab-buttons">
      <router-link
        :to="`/lot/${parkinglotId}/home`"
        class="tab"
        :class="{ active: isActiveTab('home') }"
        >홈</router-link
      >
      <router-link
        :to="`/lot/${parkinglotId}/review`"
        class="tab"
        :class="{ active: isActiveTab('review') }"
        >리뷰</router-link
      >
      <router-link
        :to="`/lot/${parkinglotId}/inquiry`"
        class="tab"
        :class="{ active: isActiveTab('inquiry') }"
        >문의</router-link
      >
    </div>

    <!-- 선택된 컴포넌트 출력 -->
    <router-view :parkingLotDetail="parkingLotDetail"></router-view>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { AuthStore } from '@/stores/store'
import 'swiper/css'

const authStore = AuthStore()
const route = useRoute()
const parkinglotId = route.params.lotId

const parkingLotDetail = ref([])

const images = ref([])
const hasFavorite = ref(false)

const getParkingLotDetails = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/parkinglots/${parkinglotId}`
    )
    parkingLotDetail.value = response.data
    images.value = response.data.images
    getHasFavorite()
  } catch (error) {
    //error
  }
}

const getHasFavorite = async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/favorites/parkingLot/${parkinglotId}/protected`
  )
  hasFavorite.value = response.data.hasFavorite
}

onMounted(() => {
  getParkingLotDetails()
})

const isActiveTab = (tab) => route.path.includes(tab)

const toggleFavorite = async () => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/favorites/protected`,
    null,
    {
      params: {
        parkingLotId: parkinglotId
      },
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      }
    }
  )
  hasFavorite.value = response.data.toggleResult
}

//잠깐 쓸거
const removeFileProtocol = (path) => {
  if (path.startsWith('file:///')) {
    return path.replace('file:///', '')
  }
  return path
}
</script>

<style scoped>
.parking-detail {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 700px;
  margin: auto;
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
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
}

.parking-name {
  font-size: 20px;
  font-weight: 700;
  flex: 3;
}

.parking-type {
  font-size: 12px;
  flex: 1.2;
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
  color: #4a4a4a;
}

.tab-buttons .tab.active {
  background-color: white;
  color: #9a64e8;
  font-weight: 700;
  border-bottom: 2px solid #757575;
}

.tab-buttons .tab:hover {
  background-color: white;
  color: #9a64e8;
}

#favorite {
  width: auto;
  display: flex;
  justify-content: flex-end; /* 오른쪽 정렬 */
}

.favorite-image {
  width: 30px;
  height: 30px;
}
</style>
