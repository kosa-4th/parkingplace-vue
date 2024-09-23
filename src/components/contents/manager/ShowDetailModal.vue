<template>
  <div class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <h5 class="modal-title">사용자 상세 정보</h5>
        <button type="button" class="close" @click="$emit('close-modal')">×</button>
      </div>
      <div class="modal-body">
        <p><strong>사용자 ID:</strong> {{ userId }}</p>
        <p v-if="!userData">로딩 중...</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="$emit('close-modal')">닫기</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    userId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      userData: null, // 사용자 데이터 저장
    };
  },
  mounted() {
    // 사용자 데이터를 API로 불러오는 로직
    this.fetchUserData(this.userId);
  },
  methods: {
    async fetchUserData(userId) {
      // 여기에 실제 API 요청 코드를 추가하여 사용자 데이터를 가져옴
      // 임시로 데이터를 콘솔에 출력하거나 가짜 데이터를 설정할 수 있습니다.
      console.log("Fetching data for user:", userId);

      // 예시 API 요청 코드 (실제 사용 시 axios 같은 라이브러리 사용)
      try {
        // 가짜 데이터 예시
        this.userData = {
          email: "testuser@example.com",
          userName: "홍길동",
        };

        // 실제 API 요청 예시 (axios 필요)
        // const response = await axios.get(`/api/users/${userId}`);
        // this.userData = response.data;
      } catch (error) {
        console.error("사용자 데이터를 불러오는 중 오류 발생:", error);
      }
    }
  }
};
</script>

<style scoped>
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
  z-index: 3000; /* 모달이 다른 요소 위에 있도록 */
}

.modal {
  background: pink;
  padding: 20px;
  border-radius: 12px;
  width: 80%;
  max-width: 900px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 가벼운 그림자 */
  z-index: 3001; /* 모달이 overlay 위에 오도록 z-index 설정 */
  animation: fadeIn 0.3s ease; /* 부드러운 모달 애니메이션 */
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 10px;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.modal-body {
  padding: 20px 0;
}

.modal-footer {
  text-align: right;
  border-top: 1px solid #dee2e6;
  padding-top: 10px;
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

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>