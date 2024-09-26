<template>
  <div class="inquriy-container">
    <button class="inquiry-btn" @click="navigateToMakeInquiry">문의하기</button>

    <div class="no-inquiry" v-if="inquiries.length === 0">작성된 문의가 없습니다</div>

    <div v-else class="inquiries">
    <div
      v-for="(inquiry, index) in inquiries" 
      :key="index"
    >
      <div
        class="inquiry-box"
        :class="{'active': selectedInquiry === index && inquiry.answerDate}"
        @click="toggleInquiry(index)"
      >
        <div class="inquiry-header">
          <div>
            <span class="inquirer">{{ inquiry.inquirer }}</span> | <span class="inquiry-date">{{  inquiry.inquiryDate }}</span>
          </div>
          <span class="arrow">
            <button v-if="!inquiry.answerDate && userEmail===inquiry.iqnuirerEmail" class="edit-btn" @click="handleInquiryEdit(inquiry.id, inquiry.inquiry)">편집</button>

            <img 
              v-if="selectedInquiry === index && inquiry.answerDate"
              src="@/assets/img/arrow-top-grey.png" alt="arrow up"
            />
            <img 
              v-else
              src="@/assets/img/arrow-bottom-grey.png" alt="arrow down"
            />
          </span>
        </div>

        <div class="inquiry-text" :class="{'full-text':selectedInquiry === index}">
          <!-- 비밀글인 경우 표시 -->
          <span v-if="inquiry.secret && userEmail != inquiry.inquirerEmail" class="inquiry-text-txt secret-font"><i>"비밀로 작성된 문의글입니다."</i></span>
          <span v-else class="inquiry-text-txt">{{ inquiry.inquiry }}</span>
        </div>
        <div class="inquiry-edit">
          <span class="non-answer" v-if="inquiry.answerDate === null">미답변</span>
          <span class="confirm-answer" v-if="inquiry.answerDate">답변 완료</span>
        </div>

        <!-- 답변영역 -->
        <div v-if="selectedInquiry === index && inquiry.answerDate">
          <div v-if="inquiry.secret && userEmail !== inquiry.inquirerEmail" class="answer-box">
            <hr>
            <div class="secret-font"><i>"비밀로 작성된 문의글입니다."</i></div>
          </div>
          <div v-else class="answer-box">
            <hr>
            <div>{{ inquiry.answer }}</div>
            <span class="answer-date">{{ inquiry.answerDate }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>  

    <hr class="more-separatior" v-if="hasMoreReviews">
    <button class="more-btn" v-if="hasMoreReviews" @click="getMoreReviews">더보기 ∨</button>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { AuthStore } from '@/stores/store';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const authStore = AuthStore();

const parkinglotId = route.params.lotId;
const userEmail = ref('');

const inquiries = ref([]);
const selectedInquiry = ref(null);
const page = ref(0);
const size = 5;
const hasMoreReviews = ref(true);

//문의 작성하기
const navigateToMakeInquiry = () => {
  router.push(`/lot/${parkinglotId}/make-inquiry`);
}
//문의 수정하기
const handleInquiryEdit = (inquiryId, inquiryContent) => {
  router.push({
    path:`/lot/${parkinglotId}/make-inquiry/${inquiryId}`,
    state: {inquiryContent}
});
}

// 문의 가져오기
const getInquiries = async () => {
  const response = await axios.get(`/api/parkingLots/${parkinglotId}/inquiries?page=${page.value}&size=${size}`);
  const newInquiries = response.data.inquiries;
  inquiries.value = [...inquiries.value, ...newInquiries];
  hasMoreReviews.value = response.data.nextPage;
  console.log(response.data)
}

// 답변 보기
const toggleInquiry = (index) => {
  if (inquiries.value[index].answerDate) {
    selectedInquiry.value = selectedInquiry.value === index ? null : index;
  }
}

watchEffect(()=> {
  if (authStore.isLoggedIn) {
    userEmail.value = authStore.getEmail;
  } else {
    userEmail.value = '';
  }
})
const getMoreReviews = () => {
  page.value += 1;
  getInquiries();
}

onMounted(() => {
  getInquiries();
})
</script>

<style scoped>
img {
  height: 35px;
}
.inquriy-container {
  width: 90%;
  display: flex;
  flex-direction: column;
  max-width: 700px;
  min-height: 300px;
}

button {
  width: 100%;
  background-color: #9A64E8;
  color: white;
  border: none;
  border-radius: 5px;
  height: 40px;
  margin-bottom: 20px;
}

.no-inquiry {
  width: 100%;
  height: 50px;
  margin: 0 auto;
  padding: auto;
  border-left: 2px solid #9a64e8;
  border-right: 3px solid #9a64e8;
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
  font-weight: 700;
  margin-top: 15px;
}

.inquiries {
  margin-bottom: 20px;
}

.inquiry-box {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 4px;
  padding: 10px 15px;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.inquiry-box.active {
  border-color: #9A64E8;
}

.inquiry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.inquirer {
  font-weight: 700;
}

.inquiry-date, .answer-date {
  font-size: 13px;
  color: #757575;
}

.inquiry-text {
  width: 100%;
  padding: 10px 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.edit-btn {
  width: 60px;
  height: 30px;
  margin: 8px;
}

.inquiry-text span{
  display: block;
}

.inquiry-text-txt {
  overflow: hidden; 
  text-overflow: ellipsis;
  white-space: nowrap;
}

.inquiry-text.full-text {
  overflow: visible;
  white-space: normal;
}

.inquiry-edit {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.secret-font {
  color: #757575;
}

.non-answer {
  font-size: 13px;
  color: #EB4E3D;
}

.confirm-answer {
  font-size: 13px;
  color: #76D672;
}

.answer-box {
  padding: 5px 0 10px;
}

.answer-box div {
  margin-bottom: 10px;
}

.more-btn {
  width: 110px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 20px;
  color: black;
  margin-top: -36px;
  margin-bottom: 20px;
  padding: 5px 20px;
  align-self: center;
  z-index: 1;
}
</style>
