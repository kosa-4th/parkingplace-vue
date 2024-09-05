<template>
  <!-- 
    작성자: 오지수
    모달 페이지 
  -->
  <div class="modal-overlay">
    <div class="modal-container">
        <h2>{{ title }}</h2>
        <p>{{ message }}</p>
        <button @click="confirm">확인</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
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
        default: '/'
    }
});


const emit = defineEmits(['close']);
const router = useRouter();

const confirm = () => {
    emit('close');
    if (props.path !== '') {
      router.push(props.path);
    }
}
</script>

<style scoped>
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
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #a371ea;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>