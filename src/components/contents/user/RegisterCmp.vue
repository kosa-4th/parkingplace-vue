<template>
  <!-- 
    작성자: 오지수
    회원가입 페이지
  -->
  <div class="signup-container">
    <span class="title">회원가입</span>
    <form @submit.prevent="handleSignup">

      <div class="input-group">
        <label for="name">이름</label>
        <input class="input" type="text" id="name" v-model="user.name" placeholder="홍길동" required>
      </div>

      <div class="input-group">
        <label for="email">이메일</label>
        <div>
          <input class="input-with-btn" type="email" id="email" v-model="user.email" placeholder="example@example.com" required>
          <button type="button" class="send-email-button" @click="sendVerification">인증메일 발송</button>
        </div>
      </div>

      <div class="input-group">
        <label for="verification-code">인증번호 입력</label>
        <div>
          <input class="input-with-btn" type="text" id="verification-code" v-model="user.code" placeholder="인증번호 입력" />
          <button type="button" class="verify-button" :class="{ 'verified': verification }" @click="verifyCode">인증하기</button>
        </div>
      </div>

      <div class="input-group-opp">
        <div>
          <label for="car-number">차량번호 등록</label>
          <input class="input" type="text" id="car-number" v-model="user.carNum" placeholder="123가4567" required>
        </div>
        <div>
          <label for="car-type">차량 종류</label>
          <select v-model="user.selectedCar" id="car-type" required>
            <option v-for="(carType, index) in carTypes" :key="index" :value="carType.carType">
            {{ carType.carType }}
            </option>
          </select>
        </div>
      </div>

      <div class="input-group">
        <label for="password">비밀번호</label>
        <input class="input" 
              :class="{ 'valid' : passwordValid, 'invalid' : !passwordValid && user.password.length > 0}" 
              type="password" 
              id="password" 
              v-model="user.password" 
              placeholder="(8~20자 영문, 숫자, 특수문자 조합)" 
              required
        />
      </div>
      <div class="input-group">
        <label for="confirm-password">비밀번호 확인</label>
        <input class="input" 
              :class="{ 'match': confirmPasswordMatch, 'mismatch': !confirmPasswordMatch && user.confirmPassword.length > 0}" 
              type="password" 
              id="confirm-password" 
              v-model="user.confirmPassword"
              required
        />
      </div>
      <div class="input-group">
        <div type="button" class="terms">이용약관</div>
      </div>
      <div class="check-group">
        <input type="checkbox" id="privacy-consent" v-model="isChecked" required>
        <label for="privacy-consent" @click="openPrivacyModal">[필수] 개인정보 수집 및 이용에 대한 동의</label>
      </div>
      <button type="submit" class="signup-button">회원가입</button>
    </form>

    <ConfirmModal
      :confirm="modal.confirm"
      :error="modal.error"
      v-if="modal.isModalVisible"
      :title="modal.modalTitle"
      :message="modal.modalMessage"
      :path="modal.modalPath"
      @close="modal.handleModalClose"
      />

    <button @click="handleGoogleLogin" class="google-signup-button">
      <img src="@/assets/img/google-logo.png" alt="google" class="google-img">구글 계정으로 로그인
    </button>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { googleSignIn } from '@/service/authService';
import router from '@/router';
import axios from 'axios';
import ConfirmModal from '@/components/modal/ConfirmModal.vue';

//비밀 번호 인증 여부
const verification = ref(false);
//이용 확인 체크 여부
const isChecked = ref(false);
//차량 종류
const carTypes = ref([]);


//회원가입 정보
const user = reactive({
  name: "",
  email: "",
  code: "",
  password: "",
  confirmPassword: "",
  selectedCar: "",
  carNum: ""
});

//모달 정보
const modal = reactive({
  error: false,
  confirm: false,
  isModalVisible: false,
  modalTitle: '회원가입',
  modalMessage: '',
  modalPath: ''
});

// 차량 종류 가져오는 메서드 (페이지 로딩)
const getCarTypes = async () => {
  try {
    const response = await axios.get("/api/users", {
      headers: {
        'Cache-Control': 'no-cache'
      }
    });    carTypes.value = response.data;
    user.selectedCar = carTypes.value[0].carType;
  } catch (error) {
    modal.error = true;
    modal.modalMessage = "잠시 후 다시 시도해 주세요."
    modal.modalPath = "/"
    modal.isModalVisible = true;
  }
}

//메일 인증 요청
const sendVerification = async () => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

  if (!emailPattern.test(user.email)) {
    modal.modalMessage("올바른 이메일을 입력해주세요.");
    modal.isModalVisible = true;
    return;
  }
  modal.modalMessage = "인증 메일이 요청되었습니다.<br/> 잠시만 기다려주세요."
  modal.confirm = true;
  modal.isModalVisible = true;
  try {
    await axios.post("/api/auth/verification", {
      email: user.email
    });

  } catch (error) {
    console.log(error.response.data);
    modal.modalMessage = error.response.data.message;
    modal.confirm = false;
    modal.isModalVisible = true;
  }
}

