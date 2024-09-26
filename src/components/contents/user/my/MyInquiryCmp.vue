<template>
  <div class="inquiry-container">
    <div class="title" @click="goToInquiries">
        <img src="@/assets/img/arrow-left-grey.png" alt="arrow">
        <div>내 문의</div>
    </div>
    <div class="inquiry-card">
      <div class="inquiry-header">
        <div>
          <span class="parking-lot-name">{{ inquiry.parkinglotName }}</span> |
          <span class="date">{{ inquiry.inquiryDate }}</span>
        </div>
        <span :class="{'answered': inquiry.answerDate, 'unanswered': !inquiry.answerDate}">
          {{ inquiry.answerDate ? '답변완료' : '미답변' }}
        </span>
      </div>
      <div class="inquiry-content">
        <div class="question">
          <span class="question-label">Q.</span>
          <span class="question-text">{{ inquiry.inquiry }}</span>
        </div>
        <div class="answer" v-if="inquiry.answerDate">
          <span class="answer-label">A.</span>
          <span class="answer-text">{{ inquiry.answer }}</span>
        </div>
        <div v-else class="no-answer">
          <span class="question-label">Q.</span>
          <span>답변이 없습니다.</span>
        </div>
      </div>
      <button class="go-to-page-btn" @click="goToParkingLotPage">주차장 페이지로 가기</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const route = useRoute();
const inquiryId = route.params.inquiryId;
console.log("inquiryId" + inquiryId)

const inquiry = ref([]);

const getInquiry = async () => {
  try {
    const response = await axios.get(`/api/users/inquiries/${inquiryId}/protected`);
    inquiry.value = response.data;
    console.log(response.data)
  } catch (error) {
    console.log("에러 발생");
    console.log(error.response.data.message)
  }
}

const goToParkingLotPage = () => {
  router.push(`/lot/${inquiry.value.parkinglotId}/inquiry`);
}

const goToInquiries = () => {
  router.push('/my/inquiries');
}

onMounted(() => {
  getInquiry();
})
</script>

<style scoped>
.inquiry-container {
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.title {
  display: flex;
  flex-direction: row;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
  align-items: center;
}

img {
  height: 35px;
}

.inquiry-card {
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
}

.inquiry-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  align-items: center;
}

.inquiry-header div {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
}

.inquiry-header div span{
  display: block;
}

.parking-lot-name {
  font-weight: bold;
}

.date {
  font-size: 15px;
  color: #757575;
}

.answered {
  font-size: 13px;
  color: #76D672;
}

.unanswered {
  font-size: 13px;
  color: #F93A41;
}

.inquiry-content {
  margin-bottom: 16px;
}

.inquiry-content div {
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 15px 10px;
  min-height: 100px;
}

.question {
  margin-bottom: 8px;
}

.question-label, .answer-label {
  color: #9A64E8;
  font-weight: bold;
  margin-right: 5px;
}

.no-answer {
  color: #ddd;
}

.go-to-page-btn {
  background-color: #9A64E8;
  color: white;
  font-weight: 700;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}

.go-to-page-btn:hover {
  background-color: #9A64E8;
}
</style>