<!--
    담당자: 김경민
    시작 일자: 2024.09.03
    설명 : 주차장 예약 컴포넌트
    ---------------------
    2024.09.03 김경민 | 피그마를 확인 후 DatePicker
    2024.09.07 김경민 | 시간선택 및 전체적인 디자인
    2024.09.08 김경민 | 로그인 시 사용자의 등록된 차량과 주차장정보 불러오기

-->
<template>
  <div class="container">
    <!-- 전역으로 등록된 DatePicker 사용 -->
    <h3>{{ parkingLotInfo.name }}</h3>
    <!-- 각각 기능 설명-->
    <!-- 선택된 날짜를 selectedDate에 바인딩 -->
    <!-- 오늘 이후의 날짜만 선택 가능 -->
    <!-- 30일 후까지 선택 가능 -->
    <!-- 날짜 형식을 yyyy-MM-dd로 설정 -->
    <!-- 시간 선택 기능 비활성화 -->
    <div class="row">
      <div class="col-md-12">
        <!-- 차량 번호 선택 -->
        <select v-model="selectedCarNumber" class="form-control">
          <option disabled value="">차량 번호 선택</option>
          <option v-for="(carData, index) in userCars" :key="index" :value="carData.plateNumber">
            차량번호 - {{ carData.plateNumber }}
          </option>
        </select>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <DatePicker
          locale="ko"
          v-model="selectedDate"
          :min-date="today"
          :max-date="maxDate"
          :format="'yyyy-MM-dd'"
          :enable-time-picker="false">
        </DatePicker>
      </div>
    </div>
    <!-- 입차시간 -->
    <div class="time-picker-container mt-2">
      <div class="row g-0">
        <h6>입차시간</h6>
        <div class="col-12 col-md-12 text-center">
          <div class="time-picker-grid">
            <button
              v-for="hour in entranceAvailableHours"
              :key="hour"
              @click="selectEntranceHour(hour)"
              :class="['time-picker-btn', { 'selected': hour === selectedEntranceHour }]"
            >
              {{ hour }}
            </button>
          </div>
        </div>
      </div>
      <hr>
      <div class="row g-0">
        <div class="col-12 col-md-12">
          <div class="time-picker-grid text-center">
            <button
              v-for="minute in entranceAvailableMinutes"
              :key="minute"
              @click="selectEntranceMinute(minute)"
              :class="['time-picker-btn', { 'selected': minute === selectedEntranceMinute }]"
            >
              {{ minute < 10 ? '0' + minute : minute }}
            </button>
          </div>
        </div>
      </div>
      <!-- Confirm Button -->
      <div class="col-12 text-center mt-1">
        <button @click="confirmEntranceTime" class="btn confirm-btn">입력</button>
      </div>
    </div>

    <!-- 출차시간 -->
    <div class="time-picker-container mt-2">
      <div class="row g-0">
        <h6>출차시간</h6>
        <div class="col-12 col-md-12 text-center">
          <div class="time-picker-grid">
            <button
              v-for="hour in exitAvailableHours"
              :key="hour"
              @click="selectExitHour(hour)"
              :class="['time-picker-btn', { 'selected': hour === selectedExitHour }]"
            >
              {{ hour }}
            </button>
          </div>
        </div>
      </div>
      <hr>
      <div class="row g-0">
        <div class="col-12 col-md-12">
          <div class="time-picker-grid text-center">
            <!-- 출차 시간을 선택하는 버튼 -->
            <button
              v-for="minute in exitAvailableMinutes"
              :key="minute"
              @click="selectExitMinute(minute)"
              :class="['time-picker-btn', { 'selected': minute === selectedExitMinute }]"
            >
              {{ minute < 10 ? '0' + minute : minute }}
            </button>
          </div>
        </div>
      </div>
      <!-- Confirm Button -->
      <div class="col-12 text-center mt-1">
        <button @click="confirmExitTime" class="btn confirm-btn">입력</button>
      </div>
    </div>

    <div class="row">
      <div class="col-md-3">
        <label>입차일자</label>
        <Strong>{{ formattedSelectedDate }}</Strong>
      </div>
      <div class="col-md-3">
        <label>총 주차시간</label>
        <Strong>{{ totalTime }}</Strong>
      </div>
      <div class="col-md-3">
        <label>입차시간</label>
        <Strong>{{ selectedEntranceTime }}</Strong>
      </div>
      <div class="col-md-3">
        <label>출차시간</label>
        <Strong>{{ selectedExitTime }}</Strong>
      </div>

    </div>

    <div class="row">
      <!-- 부가서비스 선택 -->
      <div class="col-md-6">
        <label>부가서비스</label>
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="checkbox"
            id="wash"
            v-model="parkingLotInfo.wash"
            :disabled="parkingLotInfo.wash !== 'Y'" />
          <label class="form-check-label" for="wash">세차</label>
        </div>
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="checkbox"
            id="maintenance"
            v-model="parkingLotInfo.maintenance"
            :disabled="parkingLotInfo.maintenance !== 'Y'" />
          <label class="form-check-label" for="maintenance">기본차량정비</label>
        </div>
      </div>
    </div>


    <br>
    <label>가격</label>

    <button class="btn btn-primary" :disabled="totalReservationTime <= 0" @click="submitReservation">
      예약하기
    </button>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  data() {
    return {
      selectedCarNumber: '',  // 선택된 차량 번호
      userCars: [],  // 차량 번호 옵션들
      parkingLotInfo: {
        name: '',
        wash: '',  // 세차 여부
        maintenance: '',  // 기본차량정비 여부
        weekdaysOpenTime :'',
        weekendOpenTime : '',
        weekdaysCloseTime : '',
        weekendCloseTime : '',
      },
      today: new Date(),
      maxDate: new Date(new Date().setDate(new Date().getDate() + 30)), // 30일 후까지 선택 가능
      selectedDate: null,

      entanceDateTime: '',
      extitDateTime: '',
      selectedEntranceTime: '',
      selectedExitTime: '',
      totalTime: '00:00',

      // 입차 시간 관련 데이터
      entranceBusinessStartTime: 14, // 영업 시작 시간 (14시)
      entranceBusinessEndTime: 22, // 영업 종료 시간 (22시)
      entranceAvailableHours: [], // 입차 가능한 시간 배열
      entranceAvailableMinutes: [0, 30], // 입차 가능한 분 배열
      selectedEntranceHour: null,
      selectedEntranceMinute: null,

      // 출차 시간 관련 데이터
      exitBusinessStartTime: 14, // 영업 시작 시간 (14시)
      exitBusinessEndTime: 22, // 영업 종료 시간 (22시)
      exitAvailableHours: [], // 출차 가능한 시간 배열
      exitAvailableMinutes: [0, 30], // 출차 가능한 분 배열
      selectedExitHour: null,
      selectedExitMinute: null,
      totalReservationTime: 0,

      options: [1, 2, 3], // 선택 박스에 표시될 옵션들
      selectedOption: null
    }
  },
  created() {
    this.generateEntranceAvailableHours()
    this.generateExitAvailableHours()
  },
  mounted() {
    this.getReservationLotData()
  },
  methods: {
    //axios를 통한 데이터 가져오기
    async getReservationLotData() {
      try {
        //const responseReservationLotData = await axios.get('http://localhost:8080/api/parkingLots/{parkingLotId}/reservation',{
        const responseReservationLotData = await axios.get('http://localhost:8080/api/parkingLots/reservation', {
          params: {
            // 실제로 할 떄 변경해야함.
            parkingLotId: 1, //this.$route.params.parkingLotId;
            userEmail: 'test@test.com' //이건 물어보기!!
          }
        })
        this.parkingLotInfo = responseReservationLotData.data.parkingLotInfo;
        this.userCars = responseReservationLotData.data.userCars;
      } catch (error) {
        console.log()
      } finally {
        console.log('')
      }
    },


    // 입차 가능한 시간 생성
    generateEntranceAvailableHours() {
      this.entranceAvailableHours = Array.from(
        { length: this.entranceBusinessEndTime - this.entranceBusinessStartTime + 1 },
        (_, i) => (this.entranceBusinessStartTime + i).toString().padStart(2, '0')
      );
    },
    // 출차 가능한 시간 생성
    generateExitAvailableHours() {
      this.exitAvailableHours = Array.from(
        { length: this.exitBusinessEndTime - this.exitBusinessStartTime + 1 },
        (_, i) => (this.exitBusinessStartTime + i).toString().padStart(2, '0')
      );
    },
    selectEntranceHour(hour) {
      this.selectedEntranceHour = hour;
    },
    selectEntranceMinute(minute) {
      this.selectedEntranceMinute = minute;
    },

    confirmEntranceTime() {
      // selectedEntranceHour, selectedEntranceMinute, entranceDate가 null이 아닌지 확인
      if (this.selectedEntranceHour !== null && this.selectedEntranceMinute !== null && this.selectedDate !== null) {
        // 선택한 날짜와 시간을 합쳐서 Date 객체로 변환
        const selectedEntranceDate = new Date(this.selectedDate);
        selectedEntranceDate.setHours(parseInt(this.selectedEntranceHour), parseInt(this.selectedEntranceMinute), 0, 0);

        // 유효한 Date 객체인지 확인
        if (isNaN(selectedEntranceDate.getTime())) {
          alert('유효하지 않은 날짜입니다.');
          return;
        }

        // 출차 시간과 비교
        if (this.selectedExitHour !== null && this.selectedExitMinute !== null && this.exitDate !== null) {
          const selectedExitDate = new Date(this.exitDate);
          selectedExitDate.setHours(parseInt(this.selectedExitHour), parseInt(this.selectedExitMinute), 0, 0);

          if (selectedEntranceDate >= selectedExitDate) {
            alert('입차 시간이 출차 시간보다 늦을 수 없습니다.');
            return;
          }
        }

        // 현재 시간과 비교
        const now = new Date();
        if (selectedEntranceDate <= now) {
          alert('입차 시간이 현재 시간보다 빠를 수 없습니다.');
          return;
        }

        // 정상적으로 선택된 시간을 저장하고, entranceDateTimeResult 생성
        const formattedDate = selectedEntranceDate.toISOString().split('T')[0]; // 'yyyy-MM-dd' 형식으로 변환
        const formattedTime = `${this.selectedEntranceHour.toString().padStart(2, '0')}:${this.selectedEntranceMinute.toString().padStart(2, '0')}`; // 'HH:mm' 형식으로 변환
        this.entranceDateTimeResult = `${formattedDate} ${formattedTime}`; // 날짜와 시간을 결합하여 'yyyy-MM-dd HH:mm' 형식으로 저장
        this.selectedEntranceTime = `${formattedTime}`;
        alert(`입차 시간이 성공적으로 설정되었습니다: ${this.entranceDateTimeResult}`);
      } else {
        alert('입차 시간 및 날짜를 모두 선택해 주세요.');
      }
    },

    selectExitHour(hour) {
      this.selectedExitHour = hour;
    },
    selectExitMinute(minute) {
      this.selectedExitMinute = minute;
    },
    confirmExitTime() {
      if (this.selectedExitHour !== null && this.selectedExitMinute !== null && this.selectedEntranceHour !== null && this.selectedEntranceMinute !== null && this.selectedDate !== null) {
        // 선택한 입차 및 출차 날짜와 시간을 결합
        const selectedEntranceDate = new Date(this.selectedDate);
        selectedEntranceDate.setHours(parseInt(this.selectedEntranceHour), parseInt(this.selectedEntranceMinute), 0, 0);

        const selectedExitDate = new Date(this.selectedDate);
        selectedExitDate.setHours(parseInt(this.selectedExitHour), parseInt(this.selectedExitMinute), 0, 0);

        // 입차 시간이 출차 시간보다 빠르면 경고
        if (selectedExitDate <= selectedEntranceDate) {
          alert('출차 시간이 입차 시간보다 빠를 수 없습니다.');
          this.selectedExitHour = null;
          this.selectedExitMinute = null;
          this.selectedExitTime = '';  // 초기화
        } else {
          // 정상적으로 선택된 시간을 저장
          const formattedExitTime = `${this.selectedExitHour.toString().padStart(2, '0')}:${this.selectedExitMinute.toString().padStart(2, '0')}`; // 'HH:mm' 형식으로 변환
          this.selectedExitTime = formattedExitTime;
          this.exitDateTimeResult = `${this.selectedDate.toISOString().split('T')[0]} ${formattedExitTime}`; // 'yyyy-MM-dd HH:mm' 형식으로 저장
          alert(`출차 시간이 성공적으로 설정되었습니다: ${this.exitDateTimeResult}`);
        }
      } else {
        alert('입차 시간 및 출차 시간을 모두 선택해 주세요.');
      }
    },
    calculateTotalTime() {
      if (this.selectedEntranceTime && this.selectedExitTime) {
        // 시간 문자열을 분리하여 시간과 분으로 나눔
        const [entranceHour, entranceMinute] = this.selectedEntranceTime.split(':').map(Number);
        const [exitHour, exitMinute] = this.selectedExitTime.split(':').map(Number);

        // Date 객체를 사용하여 시간 차이 계산
        const entranceDateTime = new Date();
        entranceDateTime.setHours(entranceHour, entranceMinute, 0, 0);
        const exitDateTime = new Date();
        exitDateTime.setHours(exitHour, exitMinute, 0, 0);

        // 시간 차이를 밀리초로 계산
        const diffInMs = exitDateTime - entranceDateTime;

        // 입차 시간이 출차 시간보다 빠를 경우 경고
        if (diffInMs <= 0) {
          alert('출차 시간이 입차 시간보다 빠를 수 없습니다.');
          this.totalTime = '00:00'; // 기본값
          return;
        }

        // 시간 차 계산
        const diffInMinutes = Math.floor(diffInMs / 1000 / 60);
        const hours = Math.floor(diffInMinutes / 60);
        const minutes = diffInMinutes % 60;

        // 최종 주차 시간 출력
        this.totalTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      } else {
        this.totalTime = '00:00'; // 기본값
      }
    }
  },
  watch: {
    //날짜 선택에 따른
    selectedEntranceTime() {
      this.calculateTotalTime()
    },
    selectedExitTime() {
      this.calculateTotalTime()
    }
  },
  computed: {
    // 선택된 날짜를 형식에 맞게 변환하는 computed 속성
    formattedSelectedDate() {
      return this.selectedDate
        ? this.selectedDate.toISOString().split('T')[0]
        : ''
    }
  }
}
</script>
<style scoped>

