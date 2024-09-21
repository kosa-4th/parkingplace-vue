<template>
  <div></div>
  <!-- <div class="date-picker-container"> -->
    <!-- 첫 번째 Datepicker (시작 날짜 선택) -->
    <!-- <div class="date-picker-box">
      <Datepicker
        class="date-picker"
        v-model="selectedStartDate"
        :locale="locale"
        :format="formatDate"
        :upperLimit="to"
        :lowerLimit="from"
        :clearable="true"
        :enable-time-picker="false"
        :max-date="selectedEndDate"
      /> -->

      <!-- 두 번째 Datepicker (종료 날짜 선택) -->
      <!-- <Datepicker
        class="date-picker"
        v-model="selectedEndDate"
        :format="formatDate"
        :locale="locale"
        :upperLimit="to"
        :lowerLimit="selectedStartDate"
        :clearable="true"
        :enable-time-picker="false"
        :min-date="selectedStartDate"
      />
    </div> -->

    <!-- 전체 보기 버튼  -->
    <!-- <div class="view-all-btn-box">
      <button class="view-all-btn" @click="viewAllInquiries">전체 보기</button>
    </div> -->

    <!-- 문의 내역 (날짜 범위에 해당하는 내역만 필터링) -->
    <!-- <div class="inquiry-container">
      <div class="inquiry-box" v-for="inquiry in filteredInquiries" :key="inquiry.id"> -->
        <!-- 문의 내용 출력 -->
        <!-- <p class="inquiry-question"><strong>Q:</strong> {{ inquiry.question }}</p>
        <p class="inquiry-answer"><strong>A:</strong> {{ inquiry.answer }}</p>
        <p class="inquiry-date">{{ inquiry.date }}</p>
      </div> -->
      <!-- 문의 내역이 없을 때 출력 -->
      <!-- <p v-if="filteredInquiries.length === 0">해당 날짜 범위 내에 문의가 없습니다.</p>
    </div>
  </div> -->
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
// import Datepicker from '@vuepic/vue-datepicker';
// import '@vuepic/vue-datepicker/dist/main.css';

const page = ref(0);
const size = 10;
const from = ref(null);
const to = ref(null);

// const reviews = ref([]);

//리뷰 가져오기
const getParkingReviews = async () => {
  try {
    const response = await axios.get("/api/parking-manager/reviews/protected",
      {
        params: {
          page: page.value,
          size: size,
          parkinglotId: 1,
          from: from.value,
          to: to.value,
        }
      }
    );
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
}

onMounted(() => {
  getParkingReviews();
})
</script>

<style scoped>
/* Datepicker를 감싸는 컨테이너 스타일 */
.date-picker-container {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Datepicker 박스 스타일 */
.date-picker-box {
  width: 800px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 각 Datepicker의 너비 설정 */
.date-picker {
  width: 40%;
}

/* 전체 보기 버튼 스타일 */

.view-all-btn-box {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  /* background-color: red; */
}
.view-all-btn {
  margin-top: 20px; /* 버튼을 Datepicker 아래로 이동시키기 위한 여백 */
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

/* 전체 보기 버튼 호버 시 배경색 변경 */
.view-all-btn:hover {
  background-color: #0056b3;
}

/* 문의 내역을 표시하는 컨테이너 스타일 */
.inquiry-container {
  margin-top: 20px;
  width: 800px;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
}

/* 각 문의를 감싸는 박스 스타일 */
.inquiry-box {
  margin-bottom: 20px;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

/* 문의 질문 부분 스타일 */
.inquiry-question {
  font-weight: bold;
}

/* 문의 답변 부분 스타일 */
.inquiry-answer {
  color: #333;
}

/* 문의 날짜 부분 스타일 */
.inquiry-date {
  font-size: 0.9em;
  color: #888;
}
</style>
