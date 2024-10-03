<template>
  <div class="inquiry-container">
    <div class="inquiry-form">
      <div>
        <p class="label">문의 내용</p>
        <button v-if="isEditMode" @click="openDeleteModel" class="delete-btn">삭제</button>
      </div>
        <hr>
        <textarea 
          id="inquiry-content"
          v-model="inquiryContent"
          placeholder="문의 내용을 작성해주세요."
          class="inquiry-textarea"
        ></textarea>
    </div>

    <div class="secret-checkbox">
      <input type="checkbox" id="secret" v-model="isSecret" />
      <label for="secret">비밀글</label>
    </div>
    <button class="submit-btn" @click="handleInquiry">{{ isEditMode ? '수정하기' : '등록하기' }}</button>

    <confirm-modal
      v-if="modalState.isVisible"
      :confirm="modalState.confirm"
      :message="modalState.message"
      :path="modalState.path"
      @close="handleCloseModal"
    />

    <confirm-cancel-modal
      v-if="confirmCancelModalState.isVisible"
      :confirm="confirmCancelModalState.confirm"
      :message="confirmCancelModalState.message"
      :path="confirmCancelModalState.path"
      @close="handleColseCCModal"
      @confirm="confirmModalAction"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'; 
import { AuthStore } from '@/stores/store';
import ConfirmModal from '@/components/modal/ConfirmModal.vue';
import ConfirmCancelModal from '@/components/modal/ConfirmCancelModal.vue';
import { modalState, handleCloseModal } from '@/components/modal/ConfirmModalService';
import { showConfirmModal, showInfoModal, showCCInfoModal } from '@/components/modal/ConfirmModalService';
import { confirmCancelModalState, handleColseCCModal } from '@/components/modal/ConfirmModalService';
import axios from 'axios';

const route = useRoute();
const parkinglotId = route.params.lotId;
const inquiryId = route.params.inquiryId;
const inquiryContent = ref('');
const isSecret = ref(false);
const isEditMode = ref(false);

const actionType = ref('');

// 수정 모드라면 기존 데이터 가져오기
const fetchInquiryDate = async () => {
  if (inquiryId) {
    try {
      console.log("수정모드임")
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/parkingLots/${parkinglotId}/inquiries/${inquiryId}/protected`);
      console.log(response.data)
      inquiryContent.value = response.data.inquiry;
      isEditMode.value = true;
    } catch (error) {
      showInfoModal(error.response.data.message);
    }
  }
}

//문의 작성 또는 수정
const handleInquiry = async() => {
  if (inquiryContent.value.trim() == '') {
    showInfoModal("문의 내용을 작성해주세요.");
    return;
  }

  const authStore = AuthStore();
  if (!authStore.isLoggedIn) {
    showInfoModal("로그인 후 이용해주세요.", `/lot/${parkinglotId}/inquiry`);
    return;
  }

  try {
    if (isEditMode.value) {
      //수정모드일 때
      openModifyModal();
    } else {
      //작성모드일때
      submitInquiry();
    }
  } catch (error) {
    showInfoModal(error.response.data.message);
  }
}

// 문의 수정
const modifyInquiry = async ()  => {
  handleColseCCModal();
  await axios.put(`${import.meta.env.VITE_API_URL}/api/parkingLots/${parkinglotId}/inquiries/${inquiryId}/protected`,
    {
      newInquiry: inquiryContent.value,
      isSecret : isSecret.value
    },
  );
  showConfirmModal("문의 수정이 완료되었습니다.", `/lot/${parkinglotId}/inquiry`)
};

// 문의 작성
const submitInquiry = async () => {
  console.log(isSecret.value)
  await axios.post(`${import.meta.env.VITE_API_URL}/api/parkingLots/${parkinglotId}/inquiries/protected`,
    {
      inquiry: inquiryContent.value,
      secret: isSecret.value
    },
  );
  showConfirmModal("문의 등록이 완료되었습니다.", `/lot/${parkinglotId}/inquiry`)
}

// 문의 삭제
const deleteInquiry = async ()  => {
  console.log("문의 삭제 작업")
  handleColseCCModal();
  await axios.delete(`${import.meta.env.VITE_API_URL}/api/parkingLots/${parkinglotId}/inquiries/${inquiryId}/protected`);
  showConfirmModal("문의를 삭제가 완료되었습니다.", `/lot/${parkinglotId}/inquiry`)
};

//모달
const openModifyModal = () => {
  showCCInfoModal("문의를 수정하시겠습니까?");
  actionType.value = "modify";
}

const openDeleteModel = () => {
  showCCInfoModal("문의를 삭제하시겠습니까?<br/>삭제된 문의는 되돌릴 수 없습니다.");
  actionType.value = "delete";
}

const confirmModalAction = async () => {
  if (actionType.value === 'modify') {
    await modifyInquiry();
  } else if (actionType.value === 'delete') {
    await deleteInquiry();
  }
}

onMounted(() => {
  fetchInquiryDate();
})
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
  margin-bottom: 10px;
}

.inquiry-form div {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
}

.label {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 0px;
}

.inquiry-textarea {
  width: 100%;
  height: 150px;
  border: none;
  outline: none;
  border-radius: 5px;
  resize: none;
}

.secret-checkbox {
  display: flex;
  align-items: center;
  margin: 0;
}

.secret-checkbox input {
  margin-right: 5px;
  height: 30px;
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

.delete-btn {
  width: 60px;
  height: 34px;
  background-color: #F93A41 ;
  margin: 0;
}
</style>