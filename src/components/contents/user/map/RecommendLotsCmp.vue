<template>
  <div>
    <h3>주차 추천</h3>
    <div>
      <div>
        <label>주차 예정 일자</label>
        <DatePicker
          locale="ko"
          v-model="selectedDate"
          :min-date="today"
          :max-date="maxDate"
          :enable-time-picker="false"
          :format="'yyyy-MM-dd'"
        >
        </DatePicker>
      </div>
      <div v-if="selectedDate">
        <label>입차 예정 시간</label>
        <DatePicker
          v-model="selectedStartTime"
          time-picker
          ref="startTime"
          :is-24="false"
          :minutes-increment="30"
          :minutes-grid-increment="30"
          :start-time="startTime"
        >
        </DatePicker>
      </div>
      <div v-if="selectedStartTime">
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
        >
        </DatePicker>
      </div>
      <div>
        <label>차량 종류</label><br />
        <select v-model="selectedCarTypeId">
          <option v-for="(carType, index) in selectableCarTypes" :key="index" :value="carType.id">
            {{ carType.carTypeKor }}
          </option>
        </select>
      </div>
      <div>
        <label>검색 범위</label>
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
    <button @click="getRecommends">조회</button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: ['visible', 'location'],
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
      selectedMaxDistance: null
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
      console.log('=============================')
      console.log('위도 ' + this.centerPosition.latitude)
      console.log('경도 ' + this.centerPosition.longitude)
      console.log('거라' + this.selectedMaxDistance)
      console.log('차량 id' + this.selectedCarTypeId)
      console.log('시작 시간' + this.formatDate(this.selectedDate, this.selectedStartTime))
      console.log('종료 시간' + this.selectedEndTime)
      console.log('날짜' + this.selectedDate)
      console.log('=============================')

      axios({
        method: 'get',
        url: '/api/parkinglots/recommend',
        params: {
          longitude: this.centerPosition.longitude,
          latitude: this.centerPosition.latitude,
          // maxDistance: this.selectedMaxDistance,
          maxDistance: 10000,
          startDateTime: this.formatDate(this.selectedDate, this.selectedStartTime),
          endDateTime: this.formatDate(this.selectedDate, this.selectedEndTime),
          carTypeId: this.selectedCarTypeId
        }
      })
        .then((response) => {
          console.log(response.data)
        })
        .catch(function (e) {
          console.error(e)
        })
    },
    async getSelectableCarTypes() {
      await axios({
        method: 'get',
        url: '/api/car-type'
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
    }
  }
}
</script>

<style scoped>
#wrapper {
  background-color: #c77476;
}

.range-btn input[type='radio'] {
  display: none;
}

.range-btn input[type='radio'] + span {
  display: inline-block;
  padding: 15px 10px;
  border: 1px solid #dfdfdf;
  background-color: #ffffff;
  text-align: center;
  cursor: pointer;
}

.range-btn input[type='radio']:checked + span {
  background-color: #113a6b;
  color: #ffffff;
}

/* @media (orientation: landscape) {
  #wrapper {
    max-width: 800px;
  }
}

@media (orientation: portrait) {
  #wrapper {
    width: 100%;
  }
} */

.bottom-sheet {
  position: fixed;
  bottom: -100%; /* 기본적으로 화면 아래 숨겨져 있음 */
  left: 0;
  width: 100%;
  height: 40%;
  background-color: white;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 0px -5px 15px rgba(0, 0, 0, 0.3);
  transition: bottom 0.3s ease-in-out;
  z-index: 1000;
}

.bottom-sheet.show {
  bottom: 0; /* visible 상태일 때 화면 위로 슬라이딩 */
}

.bottom-sheet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #f0f0f0;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}

.bottom-sheet-content {
  padding: 15px;
}

.close-btn {
  background-color: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}
</style>
