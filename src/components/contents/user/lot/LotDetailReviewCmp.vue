<template>
  <!-- 작성자: 오지수
      주차장 상세 페이지: 리뷰 -->
  <div>
    <h3>LotDetailReviewCmp</h3>
  </div>

  <div class="review-detail">
    <div class="review-input">
      <input type="text" placeholder="리뷰를 작성해주세요." />
      <button class="submit-btn">리뷰 등록</button>
    </div>

    <!-- 리뷰목록 -->
    <div class="review-item">
      <p><strong>작성자</strong> | 2024-03-14</p>
      <p>리뷰입니다~</p>
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

</script>

<style scoped>
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

.review-input input {
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

.review-item p {
  margin: 5px 0;
}

.review-actions {
  display: flex;
  gap: 10px;
}
</style>
