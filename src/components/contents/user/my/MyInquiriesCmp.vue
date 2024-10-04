<template>
  <div class="inquiry-container">
    <div class="title">내 문의</div>

    <div v-if="inquiries.length === 0">작성된 문의가 없습니다.</div>

    <div v-for="(inquiry, index) in inquiries" :key="index" class="inquiry-box" @click="gotoinquiry(inquiry.inquiryId)">
      <div class="inquiry-header">
        <div class="parking-name">{{ inquiry.parkingLotName }}</div>
        <div class="inquiry-date">{{ inquiry.inquiryDate }}</div>
        <div class="inquiry-content">
          {{ inquiry.inquiry }}
        </div>
        <div v-if="inquiry.isIfAnswer" class="isAnswer">
          답변완료
        </div>
        <div v-else class="isNotAnswer">
          미답변
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
    <hr class="more-separatior" v-if="hasMoreinquiries">
    <button class="more-btn" v-if="hasMoreinquiries" @click="getMoreinquiries">더보기 ∨</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const inquiries = ref([]);
const page = ref(0);
const size = 5;
const hasMoreinquiries = ref(true);

const getinquiries = async () => {
    const response = await axios.get(`/api/users/inquiries/protected`,
      {params: {
        page: page.value,
        size: size
      }}
    );
    const newinquiries = response.data.inquiries;
    inquiries.value = [...inquiries.value, ...newinquiries];
    hasMoreinquiries.value = response.data.nextPage;
}

const getMoreinquiries = () => {
  page.value++;
  getinquiries();
}

const gotoinquiry = (inquiryId) => {
  router.push(`/my/inquiries/${inquiryId}`);
}

onMounted(() => {
  getinquiries();
});
</script>

<style scoped>
.inquiry-container {
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

.inquiry-box {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.inquiry-header {
  width: 90%;
  display: flex;
  flex-direction: column;
}

.parking-name {
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.inquiry-date {
  font-size: 13px;
  color: #d9d9d9;
  margin-bottom: 5px;
}

.inquiry-content {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  margin-bottom: 5px;
}

.isAnswer {
  color: #76D672;
  font-size: 15px;
}

.isNotAnswer {
  color: #F93A41;
  font-size: 15px;
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
