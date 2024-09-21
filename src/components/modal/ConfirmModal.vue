<template>
  <!-- 
    작성자: 오지수
    모달 페이지
    2024.09.20: 확인, 에러 모두 가능하게 수정
  -->
  <div class="modal-overlay">
    <div class="modal-container">
        <img v-if="error" src="@/assets/img/logo-error.jpg" alt="error">
        <img v-else-if="confirm" src="@/assets/img/logo-check.jpg" alt="check">
        <img v-else src="@/assets/img/logo-info.jpg" alt="info" class="info-img">
        
        <h2>{{ title }}</h2>
        <div v-html="message"></div>
        <button @click="confirmAction" :class="{ 'error-btn': error, 'info-btn': !error}">확인</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
    confirm: {
      type: Boolean,
      default: true //true는 기본 알림창, false는 error 알림창
    },
    error: {
      type: Boolean,
      default: false
    },
    // Error, Info 등 타이틀
    title: {
        type: String,
        default: '알림'
    },
    // 출력될 메세지
    message: {
        type: String,
        default: '작업이 완료되었습니다.',
    },
    // 확인 버튼클릭 후 redirect될 경로
    // 없다면 ''
    path: {
        type: String,
        default: ''
    }
});


const emit = defineEmits(['close']);
const router = useRouter();

const confirmAction = () => {
    emit('close');
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

button {
  margin-top: 20px;
  padding: 10px 20px;
  color: #fff;
  font-weight: 700;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.error-btn {
  background-color: #F93A41 ;
}

.info-btn {
  background-color: #9A64E8;
}
</style>