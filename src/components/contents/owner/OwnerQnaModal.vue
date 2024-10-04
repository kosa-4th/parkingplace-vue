<template>
  <div class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <h5>문의 편집</h5>
        <button type="button" class="close" @click="$emit('close-modal')">×</button>
      </div>

      <div class="modal-body">
        
        <!-- 문의 등록자 -->
        <div class="input-container">
          <label>문의 등록자</label>
          <input v-model="inquiryData.inquirer" type="text" class="form-control" disabled />
        </div>

        <!-- 문의 등록일 -->
        <div class="input-container">
          <label>문의 날짜</label>
          <input v-model="inquiryData.inquiryDate" type="text" class="form-control" disabled />
        </div>

        <!-- 문의 -->
        <div class="input-container">
          <label>문의</label>
          <div class="inquiry-content" v-html="inquiryData.inquiry"></div>
        </div>


        <!-- 답변 여부 -->
        <div class="input-container">
          <label>답변 여부</label>
          <input v-model="answerStatus" type="text" class="form-control" disabled />
        </div>

        <!-- 답변 입력 -->
        <div class="input-container">
          <label>답변</label>
          <textarea
            v-model="inquiryData.answer"
            placeholder="답변을 입력해주세요"
            class="form-control textarea"
          ></textarea>
        </div>
      </div>

      <div class="modal-footer">
        <!-- 항상 저장 버튼 유지 -->
        <div v-if="answerStatus === '미답변'">
          <button class="btn bg-purple" @click="openConfirmCancelModal">저장</button>
          <button class="btn bg-light" @click="$emit('close-modal')">닫기</button>
        </div>
        <div v-else>
          <button class="btn bg-purple" @click="openConfirmCancelModal">수정</button>
          <button class="btn bg-light" @click="$emit('close-modal')">닫기</button>
        </div>
      </div>
    </div>

    <div v-if="modalState.isVisible" class="confirm-modal-overlay">
      <confirm-modal
      v-if="modalState.isVisible"
      :confirm="modalState.confirm"
      :error="modalState.error"
      :message="modalState.message"
      @close="handleCloseModal"  
    />
    </div>


    <div v-if="confirmCancelModalState.isVisible" class="confirm-modal-overlay">
      <confirm-cancel-modal
      v-if="confirmCancelModalState.isVisible"
      :confirm="confirmCancelModalState.confirm"
      :message="confirmCancelModalState.message"
      @close="handleColseCCModal"
      @confirm="confirmModalAction"
    />
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import ConfirmModal from '@/components/modal/ConfirmModal.vue';
import ConfirmCancelModal from '@/components/modal/ConfirmCancelModal.vue';
import { modalState, confirmCancelModalState } from '@/components/modal/ConfirmModalService';
import { showConfirmModal, showInfoModal, showCCInfoModal, handleCloseModal, handleColseCCModal } from '@/components/modal/ConfirmModalService';

const props = defineProps({
  inquiryId: {
    type: Number,
    required: true
  },
  parkinglotId: {
    type: Number,
    required: true
  }
});

const inquiryData = ref([]);
const answerStatus = ref('미답변');