//인증 확인
const verifyCode = async () => {
  try {
    const response = await axios.post("/api/auth/verify", {
      email: user.email,
      code: user.code
    });
    verification.value = true;
    modal.confirm = true;
    modal.modalMessage = response.data.message;
    modal.isModalVisible = true;
  } catch (error) {
    modal.error = true;
    modal.modalMessage = error.response.data.message;
    modal.isModalVisible = true;
  }
}

// 비밀번호 규칙 확인
const passwordValid = computed(() => {
  const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
  return passwordPattern.test(user.password);
})

//비밀번호와 비밀번호 확인이 일치하는지 확인
const confirmPasswordMatch = computed(() => {
  return passwordValid.value && user.confirmPassword.length > 0 && user.password === user.confirmPassword;
})

watch(
  () => [user.password, user.confirmPassword],
  () => {
    // computed 속성들이 자동으로 처리하므로 여기서는 수동 호출이 필요 없음
  }
);

//회원가입
const handleSignup = async () => {
  if (!verification.value) {
    modal.modalMessage = "메일 인증이 필요합니다.";
    modal.isModalVisible = true;
  } else if (!passwordValid.value) {
    modal.modalMessage = "비밀번호 조건을 충족해주세요.";
    modal.isModalVisible = true;
  } else if (!confirmPasswordMatch.value){
    modal.modalMessage = "비밀번호가 일치하지 않습니다.";
    modal.isModalVisible = true;
  } else {
    try {
      const response = await axios.post("/api/users", user);
      console.log(response.data);
      if (response.status === 204 ) {
        modal.confirm = true;
        modal.modalTitle = '회원가입';
        modal.modalMessage = '회원가입이 완료되었습니다.';
        modal.modalPath = '/login';
        modal.isModalVisible = true;
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data.message) {
        modal.modalMessage = error.response.data.message;
      } else {
        modal.modalMessage = error.response.data[0].message;
      }
      modal.error = true;
      modal.isModalVisible = true;
    }
  }
}

modal.handleModalClose = () => {
  modal.isModalVisible = false;
  modal.error = false;
  modal.confirm = false;
}

// 구글 로그인 처리 함수
const handleGoogleLogin = () => {
  // Google OAuth  로그인 창 띄우기
  const clientId = '1088898736830-18dd892tdheuuaqdimgq4cecn7164edk.apps.googleusercontent.com'; // Google 클라이언트 ID
  const redirectUri = "http://localhost:5173/login"; 
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
  getCarTypes();
  handleGoogleLoginCallback();
})

</script>

<style scoped>

.signup-container {
  max-width: 600px;
  width: 80%;
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

select {
  border-radius: 5px;
  border: 1px solid #ddd;
  height: 40px;
  width: 100%;
}

select:focus {
  border: 1px solid #9A64E8;
  outline: none;
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

.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.input-group > div {
  display: flex;
  flex-direction: row;
}

.input-group > div > button {
  width: 100px;
  font-size: 14px;
  padding: 10px 2px;
  border-radius: 0 5px 5px 0;
  border: none;
}

.input-with-btn {
  border-radius: 5px 0 0 5px !important;
  width: calc(100% - 100px);
}

.send-email-button {  
  background-color: #EB4E3D;
  color: white;
}

.verify-button {
  background-color: #757575;
  color: white;
}

.input-group-opp {
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 5px;
  margin-bottom: 15px;
}
.input-group-opp > div {
  width: calc(100% - 100px);
}

.terms {
  background-color: #EBEBEB;
  color:#9A64E8;
  height: 40px;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  padding: 0 10px;
}

.check-group input[type="checkbox"] {
  width: auto;
  height: auto;
  margin-right: 10px;
}

.input-group label[for="privacy-consent"] {
  display: inline-block;
  vertical-align: middle;
  font-size: 14px;
}

.check-group {
  display: flex;
  flex-direction: row;
  justify-items: center;
}

.check-group label{
  display: block;
  text-decoration: underline;
  margin-bottom: -1px;
}

.signup-button {
  padding: 10px auto;
  background-color: #a371ea;
  color: #fff;
  font-size: 17px;
  cursor: pointer;
  margin-top: 15px;
  margin-bottom: 15px;
}

.google-signup-button {
  border: 1px solid #ddd;
  background-color: white;
  padding: 10px auto;
  font-size: 17px;
  cursor: pointer;
}

.google-img {
  height: 25px;
  margin-right: 10px;
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
