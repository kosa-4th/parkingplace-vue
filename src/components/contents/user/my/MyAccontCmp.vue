<template>
  <div class="member-info-container">
    <h2>님 안녕하세요!</h2>

    <div class="form-group">
      <label for="email">이메일</label>
      <input type="email"
              id="email"
              v-model="email"
              placeholder="example@naver.com"
              disabled
              />
    </div>

    <div class="form-group">
      <label for="phone">전화번호</label>
      <input type="text"
              id="phone"
              v-model="phone"
              placeholder="010-xxxx-xxxx"
              disabled
              />
    </div>

    <div class="form-group">
      <label for="current-password">현재 비밀번호</label>
      <input type="password"
              id="current-password"
              v-model="currentPassword"
              required
              />
    </div>

    <div class="form-group">
      <label for="new-password">비밀번호(8자 이상)</label>
      <input  class="input"
              :class="{ 'valid': passwordValid, 'invalid': !passwordValid && user.newPassword.length > 0}"
              type="password"
              id="new-password"
              v-model="user.newPassword"
              placeholder="8 ~ 20자리 이하의 영문, 숫자, 특수문자 조합"
              />
    </div>

    <div class="form-group">
      <label for="confirm-password">비밀번호 확인</label>
      <input  class="input"
              :class="{ 'match': confirmPasswordMatch, 'mismatch': !confirmPasswordMatch && user.confirmPassword > 0}"
              type="password"
              id="confirm-password"
              v-model="user.confirmPassword"
              />
    </div>

    <button @click="updateInfo" class="submit-btn">회원 정보 수정하기</button>
    <button @click="deleteAccount" class="delete-btn">회원 탈퇴하기</button>
  </div>
</template>

<script setup>
import { watch, computed, reactive } from 'vue';
import axios from 'axios';

const user = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: ""
})
// 비밀번호 규칙 확인
const passwordValid = computed(() => {
  const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
  return passwordPattern.test(user.newPassword);
})

//비밀번호와 비밀번호 확인이 일치하는지 확인
const confirmPasswordMatch = computed(() => {
  return passwordValid.value && user.confirmPassword.length > 0 && user.newPassword === user.confirmPassword;
})

watch(
  () => [user.newPassword, user.confirmPassword],
  () => {
    // computed 속성들이 자동으로 처리하므로 여기서는 수동 호출이 필요 없음
  }
);

// 비밀 번호 수정
const updateInfo = async () => {

}

// 회원 탈퇴
const deleteAccount = async () => {

}
</script>

<style scoped>
.member-info-container {
  max-width: 400px;
  width: 90%;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #666;
}

input {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.submit-btn {
  width: 100%;
  padding: 10px;
  margin-top: 15px;
  background-color: #9A64E8;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.delete-btn {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  background-color: transparent;
  color: #999;
  border: none;
  cursor: pointer;
  text-align: center;
}

.input {
  border: 1px solid #ddd;
  border-radius: 5px;
  /* height: 40px;
  width: 100%; */
}

input:focus {
  border-color: #9A64E8;
  outline: none;
}

/* buttons */
.verified {
  background-color: #76D672;
}

.valid {
  border-color: #76D672;
}

.valid:focus {
  border-color: #76D672;
}

.invalid {
  border-color: #EB4E3D;
}

.invalid:focus {
  border-color: #EB4E3D;
}

.match {
  border-color:#76D672;
}
.match:focus {
  border-color:#76D672;
}

.mismatch {
  border-color: #EB4E3D;
}
.mismatch:focus {
  border-color: #EB4E3D;
}


</style>
