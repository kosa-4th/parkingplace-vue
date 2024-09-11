<!-- 
 담당자: 양건모
 시작 일자: 2024.09.09
 설명 : 주차장 프리뷰 컴포넌트
 ---------------------
 2024.09.09 양건모 | 기능 구현
 2024.09.10 양건모 | 즐겨찾기 조회, 등록/해제
 2024.09.10 양건모 | api 명세 변경에 따른 axios 요청 url 변경
 2024.09.11 양건모 | api 명세 변경에 따른 axios 요청 url 변경
 -->

<template>
  <transition name="slide-up">
    <div v-if="visible" class="bottom-sheet">
      <div class="sheet-header">
        <span @click="hide">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9A64E8"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
            width="24"
            height="24"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </span>
      </div>
      <div class="sheet-content">
        <div class="info-box info-box-flex">
          <div id="name-address">
            <h2 class="lot-big">{{ currentLotInfo.name }}</h2>
            <p class="lot-standard">{{ currentLotInfo.address }}</p>
          </div>
          <div id="favorite" v-if="authStore.isLoggedIn">
            <img
              class="favorite-image"
              src="../../../../assets/img/favorite-filled.png"
              v-if="hasFavorite"
              @click="toggleFavorite()"
            />
            <img
              class="favorite-image"
              src="../../../../assets/img/favorite-empty.png"
              v-else
              @click="toggleFavorite()"
            />
          </div>
        </div>
        <div class="info-box">
          <p class="lot-small">리뷰 {{ currentLotInfo.reviewCount }}개</p>
          <div id="recent-review">
            <p class="lot-review">
              {{
                currentLotInfo.recentReview == null || currentLotInfo.recentReview == undefined
                  ? '등록된 리뷰가 없습니다'
                  : currentLotInfo.recentReview
              }}
            </p>
          </div>
        </div>
        <br />
        <div class="info-box">
          <p class="lot-standard" style="text-align: center"><b>요금 안내</b></p>
          <div id="fee-box" v-for="space in currentLotInfo.parkingSpaces" :key="space">
            <p class="lot-standard">
              <b>{{ space.carType }}</b>
            </p>
            <p class="lot-standard indent">
              주중요금 {{ space.weekdaysPrice }}원 (최대 {{ space.weekAllDayPrice }}원)
            </p>
            <p class="lot-standard indent">
              주말요금 {{ space.weekdaysPrice }}원 (최대 {{ space.weekendAllDayPrice }}원)
            </p>
          </div>
        </div>
      </div>
      <div class="sheet-footer">
        <button id="to-detail" @click="toDetail">상세보기</button>
      </div>
    </div>
  </transition>
</template>

<script>
import axios from 'axios'
import router from '@/router'
import { useRoute } from 'vue-router'
import { AuthStore } from '@/stores/store'

export default {
  props: {
    lotInfo: {
      type: Object,
      required: true
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentLotInfo: {}, // 현재 표시할 주차장 정보
      route: useRoute(),
      authStore: AuthStore(),
      hasFavorite: null
    }
  },
  watch: {
    // lotInfo 값이 변경될 때 감지
    lotInfo: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.updateLotInfo(newVal)
        }
      }
    }
  },
  methods: {
    hide() {
      this.$emit('close')
    },
    updateLotInfo(lotInfo) {
      axios({
        method: 'get',
        url: '/api/parkinglots/preview/' + lotInfo.lotId
      })
        .then((response) => {
          this.currentLotInfo = { ...response.data }
        })
        .catch(function (e) {
          console.error(e)
        })
    },
    toDetail() {
      router.push(`/lot/${this.lotInfo.lotId}`)
    },
    async getHasFavorite() {
      await axios({
        method: 'get',
        url: '/api/favorites/parkingLot/' + this.lotInfo.lotId + '/protected',
        headers: {
          Authorization: `Bearer ${this.authStore.token}`,
          'Content-Type': 'application/json'
        }
      })
        .then((response) => {
          this.hasFavorite = response.data.hasFavorite
        })
        .catch(function (e) {
          console.error(e)
        })
    },
    async toggleFavorite() {
      await axios({
        method: 'post',
        url: '/api/favorites/protected',
        params: {
          parkingLotId: this.lotInfo.lotId
        },
        headers: {
          Authorization: `Bearer ${this.authStore.token}`,
          'Content-Type': 'application/json'
        }
      })
        .then((response) => {
          this.hasFavorite = response.data.toggleResult
        })
        .catch(function (e) {
          console.error(e)
        })
    }
  },
  mounted() {
    if (this.lotInfo) {
      this.updateLotInfo(this.lotInfo)
    }

    const re = this.getHasFavorite()
    console.log(re)
  }
}
</script>

<style scoped>
@media (orientation: landscape) {
  .bottom-sheet {
    max-width: 800px;
  }
}

@media (orientation: portrait) {
  .bottom-sheet {
    width: 100%;
  }
}

.bottom::-webkit-scrollbar {
  display: none;
}

.bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60vh;
  background-color: white;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  z-index: 100;
  display: flex;
  flex-direction: column;
  margin: auto;
}

.sheet-header {
  padding: 10px;
  text-align: right;
  background-color: white;
  border-bottom: 1px solid #ddd;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.sheet-content {
  padding: 20px;
  overflow-y: auto;
  flex: 1; /* 남은 공간을 채우도록 설정 */
}

.sheet-footer {
  padding: 10px;
  background-color: white;
  border-top: 1px solid #ddd;
  position: sticky;
  bottom: 0;
  z-index: 10;
}

#to-detail {
  display: block;
  width: 100%;
  height: 40px;
  background-color: #9a64e8;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-enter,
.slide-up-leave-to {
  transform: translateY(100%);
}

.info-box {
  margin-bottom: 10px;
}

.lot-big {
  font-size: 20px;
  margin: 0;
}

.lot-standard {
  font-size: 17px;
}

.lot-small {
  font-size: 12px;
}

.lot-review {
  font-size: 17px;
  text-align: center;
  text-overflow: ellipsis;
}

.indent {
  margin-left: 1rem;
}

#recent-review {
  width: 100%;
  height: 30px;
  border-left: 2.5px solid #9a64e8;
  border-right: 2.5px solid #9a64e8;
}

#recent-review > p {
  padding-top: 3px;
}

p {
  margin: 0;
}

.info-box-flex {
  display: flex;
  justify-content: space-between;
  align-items: center; /* 세로 정렬을 중앙으로 */
  margin-bottom: 10px;
}

#name-address {
  width: auto; /* 가변 너비로 설정 */
  flex-grow: 1; /* 가능한 공간을 채움 */
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
