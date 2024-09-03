<template>
  <!-- <div class="singup">
    <div>
      <h3>회원가입</h3>
    </div>
    <div class="signup-info">
      <div class="name">
        <span class="label">이름</span>
        <input class="input-box" type="text" v-model="user.name" placeholder="홍길동">
      </div>
      <div class="email">
        <span class="label">이메일</span>
        <div>
          <input class="input-box" type="text" v-model="user.email" placeholder="example@example.com">
          <button class="auth-btn auth-email-btn">인증 메일 발송</button>
        </div>
      </div>
      <div class="auth-num">
        <span class="label">인증번호 입력</span>
        <div>
          <input class="input-box" type="text">
          <button class="auth-btn auth-confrim-btn">인증하기</button>
        </div>
      </div>
      <div class="car-info">
        <div>
          <span>차량번호 등록</span>
          <input type="text" placeholder="123가4567">
        </div>
        <div>
          <span>차량 종류</span>
          <div>
            <select name="select-car">
              <option value="">--</option>
              <option value="1">경차</option>
            </select>
          </div>
        </div>
        <div class="password-first">
          <span>비밀번호(8자 이상)</span>
          <input type="password" v-model="user.password" placeholder="(8~20자리 이상의 영문 대소문자, 숫자, 특수문자 조합)">
        </div>
        <div>
          <span>비밀번호 확인</span>
          <input type="password" placeholder="**********">
        </div>
      </div>
      <button @click="submitForm">회원가입</button>
    </div>
  </div> -->
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
        <button type="button" class="send-email-button">인증 메일 발송</button>
      </div>
      <div class="input-group">
        <label for="verification-code">인증번호 입력</label>
        <input type="text" id="verification-code" placeholder="인증번호 입력" />
        <button type="button" class="verify-button">인증하기</button>
      </div>
      <div class="input-group">
        <label for="car-number">차량번호 등록</label>
        <input type="text" id="car-number" placeholder="123가4567" required>
      </div>
      <div class="input-group">
        <label for="car-type">차량 종류</label>
        <select id="car-type" required>
          <option disabled value="">차량 종류 선택</option>
          <option>승용차</option>
          <option>트럭</option>
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
    <button @click="signupWithGoogle" class="google-signup-button">구글 계정으로 로그인</button>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import axios from 'axios';

const user = reactive({
  name: "",
  email: "",
  password: "",
});

const handleSignup = async () => {
  try {
    const response = await axios.post("http://localhost:8080/api/users", user);
    console.log(response.data);
    if (response.data.message === "success") {
      alert("회원가입이 완료되었습니다.");
    }
  } catch (error) {
    console.error(error);
    if (error.response && error.response.data.message) {
      alert(error.response.data.message);
    } else {
      alert(error.response.data[0].message);
    }
  }
}

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
