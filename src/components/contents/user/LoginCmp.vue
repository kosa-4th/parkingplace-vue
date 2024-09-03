<template>
  <div class="login-container">
    <h2>로그인</h2>
    <form @submit.prevent="handleLogin">
      <div class="input-group">
        <label for="email">이메일</label>
        <input type="email" id="email" v-model="user.email" placeholder="example@example.com" required>
      </div>
      <div class="input-group">
        <label for="password">비밀번호</label>
        <input type="password" id="password" v-model="user.password" placeholder="(8~20자의 영문, 숫자, 특수문자 조합)" required>
      </div>
      <div class="checkbox-group">
        <input type="radio" id="personal" value="personal" v-model="user.membershipType"/>
        <label for="personal">일반 회원</label>
        <input type="radio" id="business" value="business" v-model="user.membershipType"/>
        <label for="business">기업 회원</label>
      </div>
      <button type="submit" class="login-button">로그인</button>
      <div class="options-group">
        <input type="checkbox" id="auto-login">
        <label for="auto-login">자동 로그인</label>
        <a href="#" class="find-password">비밀번호 찾기</a>
      </div>
    </form>
    <!-- 소셜 로그인 -->
    <button class="google-login-button">
      구글 계정으로 로그인
    </button>
    <p class="sign-up">
      아직 계정이 없으신가요? <a href="#" class="sign-up-link">간편 가입하기</a>
    </p>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { signIn } from '@/service/authService';

const user = reactive({
  email: "",
  password: "",
  membershipType: 'personal',
  // authLogin: false
});

const handleLogin = async () => {
  try {
    const success = await signIn(user);
    if (success) {
      console.log("login successful");
    } else {
      console.error("login failed");
    }
  } catch (error) {
    console.error("Error during login");
  }
}

</script>

<style>
.login-container {
  width: 90%;
  max-width: 400px;
  margin: auto;
}

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 10px;
}

.input-group input {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.checkbox-group {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.checkbox-group input {
  margin-right: 5px;
}

.login-button {
  width: 100%;
  padding: 10px;
  background-color: #a371ea;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 15px;
}

.options-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.google-login-button {
  width: 100%;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  cursor: pointer;
}

.sign-up {
  text-align: center;
  font-size: 10px;
}

.sign-up-link {
  text-decoration: none;
}
</style>
