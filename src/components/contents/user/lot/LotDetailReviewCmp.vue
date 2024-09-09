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
    <div v-for="(review, index) in reviews" :key="index" class="review-item">
      <p><strong>{{ review.reviewer }}</strong> | {{ review.reviewDate }}</p>

      <!-- 수정 모드!! 설정 -->
      <!-- <textarea
        :readonly="!review.isEditing"
        v-model="review.isEditing ? editingReview : review.review"
        @input="autoResize($event)"
        :class="{ editable: review.isEditing }"
        ></textarea> -->

      <textarea
        v-if="!review.isEditing"
        readonly
        v-model="review.review"
        @input="autoResize($event)"></textarea>

      <textarea
        v-if="review.isEditing"
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

    <!-- 더보기 버튼 -->
    <button class="more-btn" v-if="hasMoreReviews" @click="getMoreReviews">더보기</button>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { AuthStore } from '@/stores/store';
import { useRoute } from 'vue-router';
import axios from 'axios';

const authStore = AuthStore();
const route = useRoute();
const token = authStore.token;

//로그인된 사용자
const loggedInUser = computed(() => authStore.email);

// 리뷰 목록 데이터
const newReview = ref('');
const reviews = ref([]);
const page = ref(1);
const size = 5;
const hasMoreReviews = ref(true);
let editingReview = ref(''); 

// 현재 주차장 번호
const parkinglotId = route.params.lotId;

//
const autoResize = (event) => {
  const textarea = event.target;
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
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
  if (authStore.isLoggedIn) {
    
    const response = await axios.post(`/api/parkinglots/${parkinglotId}/reviews/protected`,
      {newReview : newReview.value},
      {headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }}
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

//댓글 삭제
const deleteReview = async (reviewid) => {
  if (authStore.isLoggedIn) {
    console.log(reviewid);
    const response = await axios.delete(`/api/parkinglots/${parkinglotId}/reviews/${reviewid}/protected`,
    {headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }}
    );
    console.log(response.data);
    resetData();
    
  } else {
    alert("로그인 후 이용해주세요.")
  }
}

//댓글 수정
const modifyReview = (review) => {
  review.isEditing = true;
  editingReview.value = review.review;
}

//댓글 수정 취소
const cancelEdit = (review) => {
  review.isEditing = false;
  editingReview.value = '';
}

//리뷰 수정 저장
const saveReview = async (review) => {
  console.log()
  try {
    const response = await axios.put(`/api/parkinglots/${parkinglotId}/reviews/${review.id}/protected`,
      {newReview: editingReview.value},
      {headers: {Authorization: `Bearer ${token}`}}
    );
    review.review = editingReview.value;
    console.log(response.data);
    review.isEditing = false;
    editingReview.value = '';
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