//문의 사항 불러오기
const getInquiryDetails = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/parking-manager/parkinglots/${props.parkinglotId}/inquiries/${props.inquiryId}/protected`);
    inquiryData.value = response.data;
    answerStatus.value = response.data.answerDate ? "답변완료" : "미답변";
  } catch (error) {
    showInfoModal(error.response.date.error);
  }
}

const openConfirmCancelModal = () => {
  if (inquiryData.value.answer.trim() === '') {
    showInfoModal('답변을 입력해주세요.');
    return;
  }

  let word = '';
  if (answerStatus.value === '답변완료') {
    word = '수정';
  } else {
    word = '저장';
  }
  showCCInfoModal(`입력하신 문의사항을 ${word}하시겠습니까?`);
}


// 저장/수정 함수
const confirmModalAction = async () => {
  handleColseCCModal();
  try {
    const url = `${import.meta.env.VITE_API_URL}/api/parking-manager/parkinglots/${props.parkinglotId}/inquiries/${props.inquiryId}/protected`;
    const method = answerStatus.value === "답변완료" ? 'put' : 'post';

    const response = await axios({
      method,
      url,
      data: { answer: inquiryData.value.answer }
    });

    console.log(response.data);
    showConfirmModal(`답변이 저장되었습니다.`);
  } catch (error) {
    console.error(error);
    showInfoModal(error.response.data.message)
  }
}

onMounted(() => {
  getInquiryDetails();
});
</script>


<style scoped>

textarea {
  width: 100%;
  height: 150px; /* 높이 고정 */
  resize: none; /* 크기 조정 불가 */
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
}
/* 모달 전체 화면 배경 (어두운 overlay) */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* 어두운 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1049; /* 모달이 다른 요소 위에 있도록 */
}

/* 모달 본체 */
.modal {
  display: block;
  position: fixed; /* 화면에 고정 */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* 정확한 가운데 정렬 */
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 80%;
  max-width: 900px;
  height: auto;
  z-index: 1050; /* 모달이 overlay 위에 오도록 z-index 설정 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 가벼운 그림자 */
}

/* 모달 헤더 (타이틀 및 닫기 버튼) */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 10px;
}

.modal-header h5 {
  margin: 0;
  font-size: 1.5rem;
}

.close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #000;
}

.close:hover {
  color: #ff0000;
}

/* 모달 본문 */
.modal-body {
  padding: 20px 0;
  overflow-y: auto;
  max-height: 500px; /* 모달 본문의 최대 높이 설정 */
}

.inquiry-content {
  width: 100%;
  white-space: pre-wrap;
  word-break: break-word;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
  background-color: #f8f9fa;
}

/* 모달 푸터 (등록, 닫기 버튼) */
.modal-footer {
  text-align: right;
  border-top: 1px solid #dee2e6;
  padding-top: 10px;
  height: 50px;
}

/* 버튼 스타일 */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}

.bg-green {
  background-color: #76D672;
  color: white;
}

.bg-green:hover {
  background-color: #6CC76B;
}

.bg-light {
  background-color: #f8f9fa;
  color: black;
}

.bg-light:hover {
  background-color: #e2e6ea;
}

/* 입력 필드와 레이블 스타일 */
.input-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.input-container label {
  min-width: 150px; /* 레이블의 최소 너비 설정 */
  margin-right: 10px; /* 레이블과 입력 필드 사이의 간격 */
}

.input-container input,
.input-container select {
  flex: 1; /* 입력 필드나 셀렉트 박스가 공간을 적절히 차지하게 함 */
}

/* 추가 서비스 (세차, 정비) 관련 스타일 */
.additional-services {
  display: flex;
  flex-direction: column;
  gap: 10px; /* 각 서비스 블록 간의 간격 */
}

.service-container {
  display: flex;
  flex-direction: column;
}

.service-row {
  display: flex;
  align-items: center; /* 체크박스와 라벨을 세로로 가운데 정렬 */
  gap: 10px; /* 체크박스와 라벨 간의 간격 */
}

.input-below {
  margin-top: 10px;
  display: flex;
}

.price-input {
  width: 100%; /* 입력창을 가득 채우도록 설정 */
}

/* 보라색 버튼 */
.bg-purple {
  background-color: #9A64E8;
  color: white;
}

.bg-purple:hover {
  background-color: #8a58d6;
}

/* 초록색 버튼 */
.bg-green {
  background-color: #76D672;
  color: white;
}

.bg-green:hover {
  background-color: #69c162;
}

/* 빨간색 버튼 */
.bg-red {
  background-color: #F93A41;
  color: white;
}

.bg-red:hover {
  background-color: #e83339;
}

/* 연보라색 버튼 */
.bg-light-purple {
  background-color: #F0E5FF;
  color: black;
}

.bg-light-purple:hover {
  background-color: #e3d8ff;
  color: black;
}

.confirm-modal-overlay {
  z-index: 1051;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6); /* 조금 더 어두운 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;
  position: relative;
  z-index: 1052; /* z-index 값을 모달 내부에서 더 높게 설정 */
}
</style>