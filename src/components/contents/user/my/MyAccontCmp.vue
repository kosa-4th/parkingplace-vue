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
              />
    </div>

    <div class="form-group">
      <label for="new-password">비밀번호(8자 이상)</label>
      <input type="password"
              id="new-password"
              v-model="newPassword"
              placeholder="8 ~ 20자리 이하의 영문, 숫자, 특수문자 조합"
              />
    </div>

    <div class="form-group">
      <label for="confirm-password">비밀번호 확인</label>
      <input type="password"
              id="confirm-password"
              v-model="confirmPassword"
              />
    </div>

    <button @click="updateInfo" class="submit-btn">회원 정보 수정하기</button>
    <button @click="deleteAccount" class="delete-btn">회원 탈퇴하기</button>
  </div>
</template>

<script>
export default {}
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
  background-color: #915dd1;
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
</style>
