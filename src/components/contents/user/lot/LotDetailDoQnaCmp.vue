<template>
  <div class="inquiry-container">
    <div class="inquiry-form">
        <p class="label">문의 내용</p>
        <hr>
        <textarea 
          id="inquiry-content"
          v-model="inquiryContent"
          placeholder="문의 내용을 작성해주세요."
          class="inquiry-textarea"
        ></textarea>
    </div>
    <button class="submit-btn" @click="submitInquiry">등록하기</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'; 
import { AuthStore } from '@/stores/store';
import axios from 'axios';
const route = useRoute();
const router = useRouter();
const parkinglotId = route.params.lotId;
const inquiryContent = ref('');


const submitInquiry = async () => {
  if (inquiryContent.value.trim() == '') {
    alert("문의 내용을 작성해주세요.");
    return;
  };
  const authStore = AuthStore();
  
  console.log("lot: " + parkinglotId);
  console.log("inquiry: " + inquiryContent.value);
  if (authStore.isLoggedIn) {
    const response = await axios.post(`/api/parkingLots/${parkinglotId}/inquiries/protected`,
      {inquiry: inquiryContent.value},
    );
    console.log(response.data);
    alert("문의 작성이 완료되었습니다.");
  } else {
    alert("로그인 후 이용해주세요.")
  }
  router.push(`/lot/${parkinglotId}/inquiry`);
}
</script>

<style scoped>
.inquiry-container {
  width: 90%;
  display: flex;
  flex-direction: column;
  margin: 20 auto;
}

.inquiry-form {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 20px;
}

.label {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 10px;
}

.inquiry-textarea {
  width: 100%;
  height: 150px;
  border: none;
  outline: none;
  border-radius: 5px;
  resize: none;
}

button {
  background-color: #9A64Eb;
  color: white;
  height: 40px;
  width: 100%;
  border: none;
  border-radius: 5px;
  margin-bottom: 20px;
}
</style>