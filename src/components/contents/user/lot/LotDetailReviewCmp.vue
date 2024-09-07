<template>
  <!-- 작성자: 오지수
      주차장 상세 페이지: 리뷰 -->

  <div class="review-detail">
    <div class="review-input">
      <textarea
        placeholder="리뷰를 작성해주세요."
        v-model="newReview"
        @input="autoResize($event)"></textarea>
      <button class="submit-btn" @click="registerReview">리뷰 등록</button>
    </div>

    <!-- 리뷰목록 -->
    <div class="review-item">
      <p><strong>작성자</strong> | 2024-03-14</p>
      <textarea>리뷰입니다~</textarea>
      <div class="review-actions">
        <button class="edit-btn">수정</button>
        <button class="delete-btn">삭제</button>
      </div>
    </div>

    <!-- 더보기 버튼 -->
    <button class="more-btn">더보기</button>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { AuthStore } from '@/stores/store';
import { useRoute } from 'vue-router';
import axios from 'axios';
const authStore = AuthStore();
const route = useRoute();
const token = authStore.token;
const newReview = ref('');

const parkinglotId = route.params.lotId;

const autoResize = (event) => {
  const textarea = event.target;
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
}

const getReviews = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/api/parkinglots/${parkinglotId}/reviews`);
    console.log(response.data)
  } catch {
    console.log("리뷰 가져오기 에러");
  }
}


const registerReview = async () => {
  if (authStore.isLoggedIn) {
    console.log("로그인");
    console.log(`token ${token}`)
    
    const response = await axios.post(`http://localhost:8080/api/parkinglots/${parkinglotId}/reviews/protected`,
      {newReview : newReview.value},
      {headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }}
    );
    console.log(response.data);
  } else {
    // 로그인되지 않음
    alert("로그인 후 이용해주세요");
  }
}

onMounted(() => {
  getReviews();
})

</script>

<style scoped>
textarea {
  height: 80px;
  resize: none;
  overflow: hidden;
  width: 100%;
}

textarea.editable {
  border: 1px solid #669900;
}

.review-detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.review-input {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.review-input textarea {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.submit-btn {
  background-color: #a663cc;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.review-item {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.review-item textarea {
  width: 80%;
  margin: 5px 0;
}

.review-actions {
  display: flex;
  gap: 10px;
}
</style>
