<template>
  <div v-if="isOpen" class="modal">
    <div class="modal-content">
      <span class="close-btn" @click="close">&times;</span>
      <h2>결제 모달 창</h2>
      <p>여기에 결제와 관련된 내용이 표시됩니다.</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ['isOpen'], // 부모로부터 모달 창 열림 여부 받음
  methods: {
    close() {
      // 부모 컴포넌트로 close 이벤트를 보냄
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 24px;
}
</style>