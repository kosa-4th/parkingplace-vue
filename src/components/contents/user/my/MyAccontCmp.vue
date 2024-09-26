<template>
  <div class="member-info-container">
    <div class="title">회원 정보</div>
    <div class="name"><strong>{{ authStore.getUsername }}</strong>님 안녕하세요!</div>

    <div class="form-group">
      <label for="email">이메일</label>
      <!-- <input type="email"
              id="email"
              v-model="d"
              placeholder="example@naver.com"
              disabled
              /> -->
      <div class="user-info">{{ authStore.getEmail }}</div>
    </div>

    <div class="form-group">
      <label for="phone">전화번호</label>
      <input type="text"
              id="phone"
              v-model="phone"
              placeholder="-"
              disabled
              />
      <!-- <div class="user-info"></div> -->
    </div>

    <div class="form-group">
      <label for="current-password">현재 비밀번호</label>
      <input type="password"
              id="current-password"
              v-model="user.currentPassword"
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
              required
              />
    </div>

    <div class="form-group">
      <label for="confirm-password">비밀번호 확인</label>
      <input  class="input"
              :class="{ 'match': confirmPasswordMatch, 'mismatch': !confirmPasswordMatch && user.confirmPassword > 0}"
              type="password"
              id="confirm-password"
              v-model="user.confirmPassword"
              required
              />
    </div>

    <button @click="openModifyModal" class="submit-btn">회원 비밀번호 수정</button>
    <button @click="openDeleteUserModal" class="delete-btn">회원 탈퇴하기</button>

    <confirm-modal
      v-if="modalState.isVisible"
      :confirm="modalState.confirm"
      :error="modalState.error"
      :message="modalState.message"
      :path="modalState.path"
      @close="handleCloseModal"  
    />

    <confirm-cancel-modal
      v-if="confirmCancelModalState.isVisible"
      :confirm="confirmCancelModalState.confirm"
      :message="confirmCancelModalState.message"
      @close="handleColseCCModal"
      @confirm="confirmModalAction"
    />
  </div>
</template>

<script setup>
import { ref, watch, computed, reactive } from 'vue';
import { AuthStore } from '@/stores/store';
import { logout } from '@/service/authService';
import ConfirmModal from '@/components/modal/ConfirmModal.vue';
import ConfirmCancelModal from '@/components/modal/ConfirmCancelModal.vue';
import { modalState, confirmCancelModalState, showConfirmModal, showInfoModal, showCCInfoModal, handleCloseModal, handleColseCCModal} from '@/components/modal/ConfirmModalService';
import axios from 'axios';

const authStore = AuthStore();
const user = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: ""
})

const actionType = ref('');

// 비밀번호 수정 모달 열기
const openModifyModal = () => {
  if (!user.currentPassword || !user.newPassword || !user.confirmPassword) {
    showInfoModal("모든 필드를 작성해 주세요.");
    return;
  }
  // 2. 현재 비밀번호와 새 비밀번호가 같은지 확인
  if (user.currentPassword === user.newPassword) {
    showInfoModal("현재 비밀번호와 새 비밀번호는 같을 수 없습니다.")
    return;
  }
  // 3. 새 비밀번호가 유효한지 확인
  if (!passwordValid.value) {
    showInfoModal("비밀번호는 8~20자리의 영문, 숫자, 특수문자를 포함해야 합니다.");
    return;
  }
  // 4. 새 비밀번호와 확인 비밀번호가 일치하는지 확인
  if (!confirmPasswordMatch.value) {
    showInfoModal("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
    return;
  }
  showCCInfoModal("비밀번호를 수정하시겠습니까?");
  actionType.value = 'modify';
}

const openDeleteUserModal = () => {
  showCCInfoModal("회원 탈퇴하시겠습니까?", '', "회원 탈퇴");
  actionType.value = 'delete';
}

const confirmModalAction = async () => {
  if (actionType.value === 'modify') {
    await updateInfo();
  } else if (actionType.value === 'delete') {
    await deleteAccount();
  }
  handleColseCCModal();
}

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
  // 빈 칸이 있는지 확인
  // if (!user.currentPassword || !user.newPassword || !user.confirmPassword) {
  //   showInfoModal("모든 필드를 작성해 주세요.");
  //   return;
  // }
  // // 2. 현재 비밀번호와 새 비밀번호가 같은지 확인
  // if (user.currentPassword === user.newPassword) {
  //   showInfoModal("현재 비밀번호와 새 비밀번호는 같을 수 없습니다.")
  //   return;
  // }
  // // 3. 새 비밀번호가 유효한지 확인
  // if (!passwordValid.value) {
  //   showInfoModal("비밀번호는 8~20자리의 영문, 숫자, 특수문자를 포함해야 합니다.");
  //   return;
  // }
  // // 4. 새 비밀번호와 확인 비밀번호가 일치하는지 확인
  // if (!confirmPasswordMatch.value) {
  //   showInfoModal("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
  //   return;
  // }
  try {
    const response = await axios.put("/api/users/profile/protected", {
      password: user.currentPassword,
      newPassword: user.newPassword
    });
    console.log(response.data);
    showConfirmModal("비밀 번호 변경이 완료되었습니다.")
    user.currentPassword = '';
    user.newPassword = '';
    user.confirmPassword = '';
  } catch (error) {
    showInfoModal(error.response.data.message);
  };
}

// 회원 탈퇴
const deleteAccount = async () => {
  try {
    await axios.delete("/api/users/profile/protected");
    logout();
    showConfirmModal("회원 탈퇴처리 되었습니다.", '/')
  } catch (error) {
    showInfoModal(error.response.data.message);
  }
}
</script>

<style scoped>
.member-info-container {
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
}

.title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 30px;
}

.name {
  margin-bottom: 14px;
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
  margin-top: 40px;
  background-color: transparent;
  color: #999;
  border: none;
  cursor: pointer;
  text-align: center;
  font-size: 13px;
  text-decoration: underline;
}

.input {
  border: 1px solid #ddd;
  border-radius: 5px;
  /* height: 40px;
  width: 100%; */
}

.user-info {
  border: 1px solid #ddd;
  border-radius: 5px;
  height: 42.33px;
  padding: 10px;
  align-items: center;
  background-color: #EFEFEF4D;
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
