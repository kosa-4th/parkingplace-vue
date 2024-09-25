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

    <div v-if="reviews.length == 0" class="no-review">
      작성된 리뷰가 없습니다
    </div>

    <!-- 리뷰목록 -->
    <div v-else class="review-items">
      <hr>
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
          @input="autoResize($event)"
          ref="reviewTextarea"
          ></textarea>

        <textarea
          v-if="review.isEditing"
          rows="1"
          v-model="editingReview"
          @input="autoResize($event)"
          class="editable"></textarea>

        <!-- 수정 모드 아닐 때 -->
        <div v-if="isReviewOwner(review) && !review.isEditing" class="review-actions">
          <button class="edit-btn" @click="modifyReview(review)">수정</button>
          <button class="delete-btn" @click="openDeleteModal(review)">삭제</button>
        </div>

        <!-- 수정 모드일 때 -->
        <div v-if="review.isEditing" class="review-actions">
          <button class="save-btn" @click="openModifyModal(review)">저장</button>
          <button class="cancel-btn" @click="cancelEdit(review)">취소</button>
        </div>
      </div>
    </div>

    <!-- 더보기 버튼 -->
    <hr class="more-separatior" v-if="hasMoreReviews">
    <button class="more-btn" v-if="hasMoreReviews" @click="getMoreReviews">더보기 ∨</button>

    <confirm-modal
      v-if="modalState.isVisible"
      :confirm="modalState.confirm"
      :error="modalState.error"
      :message="modalState.message"
      @close="handleCloseModal"  
    />

    <confirm-cancel-modal
      v-if="confirmCancelModalState.isVisible"
      :confirm="confirmCancelModalState.confirm"
      :message="confirmCancelModalState.message"
      @close="handleColseCCModal"
      @confirm="confirmModalAction"
    />
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';
import { AuthStore } from '@/stores/store';
import { useRoute } from 'vue-router';
import ConfirmModal from '@/components/modal/ConfirmModal.vue';
import ConfirmCancelModal from '@/components/modal/ConfirmCancelModal.vue';
import { modalState, handleCloseModal, showConfirmModal, showInfoModal, showErrorModal } from '@/components/modal/ConfirmModalService';
import { confirmCancelModalState, handleColseCCModal, showConfirmCancelModal, showCCInfoModal } from '@/components/modal/ConfirmModalService';
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

const actionType = ref('');
const reviewVal = ref(null);

//리뷰 삭제 모달 열기
const openDeleteModal = (review) => {
  showCCInfoModal("이 리뷰를 삭제하시겠습니까?");
  actionType.value = 'delete';
  reviewVal.value = review;
}

// 리뷰 수정 모달
const openModifyModal = (review) => {
  showCCInfoModal("이 리뷰를 수정하시겠습니까?");
  actionType.value = 'modify';
  reviewVal.value = review;
}
//  취소 확인 모달 -> 확인 눌렀을 때
const confirmModalAction = async () => {
  const review = reviewVal.value;
  if (actionType.value === 'delete') {
    await deleteReview(review.id);
  } else if (actionType.value === 'modify') {
    await saveReview(review)
  }
  handleColseCCModal();
}

//
const autoResize = (event) => {
  const textarea = event.target;
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight}px`;
}

//리뷰 불러오기
const getReviews = async () => {
  try {
    const response = await axios.get(`/api/parkinglots/${parkinglotId}/reviews?page=${page.value -1}&size=${size}`);
    const newReviews = response.data.reviews.map(review => ({
      ...review,
      isEditing: false
    }));

    hasMoreReviews.value = response.data.nextPage;
    reviews.value = [...reviews.value, ...newReviews];

    await nextTick(() => {
      document.querySelectorAll('textarea.read-only-textarea').forEach(textarea => {
        autoResize({ target: textarea });
      });
    });
  } catch {
    showErrorModal("잠시 후 다시 시도해주세요.")
  }
}

// 리뷰등록
const registerReview = async () => {
  if (!newReview.value.trim()) {
    showInfoModal("리뷰를 작성해주세요.")
    return;
  }
  if (authStore.isLoggedIn) {
    await axios.post(`/api/parkinglots/${parkinglotId}/reviews/protected`,
      {newReview : newReview.value},
    );
    showConfirmModal("리뷰가 등록되었습니다.")
    resetData();
  } else {
    // 로그인되지 않음
    showInfoModal("로그인 후 이용해주세요.")
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

    await axios.delete(`/api/parkinglots/${parkinglotId}/reviews/${reviewid}/protected`);
    showConfirmModal("리뷰가 삭제되었습니다.")
    resetData();
  } else {
    showInfoModal("로그인 후 이용해주세요.")
  }
}

//댓글 수정
const modifyReview = (review) => {
  if (editingReviewId.value) {
    showInfoModal("수정 중인 리뷰가 있습니다.")
  } else {
    review.isEditing = true;
    editingReview.value = review.review;
    editingReviewId.value = review.id;

    nextTick(() => {
      const textarea = document.querySelector(`textarea.editable`);
      autoResize({ target: textarea });
    });
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
  try {
    await axios.put(`/api/parkinglots/${parkinglotId}/reviews/${review.id}/protected`,
      {newReview: editingReview.value}
    );
    
    review.review = editingReview.value;
    review.isEditing = false;
    editingReview.value = '';
    editingReviewId.value = null;
    
    // 리뷰 수정 완료 모달 표시
    showConfirmModal("리뷰 수정이 완료되었습니다.");

    // DOM 업데이트 후 자동 리사이즈 적용
    await nextTick(() => {
      document.querySelectorAll('textarea.read-only-textarea').forEach(textarea => {
        autoResize({ target: textarea });
      });
    });
    
  } catch (error) {
    // 리뷰 수정 에러 처리
    showErrorModal("잠시 후 다시 시도해주세요.");
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
  max-width: 700px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: 300px;
}

.no-review {
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
  margin-top: 20px;
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

.review-actions button {
  height: 34px;
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
