<template>
  <transition name="slide-up">
    <div v-if="visible" class="bottom-sheet">
      <div class="sheet-header">
        <span @click="hide">닫기</span>
      </div>
      <div class="sheet-content">
        <div class="info-box">
          <h2 class="lot-big">{{ currentLotInfo.name }}</h2>
          <p class="lot-standard">{{ currentLotInfo.address }}</p>
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
        <div class="info-box">
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
      <!-- 상세보기 버튼을 하단에 고정 -->
      <div class="sheet-footer">
        <button id="to-detail" @click="toDetail">상세보기</button>
      </div>
    </div>
  </transition>
</template>

<script>
import axios from 'axios'
import router from '@/router'

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
      currentLotInfo: {} // 현재 표시할 주차장 정보
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
          console.log(this.currentLotInfo)
        })
        .catch(function (e) {
          console.error(e)
        })
    },
    toDetail() {
      router.push(`/lot/${this.lotInfo.lotId}`)
    }
  },
  mounted() {
    if (this.lotInfo) {
      this.updateLotInfo(this.lotInfo)
    }
  }
}
</script>

<style scoped>
.bottom::-webkit-scrollbar {
  display: none;
}

.bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60dvh;
  background-color: white;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  z-index: 100;
  display: flex;
  flex-direction: column; /* flexbox로 구성하여 콘텐츠 영역을 배치 */
}

.sheet-header {
  padding: 10px;
  text-align: right;
  background-color: white;
  border-bottom: 1px solid #ddd;
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
  font-size: 18px;
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
  border-left: 5px solid #9a64e8;
  border-right: 5px solid #9a64e8;
}

p {
  margin: 0;
}
</style>
