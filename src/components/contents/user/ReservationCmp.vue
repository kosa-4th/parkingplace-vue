<!--
    담당자: 김경민
    시작 일자: 2024.09.03
    설명 : 주차장 예약 컴포넌트
    ---------------------
    2024.09.03 김경민 | 피그마를 확인 후 DatePicker / TimePicker를 활용한 예약 시스템 앞단 만만들기
-->
<template>
  <div>
    <!-- 전역으로 등록된 DatePicker 사용 -->
    <!-- 전역으로 등록된 TimePicker 사용 -->
    <!-- 각각 기능 설명-->
    <!-- 선택된 날짜를 selectedDate에 바인딩 -->
    <!-- 오늘 이후의 날짜만 선택 가능 -->
    <!-- 30일 후까지 선택 가능 -->
    <!-- 날짜 형식을 yyyy-MM-dd로 설정 -->
    <!-- 시간 선택 기능 비활성화 -->
    <DatePicker
      locale="ko"
      v-model="entranceDate"
      :min-date="today"
      :max-date="maxDate"
      :format="'yyyy-MM-dd'"
      :enable-time-picker="false"
    >
    </DatePicker>
    <TimePicker v-model="entranceTime" format="HH:mm"
                :minute-interval="30" />

    <p>입차 날짜 및 시간: {{ entranceDateTime }} </p>

    <DatePicker
      locale="ko"
      v-model="exitDate"
      :min-date="today"
      :max-date="maxDate"
      :format="'yyyy-MM-dd'"
      :enable-time-picker="false"
    ></DatePicker>
    <TimePicker v-model="exitTime" format="HH:mm"
                :minute-interval="30" />
    <p>출차 날짜 및 시간:{{ exitDateTime }} </p>

    <p>총 예약 시간 : {{ totalReservationTime }}</p>

    <label>차량번호</label>
    <select v-model="selectedOption">
      <option v-for="option in options" :key="option" :value="option">
        {{ option }}
      </option>
    </select>

    <label>부가서비스</label>
    <label v-for="option in options" :key="option.value">
      <input type="checkbox" :value="option.value" v-model="selectedOption" />
      {{ option.label }}
    </label>

    <br>
    <label>가격</label>


    <p>Selected Option: {{ selectedOption }}</p>

    <button class="btn btn-primary" :disabled="totalReservationTime <= 0" @click="submitReservation">
      예약하기
    </button>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue'

export default {
  setup() {
    // 현재 날짜 가져오기
    const today = new Date()

    // select 박스에 표시될 옵션들
    const options = ref([1, 2, 3])

    // 선택된 값을 저장할 변수
    const selectedOption = ref(null)

    // 오늘 날짜로부터 30일 후의 날짜 계산
    const maxDate = new Date()
    maxDate.setDate(today.getDate() + 30)

    // 가장 가까운 30분과 1시간으로 시간 설정하는 함수
    function roundToNearestMinutes(date, minutes) {
      const ms = 1000 * 60 * minutes
      return new Date(Math.ceil(date.getTime() / ms) * ms)
    }

    const now = new Date()

    // entranceTime: 현재 시간에 가장 가까운 30분으로 설정
    const entranceTimeDate = roundToNearestMinutes(now, 30)
    const entranceTime = ref(entranceTimeDate.toTimeString().substring(0, 5)) // "HH:mm" 형식으로 포맷

    // exitTime: 현재 시간에 가장 가까운 1시간으로 설정
    const exitTimeDate = roundToNearestMinutes(now, 60)
    const exitTime = ref(exitTimeDate.toTimeString().substring(0, 5)) // "HH:mm" 형식으로 포맷

    // 날짜와 시간을 ref로 초기화
    const entranceDate = ref(today)
    const exitDate = ref(today)

    // formattedeEntranceDate와 entranceTime을 조합하여 하나의 DateTime 문자열 생성
    const entranceDateTime = computed(() => {
      const date = entranceDate.value.toISOString().split('T')[0] // yyyy-MM-dd 형식의 날짜
      return `${date} ${entranceTime.value}` // yyyy-MM-dd HH:mm 형식으로 결합
    })

    // formattedeExitDate와 exitTime을 조합하여 하나의 DateTime 문자열 생성
    const exitDateTime = computed(() => {
      const date = exitDate.value.toISOString().split('T')[0] // yyyy-MM-dd 형식의 날짜
      return `${date} ${exitTime.value}` // yyyy-MM-dd HH:mm 형식으로 결합
    })

    const totalReservationTime = ref(0)

    // 두 날짜를 비교하고 exitDateTime이 entranceDateTime보다 이른 경우 경고
    watch([entranceDateTime, exitDateTime], ([newEntranceDateTime, newExitDateTime]) => {
      const now = new Date()
      if (new Date(newEntranceDateTime) < now) {
        totalReservationTime.value = 0
        alert('입장 시간이 현재 시점보다 이전입니다.')
      } else if (new Date(newExitDateTime) < now) {
        totalReservationTime.value = 0
        alert('퇴장 시간이 현재 시점보다 이전입니다.')
      } else if (newExitDateTime <= newEntranceDateTime) {
        totalReservationTime.value = 0
        alert('퇴장 시간이 입장 시간보다 이른 시간입니다. 다시 입력해주세요.')
      } else {
        const diffInMinutes = (new Date(newExitDateTime) - new Date(newEntranceDateTime)) / 1000 / 60
        const hours = Math.floor(diffInMinutes / 60)
        const minutes = diffInMinutes % 60
        totalReservationTime.value = `${hours}시간 ${minutes}분`
      }
    })

    // 반환할 데이터
    return {
      today,
      maxDate,
      entranceDate,
      exitDate,
      entranceTime,
      exitTime,
      entranceDateTime,
      exitDateTime,
      totalReservationTime,
      options,
      selectedOption
    }
  }
}
</script>

<style scoped>
.my-datepicker {
  border: 2px solid #2ecc71;
  border-radius: 10px;
  padding: 5px;
}

.my-timepicker {
  border: 2px solid #e74c3c;
  border-radius: 10px;
  padding: 5px;
}
</style>