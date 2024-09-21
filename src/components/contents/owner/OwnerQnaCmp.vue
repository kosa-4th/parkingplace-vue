<template>
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
  <div></div>
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

// const inquiries = ref([]);

// 문의 가져오기
const getParkingInquiries = async () => {
  try {
    const response = await axios.get("/api/parking-manager/inquiries/protected",
      {
        params: {
          page: page.value,
          size: size,
          parkinglotId: 1,
          from: from.value,
          to: to.value,
          actionType: 'All'
        }
      }
    );
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
}

onMounted(() => {
  getParkingInquiries();
})
// import Datepicker from '@vuepic/vue-datepicker' // Datepicker 컴포넌트 불러오기
// import '@vuepic/vue-datepicker/dist/main.css' // Datepicker의 CSS 불러오기

// export default {
//   components: {
//     Datepicker // Datepicker 컴포넌트 등록
//   },
//   data() {
//     return {
//       selectedStartDate: null, // 선택한 시작 날짜를 저장할 변수
//       selectedEndDate: null, // 선택한 종료 날짜를 저장할 변수
//       locale: 'kr', // 언어 설정 (한국어로 설정)
//       to: new Date(), // 선택할 수 있는 날짜의 상한선 (오늘 날짜)
//       from: new Date(2020, 0, 1), // 선택할 수 있는 날짜의 하한선 (2020년 1월 1일)
//       inquiries: [
//         // 2024년 더미 데이터
//         {
//           id: 1,
//           question: '2024년에 해당 제품을 언제 다시 입고하나요?',
//           answer: '2024년 1월 중순에 다시 입고될 예정입니다.',
//           date: '2024-01-15' // 문의 날짜
//         },
//         {
//           id: 2,
//           question: '2024년 봄 컬렉션에 이 제품이 포함될 예정인가요?',
//           answer: '네, 2024년 봄 컬렉션에서 다시 만나보실 수 있습니다.',
//           date: '2024-03-10' // 문의 날짜
//         },
//         {
//           id: 3,
//           question: '2024년 할인을 진행할 예정인가요?',
//           answer: '2024년 여름 세일 기간에 할인이 적용될 예정입니다.',
//           date: '2024-06-20' // 문의 날짜
//         },
//         // 2023년 더미 데이터
//         {
//           id: 4,
//           question: '2023년 여름 세일 기간이 언제인가요?',
//           answer: '2023년 여름 세일은 7월에 진행됩니다.',
//           date: '2023-07-10' // 문의 날짜
//         },
//         {
//           id: 5,
//           question: '2023년 겨울 시즌에 이 제품을 다시 구할 수 있나요?',
//           answer: '2023년 11월 말에 다시 입고될 예정입니다.',
//           date: '2023-11-25' // 문의 날짜
//         },
//         {
//           id: 6,
//           question: '2023년 재고 상황이 어떤가요?',
//           answer: '2023년 재고는 현재 충분히 준비되어 있습니다.',
//           date: '2023-09-15' // 문의 날짜
//         }
//       ]
//     }
//   },
//   computed: {
//     // 선택된 날짜 범위에 맞게 문의 내역을 필터링하여 반환하는 computed 속성
//     filteredInquiries() {
//       // 날짜가 선택되지 않았을 경우, 모든 문의를 반환
//       if (!this.selectedStartDate || !this.selectedEndDate) {
//         return this.inquiries.slice().sort((a, b) => new Date(b.date) - new Date(a.date)) // 최신 순으로 정렬
//       }

//       // 선택된 날짜 범위에 해당하는 문의만 필터링 후 반환
//       const startDate = this.selectedStartDate
//       const endDate = this.selectedEndDate

//       return this.inquiries
//         .filter((inquiry) => {
//           const inquiryDate = new Date(inquiry.date)
//           return inquiryDate >= startDate && inquiryDate <= endDate
//         })
//         .slice() // 원본 배열을 수정하지 않도록 복사본 반환
//         .sort((a, b) => new Date(b.date) - new Date(a.date)) // 최신 순으로 정렬
//     }
//   },
//   methods: {
//     // 날짜를 YYYY-MM-DD 형식으로 변환하는 함수
//     formatDate(date) {
//       const year = date.getFullYear()
//       const month = String(date.getMonth() + 1).padStart(2, '0') // 월을 2자리로 만들기
//       const day = String(date.getDate()).padStart(2, '0') // 일을 2자리로 만들기
//       return `${year}-${month}-${day}` // YYYY-MM-DD 형식으로 반환
//     },
//     // '전체 보기' 버튼을 클릭 시 선택된 날짜를 초기화하여 모든 문의를 표시
//     viewAllInquiries() {
//       this.selectedStartDate = null // 시작 날짜 초기화
//       this.selectedEndDate = null // 종료 날짜 초기화
//     }
//   }
// }
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
