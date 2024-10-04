<template>
  <!-- 
    작성자: 오지수
    로그인 페이지 
  -->
  <div class="login-container">
    <span class="title">로그인</span>
    <form @submit.prevent="handleLogin">
      <div class="input-group">
        <label for="email">이메일</label>
        <input type="email" id="email" v-model="user.email" placeholder="example@example.com" required>
      </div>
      <div class="input-group">
        <label for="password">비밀번호</label>
        <input type="password" id="password" v-model="user.password" placeholder="(8~20자의 영문, 숫자, 특수문자 조합)" required>

        <div class="checkbox-group">
          <div>
            <input type="radio" id="personal" value="personal" v-model="user.membershipType"/>
            <label for="personal">일반 회원</label>
          </div>
          <div>
            <input type="radio" id="business" value="business" v-model="user.membershipType"/>
            <label for="business">기업 회원</label>
          </div>
        </div>
      </div>
      <button type="submit" class="login-button">로그인</button>
      <div class="options-group">
        <div>
          <input type="checkbox" id="auto-login">
          <label for="auto-login">자동 로그인</label>
        </div>
        <a href="#" class="find-password">비밀번호 찾기</a>
      </div>
    </form>

    <ConfirmModal
      v-if="modal.isModalVisible"
      :confirm="modal.confirm"
      :title="modal.modalTitle"
      :message="modal.modalMessage"
      :path="modal.modalPath"
      @close="handleModalClose"
      />

    <!-- 소셜 로그인 -->
    <button class="google-login-button" @click="handleGoogleLogin">
      <img src="@/assets/img/google-logo.png" alt="google" class="google-img">구글 계정으로 로그인
    </button>
    <p class="sign-up">
      아직 계정이 없으신가요?      <router-link to="/register" class="sign-up-link">간편 가입하기</router-link>
    </p>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import router from '@/router';
import { googleSignIn, signIn } from '@/service/authService';
import ConfirmModal from '@/components/modal/ConfirmModal.vue';
import axios from 'axios';

const user = reactive({
  email: "",
  password: "",
  membershipType: 'personal',
  // authLogin: false
});

const modal = reactive({
  confirm: false,
  isModalVisible: false,
  modalTitle: '로그인',
  modalMessage: '',
  modalPath: ''
})

const handleLogin = async () => {
  try {
    const success = await signIn(user);
    if (success) {
      router.push("/");
    } else {
      modal.modalMessage = `이메일 혹은 비밀번호를<br/>잘못 입력하셨습니다.`;
      modal.isModalVisible = true;
    }
  } catch {
    modal.modalMessage = '잘못된 접근입니다.<br/>잠시 후 다시 시도해 주세요.';
    modal.modalPath = "/";
    modal.isModalVisible = true;
  }
}

const handleModalClose = () => {
  modal.isModalVisible = false;
}

// 구글 로그인 처리 함수
const handleGoogleLogin = () => {
  // Google OAuth  로그인 창 띄우기
  const clientId = '1088898736830-18dd892tdheuuaqdimgq4cecn7164edk.apps.googleusercontent.com'; // Google 클라이언트 ID
  const redirectUri = `${import.meta.env.VITE_API_URL}/login`; 
  const scope = 'email profile';

  const googleLoginUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}&include_granted_scopes=true`;
  // Google 로그인 페이지로 리디렉션
  window.location.href = googleLoginUrl;
}

const handleGoogleLoginCallback = async () => {
  const hash = window.location.hash.substring(1);

  const params = new URLSearchParams(hash);
  const accessToken = params.get('access_token');
  const tokenType = params.get('token_type');
  const expiresIn = params.get('expires_in');

  if (accessToken) {
    try {
      const success = await googleSignIn(accessToken, tokenType, expiresIn);
      if (success === true) {
        router.push('/');
      } else {
        modal.modalMessage = success;
        modal.isModalVisible = true;
      }
    } catch {
      modal.modalMessage = '잘못된 접근입니다.<br/>잠시 후 다시 시도해 주세요.';
      modal.modalPath = "/";
      modal.isModalVisible = true;
    }
  }
}

onMounted(() => {
  handleGoogleLoginCallback();
})

</script>

<style scoped>
.login-container {
  width: 80%;
  max-width: 400px;
  margin: 50px auto;
}

input {
  border: 1px solid #ddd;
  border-radius: 5px !important;
  height: 40px;
  width: 100%;
}

input:focus {
  border-color: #9A64E8;
  outline: none;
}

button {
  border: none;
  border-radius: 5px;
  height: 40px;
  width: 100%;
}

.input-group {
  margin-bottom: 15px;
}

.checkbox-group {
  margin-top: 8px;
}
.checkbox-group div {
  margin-right: 15px;
}

.checkbox-group input[type="radio"] {
  width: 15px;
  height: 15px;
  margin-right: 5px;
  appearance: none;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 2px;
  position: relative;
}

.checkbox-group input[type="radio"]:checked {
  background-color: white;
  border-color: #9A64E8;
}

.checkbox-group input[type="radio"]::after {
  content: "✔";
  width: 3px;
  height: 3px;
  color: #9A64E8;
  position: absolute;
  transform: translate(-5%, -200%); 
  opacity: 0;
}

.checkbox-group input[type="radio"]:checked::after {
  opacity: 1; /* 선택된 경우 체크 표시가 보이도록 */
}

label {
  display: block;
  margin-bottom: 5px;
  font-size: 12px;
}

.title {
  display: block;
  padding-bottom: 20px;
  font-size: 22px;
  font-weight: 700;
}

.checkbox-group {
  display: flex;
  flex-direction: row;
}

.checkbox-group div {
  display: flex;
  flex-direction: row;
}

.options-group {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.options-group div{
  display: flex;
  flex-direction: row;
}

.options-group input[type="checkbox"] {
  width: 15px;
  height: 15px;
  margin-right: 5px;
  appearance: none;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 2px;
  position: relative;
}

.options-group input[type="checkbox"]:checked {
  background-color: white;
  border-color: #9A64E8;
}

.options-group input[type="checkbox"]::after {
  content: "✔";
  width: 3px;
  height: 3px;
  color: #9A64E8;
  position: absolute;
  transform: translate(-5%, -200%); 
  opacity: 0;
}

.options-group input[type="checkbox"]:checked::after {
  opacity: 1;
}

.find-password {
  font-size: 12px;
  text-decoration: underline;
  color: #4A4A4A;
}

.login-button {
  background-color: #9A64E8;
  color: white;
  font-weight: 600;
  margin-bottom: 8px;
}

.sign-up {
  text-align: center;
  font-size: 12px;
  gap: 20px;
  display: flex;
  justify-content: center;
}

.sign-up-link {
  font-weight: 600;
  color:#4A4A4A;
}

.google-login-button {
  margin-top: 50px;
  border: 1px solid #ddd;
  background-color: white;
  margin-bottom: 15px;
}

.google-img {
  height: 25px;
  margin-right: 10px;
}
</style>
