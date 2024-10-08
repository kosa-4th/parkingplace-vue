<!--
 담당자: 양건모
 시작 일자: 2024.09.23
 설명 : 주차장 추천 컴포넌트
 ---------------------
 2024.09.24 양건모 | 기능 구현
 2024.09.25 양건모 | 디자인 수정
 -->
<template>
  <div id="wrapper">
    <div id="modal" :class="{ 'slide-up': isModalVisible, 'slide-down': !isModalVisible }">
      <div class="close">
        <button @click="closeModal">
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
        </button>
      </div>
      <div id="modal-content" :class="{ 'input-screen': !recommends, 'result-screen': recommends }">
        <div v-if="recommends">
          <div class="modal-header">추천 주차장</div>
          <div
            v-for="(parkingLot, index) in recommends"
            :key="index"
            @click="toDetail(parkingLot.parkingLotId)"
            class="parking-lot"
          >
            <div class="parking-lot-name">
              <b>{{ parkingLot.parkingLotName }}</b>
            </div>
            <div>
              {{ parkingLot.address }}
            </div>
            <div>
              {{
                parkingLot.distance < 1000
                  ? parkingLot.distance + 'm'
                  : convertToKm(parkingLot.distance)
              }}
            </div>
            <div>{{ parkingLot.price }}원</div>
          </div>
        </div>
        <div v-else>
          <div>
            <div class="field">
              <label>주차 예정 일자</label>
              <DatePicker
                locale="ko"
                v-model="selectedDate"
                :min-date="today"
                :max-date="maxDate"
                :enable-time-picker="false"
                teleport-center
                :format="'yyyy-MM-dd'"
              >
              </DatePicker>
            </div>
            <div v-if="selectedDate" class="field">
              <label>입차 예정 시간</label>
              <DatePicker
                v-model="selectedStartTime"
                time-picker
                ref="startTime"
                :is-24="false"
                :minutes-increment="30"
                :minutes-grid-increment="30"
                :start-time="startTime"
                teleport-center
                class="date-picker"
              >
              </DatePicker>
            </div>
            <div v-if="selectedStartTime" class="field">
              <label>출차 예정 시간</label>
              <DatePicker
                v-model="selectedEndTime"
                time-picker
                ref="endTime"
                :is-24="false"
                :minutes-increment="30"
                :minutes-grid-increment="30"
                :start-time="startTime"
                @update:model-value="handleDate()"
                teleport-center
                class="date-picker"
              >
              </DatePicker>
            </div>
            <div class="field">
              <label>차량 종류</label><br />
              <select v-model="selectedCarTypeId">
                <option
                  v-for="(carType, index) in selectableCarTypes"
                  :key="index"
                  :value="carType.id"
                >
                  {{ carType.carTypeKor }}
                </option>
              </select>
            </div>
            <div class="field">
              <label>최대 거리</label>
              <fieldset>
                <label class="range-btn">
                  <input type="radio" name="range" value="100" v-model="selectedMaxDistance" />
                  <span>100m</span>
                </label>
                <label class="range-btn">
                  <input type="radio" name="range" value="250" v-model="selectedMaxDistance" />
                  <span>250m</span>
                </label>
                <label class="range-btn">
                  <input type="radio" name="range" value="500" v-model="selectedMaxDistance" />
                  <span>500m</span>
                </label>
                <label class="range-btn">
                  <input type="radio" name="range" value="1000" v-model="selectedMaxDistance" />
                  <span>1km</span>
                </label>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
      <div id="modal-submit" v-if="!recommends">
        <div class="field">
          <button @click="getRecommends" class="recomm-search-btn mt-20">추천 주차장 조회</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {router} from '@/router'
import axios from 'axios'

