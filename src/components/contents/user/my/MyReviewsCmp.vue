<template>
  <div class="review-container">
    <div class="title">내 리뷰</div>

    <div v-if="reviews.length === 0">작성된 리뷰가 없습니다.</div>

    <div v-for="(review, index) in reviews" :key="index" class="review-box" @click="gotoReview(review.parkinglotId)">
      <div class="review-header">
        <div class="parking-name">{{ review.parkinglotName }}</div>
        <div class="review-date">{{ review.reviewDate }}</div>
        <div class="review-content">
          {{ review.review }}
        </div>
      </div>
      <span class="arrow">
        <svg width="15" height="30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 30">
              <g fill="none" stroke="#9a64e8" stroke-width="4" stroke-linecap="round">
                <path d="M 2 2 L 13 15 L 2 28" />
              </g>
            </svg>
      </span>
    </div>  

    <!-- 더보기 버튼 -->
    <hr class="more-separatior" v-if="hasMoreReviews">
    <button class="more-btn" v-if="hasMoreReviews" @click="getMoreReviews">더보기 ∨</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const reviews = ref([]);
const page = ref(0);
const size = 5;
const hasMoreReviews = ref(true);

const getReviews = async () => {
  // try {
    const response = await axios.get(`/api/users/reviews/protected`,
      {
        page: page.value,
        size: size
      }
    );
    console.log(response.data);
    const newReviews = response.data.reviews;
    reviews.value = [...reviews.value, ...newReviews];
    hasMoreReviews.value = response.data.nextPage;
  // } catch (error) {
  //   console.log(error);
  // }
}

const getMoreReviews = () => {
  page.value++;
  getReviews();
}

const gotoReview = (parkinglotId) => {
  router.push(`/lot/${parkinglotId}/review`);
}

onMounted(() => {
  getReviews();
});
</script>

<style scoped>
.review-container {
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 30px;
}

.review-box {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.review-header {
  width: 90%;
  display: flex;
  flex-direction: column;
}

.parking-name {
  font-weight: 700;
}

.review-date {
  font-size: 10px;
}

.review-date {
  font-size: 15px;
  color: #d9d9d9;
}

.review-content {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.arrow {
  margin-left: 10px;
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