.time-picker-btn {
  width: 20px;
  height: 20px;
  margin-bottom: 6px;
  margin-left: 6%;
  margin-right: 6%;
  border-radius: 50%;
  border: 1px solid hsl(265, 74%, 65%);
  background-color: white;
  color: #9A64E8;
  font-size: 11px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s, color 0.3s, box-shadow 0.3s;
}

.time-picker-btn.selected {
  background-color: #9A64E8;
  color: white;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
}

.confirm-btn {
  background-color: #28a745;
  color: white;
  padding: 3px 20px;
  border-radius: 50px;
  font-size: 12px;
  border: none;
  transition: background-color 0.3s;
}

.confirm-btn:hover {
  background-color: #218838;
}

.time-picker-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr); /* 한 줄에 6개씩 */
  gap: 5px; /* 버튼 사이 간격 */
  justify-items: center;
}

.time-picker-container {
  border: 2px solid #be96ff; /* 테두리 색상 */
  border-radius: 15px; /* 둥근 모서리 */
  padding: 10px; /* 내부 여백 */
  margin-top: 10px; /* 위쪽 여백 */
  background-color: white; /* 배경색 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* 그림자 */
  margin-left: 10px;
  margin-right: 10px;
}

/* DatePicker 버튼을 보라색으로 스타일링 */
.datepicker-btn {
  background-color: #9A64E8 !important; /* 보라색 배경 */
  color: white !important; /* 글자색을 흰색으로 변경 */
  border-radius: 4px; /* 둥근 모서리 */
  border: none; /* 테두리 제거 */
  padding: 10px 20px; /* 버튼 패딩 조정 */
}

.datepicker-btn:hover {
  background-color: #7a52b6 !important; /* hover 시 더 어두운 보라색 */
}

.datepicker-btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(154, 100, 232, 0.5); /* focus 시 보라색 그림자 */
}

.form-check-input {
  margin-right: 5px;
}

.form-check-label {
  margin-right: 20px;
}
</style>