export default {
  props: ['location'],
  data() {
    return {
      selectableCarTypes: [],
      startTime: { hours: new Date().getHours(), minutes: 0 },
      today: new Date(),
      maxDate: new Date().setMonth(new Date().getMonth() + 1),
      centerPosition: {
        longitude: this.location.longitude,
        latitude: this.location.latitude
      },
      selectedDate: null,
      selectedStartTime: null,
      selectedEndTime: null,
      selectedCarTypeId: null,
      selectedMaxDistance: null,
      recommends: null,
      isModalVisible: true
    }
  },
  mounted() {
    this.getSelectableCarTypes()
  },
  methods: {
    handleDate() {
      if (!this.selectedDate && (this.selectedStartTime || this.selectedEndTime)) {
        alert('주차 에정일을 먼저 선택해주세요.')
        this.$refs.startTime.clearValue()
        this.$refs.Time.clearValue()
      }

      if (!this.selectedStartTime && this.selectedEndTime) {
        alert('입차 예정 시간을 먼저 선택해주세요.')
        this.$refs.endTime.clearValue()
      }

      if (
        this.selectedStartTime.hous > this.selectedEndTime.hours ||
        (this.selectedStartTime.hours === this.selectedEndTime.hours &&
          this.selectedStartTime.minutes >= this.selectedEndTime.minutes)
      ) {
        alert('출차 시간이 입차 시간보다 앞서거나 같을 수 없습니다.')
        this.$refs.endTime.clearValue()
      }
    },
    getRecommends() {
      //콘솔 로그
      console.log('=============================')
      console.log('위도 ' + this.centerPosition.latitude)
      console.log('경도 ' + this.centerPosition.longitude)
      console.log('거라' + this.selectedMaxDistance)
      console.log('차량 id' + this.selectedCarTypeId)
      console.log('시작 시간' + this.formatDate(this.selectedDate, this.selectedStartTime))
      console.log('종료 시간' + this.selectedEndTime)
      console.log('날짜' + this.selectedDate)
      console.log('=============================')

      const startDateTime = this.formatDate(this.selectedDate, this.selectedStartTime)
      const endDateTime = this.formatDate(this.selectedDate, this.selectedEndTime)

      const validationError = this.getValidationError()
      if (validationError) {
        alert(validationError)
        return
      }

      axios({
        method: 'get',
        url: `${import.meta.env.VITE_API_URL}/api/parkinglots/recommend`,
        params: {
          longitude: this.centerPosition.longitude,
          latitude: this.centerPosition.latitude,
          maxDistance: this.selectedMaxDistance,
          startDateTime: startDateTime,
          endDateTime: endDateTime,
          carTypeId: this.selectedCarTypeId
        }
      })
        .then((response) => {
          this.recommends = response.data.parkingLots
          console.log(this.recommends)
        })
        .catch(function (e) {
          console.error(e)
        })
    },
    async getSelectableCarTypes() {
      await axios({
        method: 'get',
        url: `${import.meta.env.VITE_API_URL}/api/car-type`
      })
        .then((response) => {
          this.selectableCarTypes = response.data.carTypes
          this.selectedCarTypeId = this.selectableCarTypes[0].id
        })
        .catch(function (e) {
          alert(e)
        })
    },
    formatDate(dateString, timeObject) {
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = ('0' + (date.getMonth() + 1)).slice(-2)
      const day = ('0' + date.getDate()).slice(-2)

      // 시간, 분, 초가 한 자리 수일 경우 두 자리로 변환
      const hours = ('0' + timeObject.hours).slice(-2)
      const minutes = ('0' + timeObject.minutes).slice(-2)
      const seconds = ('0' + timeObject.seconds).slice(-2)

      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
    },
    getValidationError() {
      // 필수 값 검증
      if (!this.selectedDate) {
        return '주차 예정일자를 선택해주세요.'
      }

      if (!this.selectedStartTime) {
        return '입차 예정 시간을 선택해주세요.'
      }

      if (!this.selectedEndTime) {
        return '출차 예정 시간을 선택해주세요.'
      }

      if (!this.selectedCarTypeId) {
        return '차량 종류를 선택해주세요.'
      }

      if (!this.selectedMaxDistance) {
        return '최대 거리를 선택해주세요.'
      }

      return null
    },
    convertToKm(distance) {
      const km = Math.floor(distance / 1000)
      const meters = Math.floor((distance % 1000) / 100)
      return km + '.' + meters + 'km'
    },
    closeModal() {
      this.isModalVisible = false
      setTimeout(() => {
        this.$el.querySelector('#modal').style.display = 'none'
        this.$emit('close-modal')
      }, 500)
    },
    toDetail(parkingLotId) {
      router.push(`/lot/${parkingLotId}`)
    }
  }
}
</script>

<style scoped>
#wrapeer {
  position: relative;
}

#modal {
  padding: 10px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  background-color: white;
  position: absolute;
  height: 55vh;
  z-index: 300;
  bottom: 0;
  animation: slideUp 0.08s ease-out;
  transition: transform 0.08s ease-out;
  -ms-overflow-style: none;
  scrollbar-width: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

#modal-content {
  overflow: scroll;
}

.input-screen {
  height: calc(50vh - 40px - 30px);
}

.result-screen {
  height: calc(55vh - 45px);
}

#modal-submit {
  height: 40px;
}

#modal::-webkit-scrollbar {
  display: none;
}

.slide-down {
  transform: translateY(100%);
}

.range-btn {
  width: 25%;
}

.range-btn input[type='radio'] {
  display: none;
  width: 25%;
}

.range-btn input[type='radio'] + span {
  display: block;
  padding: 15px 10px;
  border: 1px solid #dfdfdf;
  background-color: #ffffff;
  text-align: center;
  cursor: pointer;
}

.range-btn input[type='radio']:checked + span {
  background-color: #9a64e8;
  color: #ffffff;
}

@media (orientation: landscape) {
  #modal {
    width: 800px;
    transform: translateX(25%);
  }

  @keyframes slideUp {
    from {
      transform: translateX(25%) translateY(100%); /* 화면 아래에서 시작 */
    }
    to {
      transform: translateX(25%) translateY(0); /* 제자리로 이동 */
    }
  }
}

@media (orientation: portrait) {
  #modal {
    width: 100%;
  }

  @keyframes slideUp {
    from {
      transform: translateY(100%); /* 화면 아래에서 시작 */
    }
    to {
      transform: translateY(0); /* 제자리로 이동 */
    }
  }
}

button {
  border: none;
  background-color: transparent;
}

.close {
  text-align: right;
}

select {
  display: block;
  width: 100%;
  padding: 5px;
  border: 0.5px solid #dddddd;
  border-radius: 3px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  margin: auto;
  background-color: white;
}

.recomm-search-btn {
  display: block;
  width: 100%;
  height: 40px;
  background-color: #9a64e8;
  color: white;
  border-radius: 5px;
  font-weight: 400;
  font-size: 17px;
  padding-top: 2px;
}

.mt-20 {
  margin-top: 20px;
}

.field {
  margin-top: 7px;
}

.parking-lot {
  padding: 5px;
  width: 100%;
  border: 1px solid #9a64e8;
  border-radius: 5px;
  margin-top: 5px;
}

.modal-header {
  display: block;
  font-size: 19px;
  font-weight: 600;
  text-align: left;
  color: #9a64e8;
  padding-left: 10px;
  margin-left: 5px;
  margin-bottom: 10px;
  border-left: 5px solid #9a64e8;
}

.parking-lot-name {
  background-color: #f1ebfc;
  border-radius: 5px;
  padding: 5px;
}
</style>
