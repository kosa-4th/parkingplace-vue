<template>
  <!-- 작성자: 오지수
      주차장 상세 페이지: 리뷰 -->

  <div class="review-detail">
    <div class="review-input">
      <textarea
        placeholder="리뷰를 작성해주세요."
        v-model="newReview"
        rows="1"
        class="review-write-textarea"
        @input="autoResize($event)"></textarea>
      <button class="submit-btn" @click="registerReview">리뷰 등록</button>
    </div>

    <hr>

    <!-- 리뷰목록 -->
    <div class="review-items">
      <div v-for="(review, index) in reviews" :key="index" class="review-item">
        <div>
          <span class="review-reviewer">{{ review.reviewer }}</span> | <span class="review-date">{{ review.reviewDate }}</span>
        </div>
        
        <textarea
          v-if="!review.isEditing"
          readonly
          rows="1"
          v-model="review.review"
          class="read-only-textarea"
          @input="autoResize($event)"></textarea>

        <textarea
          v-if="review.isEditing"
          rows="1"
          v-model="editingReview"
          @input="autoResize($event)"
          class="editable"></textarea>

        <!-- 수정 모드 아닐 때 -->
        <div v-if="isReviewOwner(review) && !review.isEditing" class="review-actions">
          <button class="edit-btn" @click="modifyReview(review)">수정</button>
          <button class="delete-btn" @click="deleteReview(review.id)">삭제</button>
        </div>

        <!-- 수정 모드일 때 -->
        <div v-if="review.isEditing" class="review-actions">
          <button class="save-btn" @click="saveReview(review)">저장</button>
          <button class="cancel-btn" @click="cancelEdit(review)">취소</button>
        </div>
      </div>
    </div>

    <!-- 더보기 버튼 -->
    <hr class="more-separatior" v-if="hasMoreReviews">
    <button class="more-btn" v-if="hasMoreReviews" @click="getMoreReviews">더보기 ∨</button>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { AuthStore } from '@/stores/store';
import { useRoute } from 'vue-router';
import axios from 'axios';

const authStore = AuthStore();
const route = useRoute();

//로그인된 사용자
const loggedInUser = computed(() => authStore.email);

// 리뷰 목록 데이터
const newReview = ref('');
const reviews = ref([]);
const page = ref(1);
const size = 5;
const hasMoreReviews = ref(true);
let editingReview = ref(''); 
let editingReviewId = ref(null);

// 현재 주차장 번호
const parkinglotId = route.params.lotId;

//
const autoResize = (event) => {
  const textarea = event.target;
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight}px`;
}

//리뷰 불러오기
const getReviews = async () => {
  try {
    const response = await axios.get(`/api/parkinglots/${parkinglotId}/reviews`, {
      params: {
        page: page.value - 1,
        size: size
      }
    });
    console.log(response.data);
    const newReviews = response.data.reviews.map(review => ({
      ...review,
      isEditing: false
    }));

    hasMoreReviews.value = response.data.nextPage;
    reviews.value = [...reviews.value, ...newReviews];
  } catch {
    console.log("리뷰 가져오기 에러");
  }
}

// 리뷰등록
const registerReview = async () => {
  if (!newReview.value.trim()) {
    alert("리뷰를 작성해주세요.")
    return;
  }
  if (authStore.isLoggedIn) {
    
    const response = await axios.post(`/api/parkinglots/${parkinglotId}/reviews/protected`,
      {newReview : newReview.value},
    );
    console.log(response.data);
    resetData();
  } else {
    // 로그인되지 않음
    alert("로그인 후 이용해주세요");
  }
}

// 더보기 버튼
const getMoreReviews = async () => {
  page.value += 1;
  getReviews();
}

// 리뷰 작성자와 로그인한 사용자가 같은지 확인
const isReviewOwner = (review) => {
  return review.email === loggedInUser.value;
}

//리뷰 삭제
const deleteReview = async (reviewid) => {
  if (authStore.isLoggedIn) {
    console.log(reviewid);
    const response = await axios.delete(`/api/parkinglots/${parkinglotId}/reviews/${reviewid}/protected`);
    console.log(response.data);
    resetData();
    
  } else {
    alert("로그인 후 이용해주세요.")
  }
}

//댓글 수정
const modifyReview = (review) => {
  if (editingReviewId.value) {
    alert("수정 중인 리뷰가 있습니다.")
  } else {
    review.isEditing = true;
    editingReview.value = review.review;
    editingReviewId.value = review.id;
  }
}

//댓글 수정 취소
const cancelEdit = (review) => {
  review.isEditing = false;
  editingReview.value = '';
  editingReviewId.value = null;
}

//리뷰 수정 저장
const saveReview = async (review) => {
  console.log()
  try {
    const response = await axios.put(`/api/parkinglots/${parkinglotId}/reviews/${review.id}/protected`,
      {newReview: editingReview.value}
    );
    review.review = editingReview.value;
    console.log(response.data);
    review.isEditing = false;
    editingReview.value = '';
    editingReviewId.value = null;
    // resetData();
  } catch {
    console.log("리뷰 수정 에러");
  }
}

const resetData = () => {
  newReview.value = '';
    reviews.value = [];
    page.value = 1;
    hasMoreReviews.value = true;
    getReviews();
}

onMounted(() => {
  getReviews();
})

</script>

<style scoped>
textarea {
  resize: none;
  overflow: hidden;
  width: 100%;
  border: none;
  border-radius: 5px;
  align-items: center;
  padding: 10px;
  line-height: 1.2;
  align-items: center;
}

textarea:focus {
  outline: 1px solid #9a64e8;
}

textarea.editable {
  outline: 1px solid #9a64e8;
}

textarea.read-only-textarea {
  outline: none;
}

.review-input textarea {
  width: calc(100% - 95px);
}

.review-detail {
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.review-input {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 5px;
}

button {
  height: 38px;
  width: 80px;
  padding: auto;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: white;
  font-size: 15px;
}

.submit-btn {
  margin: auto;
  background-color: #9a64e8;
}

.review-items {
  margin-bottom: 20px;
}

.review-item {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 4px;
}

.review-item textarea {
  padding: 5px 0;
}

.review-item div {
  margin: 5px 0;
}

.review-reviewer {
  font-weight: 700;
}

.review-date {
  font-size: 14px;
  color: #757575;
}

.review-actions {
  display: flex;
  gap: 4px;
  justify-content: flex-end;
}

.edit-btn {
  background-color: #757575;
}

.save-btn {
  background-color: #9a64e8;
}

.delete-btn, .cancel-btn {
  background-color: #F93A41;
}

.more-btn {
  width: 110px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 20px;
  color: black;
  margin-top: -40px;
  margin-bottom: 20px;
  padding: 5px 20px;
  align-self: center;
  z-index: 1;
}
</style>
