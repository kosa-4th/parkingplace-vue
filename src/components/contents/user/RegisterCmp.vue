<template>
  <!-- 
    작성자: 오지수
    회원가입 페이지
  -->
  <div class="signup-container">
    <h2>회원가입</h2>
    <form @submit.prevent="handleSignup">
      <div class="input-group">
        <label for="name">이름</label>
        <input type="text" id="name" v-model="user.name" placeholder="홍길동" required>
      </div>
      <div class="input-group email-group">
        <label for="email">이메일</label>
        <input type="email" id="email" v-model="user.email" placeholder="example@example.com" required>
        <button type="button" class="send-email-button" @click="sendVerification">인증 메일 발송</button>
      </div>
      <div class="input-group">
        <label for="verification-code">인증번호 입력</label>
        <input type="text" id="verification-code" v-model="user.code" placeholder="인증번호 입력" />
        <button type="button" class="verify-button" @click="verifyCode">인증하기</button>
      </div>
      <div class="input-group">
        <label for="car-number">차량번호 등록</label>
        <input type="text" id="car-number" v-model="user.carNum" placeholder="123가4567" required>
      </div>
      <div class="input-group">
        <label for="car-type">차량 종류</label>
        <select v-model="user.selectedCar" id="car-type" required>
          <option v-for="(carType, index) in carTypes" :key="index" :value="carType.carType">
          {{ carType.carType }}
          </option>
        </select>
      </div>
      <div class="input-group">
        <label for="password">비밀번호</label>
        <input type="password" id="password" v-model="user.password" placeholder="(8~20자 영문, 숫자, 특수문자 조합)" required/>
      </div>
      <div class="input-group">
        <label for="confirm-password">비밀번호 확인</label>
        <input type="password" id="confirm-password" required/>
      </div>
      <div class="input-group">
        <label for="terms">이용약관</label>
        <button type="button" class="terms-button">이용약관 보기</button>
      </div>
      <div class="input-group">
        <input type="checkbox" id="privacy-consent">
        <label for="privacy-consent">[필수] 개인정보 수집 및 이용에 대한 동의</label>
      </div>
      <button type="submit" class="signup-button">회원가입</button>
    </form>

      <ConfirmModal
      v-if="modal.isModalVisible"
      :title="modal.modalTitle"
      :message="modal.modalMessage"
      :path="modal.modalPath"
      @close="modal.handleModalClose"
      />

    <button @click="signupWithGoogle" class="google-signup-button">구글 계정으로 로그인</button>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import ConfirmModal from '@/components/modal/ConfirmModal.vue';

const verification = ref(false);

const user = reactive({
  name: "",
  email: "",
  code: "",
  password: "",
  selectedCar: "",
  carNum: ""
});


const modal = reactive({
  isModalVisible: false,
  modalTitle: '',
  modalMessage: '',
  modalPath: ''
});

const carTypes = ref([]);

const getCarTypes = async () => {
  try {
    const response = await axios.get("/api/users");
    carTypes.value = response.data;
    user.selectedCar = carTypes.value[0].carType;
  } catch (error) {
    console.log(error);
  }
}

const sendVerification = async () => {
  try {
    const response = await axios.post("/api/auth/verification", {
      email: user.email
    });
    console.log(response.data);
    alert("인증 메일이 발송되었습니다.");
  } catch (error) {
    alert("에러");
  }
}

const verifyCode = async () => {
  try {
    const response = await axios.post("/api/auth/verify", {
      email: user.email,
      code: user.code
    });
    verification.value = true;
    alert(response.data.message);
  } catch (error) {
    alert("에러");
  }
}

const handleSignup = async () => {
  if (!verification.value) {
    alert("메일 인증이 필요합니다.");
  } else {
    try {
      const response = await axios.post("/api/users", user);
      console.log(response.data);
      if (response.data.message === "success") {
        // alert("회원가입이 완료되었습니다.");
        modal.modalTitle = 'info';
        modal.modalMessage = '회원가입이 성공적으로 완료되었습니다!!!!!!!!!!!!!!!!!!!!!!!!!!!!';
        modal.modalPath = '/';
        modal.isModalVisible = true;
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data.message) {
        modal.modalTitle = 'ERROR';
        modal.modalMessage = error.response.data.message;
        modal.modalPath = '';
        modal.isModalVisible = true;
      } else {
        modal.modalTitle = 'ERROR';
        modal.modalMessage = error.response.data[0].message;
        modal.modalPath = '';
        modal.isModalVisible = true;
      }
    }
  }
}

modal.handleModalClose = () => {
  modal.isModalVisible = false;
}

onMounted(() => {
  getCarTypes();
})
</script>

<style scoped>
.signup-container {
  max-width: 600px;
  margin: auto;
}

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
}

.input-group input,
.input-group select {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.email-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.send-email-button,
.verify-button,
.terms-button {
  padding: 8px 10px;
  margin-left: 10px;
  background-color: #ccc;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.signup-button {
  width: 100%;
  padding: 10px;
  background-color: #a371ea;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 15px;
}

.google-signup-button {
  width: 100%;
  padding: 10px;
  background-color: #fff;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 15px;
}
</style>
