<template>
  <!-- 작성자: 오지수
  2024.09.20 : 확인, 취소 모달 -->
  <div class="modal-overlay">
    <div class="modal-container">
      <img v-if="error" src="@/assets/img/logo-error.jpg" alt="error">
      <img v-else-if="confirm" src="@/assets/img/logo-check.jpg" alt="check">
      <img v-else src="@/assets/img/logo-info.jpg" alt="info">

      <h2>{{ title }}</h2>
      <div v-html="message"></div>
      <div class="button-group">
        <!-- 취소 버튼 -->
        <button @click="cancelAction" class="cancel-btn">취소</button>
        <!-- 확인 버튼 -->
        <button @click="confirmAction" :class="{ 'error-btn': error, 'info-btn': !error}">확인</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  confirm: {
    type: Boolean,
    default: true //true 기본 초록 알림창, false는 info 알림창 (노랑)
  },
  error: {
    type: Boolean,
    default: false //true시 빨간 알림창
  },
  title: {
    type: String,
    default: '알림'
  },
  message: {
    type: String,
    default: '작업이 완료되었습니다.'
  },
  path: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['close', 'confirm']);
const router = useRouter();

const cancelAction = () => {
  emit('close');
}

const confirmAction = () => {
  emit('confirm');
  if (props.path !== '') {
    router.push(props.path);
  }
}

</script>

<style scoped>
img {
  width: 280px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}

.modal-overlay {
  z-index: 5000;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
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
  overflow: hidden;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  color: #fff;
  font-weight: 700;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100px;
}

.error-btn {
  background-color: #F93A41;
}

.info-btn {
  background-color: #9A64E8;
}

.cancel-btn {
  background-color: #888;
}
</style>