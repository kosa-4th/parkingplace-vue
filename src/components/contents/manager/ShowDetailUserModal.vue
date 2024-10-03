<template>
  <div class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <h5 class="modal-title">사용자 상세 정보</h5>
        <button type="button" class="close" @click="$emit('close-modal')">×</button>
      </div>
      <div class="modal-body">
        <div v-if="!userData">로딩 중...</div>
        <div v-else>
          <p><strong>사용자 이름:</strong> {{ userData.userName }}</p>
          <p><strong>이메일:</strong> {{ userData.email }}</p>
          <div v-if="userData.auth==='ROLE_USER'">
            <!-- 차량 정보 출력 -->
            <div v-if="userData.plateInfoList && userData.plateInfoList.length">
              <h5>차량 정보</h5>
              <ul>
                <li v-for="(plate, index) in userData.plateInfoList" :key="index">
                  <p><strong>차량 번호:</strong> {{ plate.plateNumber }}</p>
                  <p><strong>차량 종류:</strong> {{ plate.carTypeEnum }}</p>
                </li>
              </ul>
            </div>
          </div>
          <div v-else-if="userData.auth==='ROLE_PARKING_MANAGER'">
            <!-- 주차장 정보 출력 (여러 개일 경우 반복문 처리) -->
            <div v-if="userData.parkingLots && userData.parkingLots.length">
              <h5>주차장 정보</h5>
              <ul>
                <li v-for="(lot, index) in userData.parkingLots" :key="index">
                  <p><strong>주차장 이름:</strong> {{ lot.name }}</p>
                  <p><strong>주소:</strong> {{ lot.address }}</p>
                </li>
              </ul>
            </div>
          </div>
          <div v-else>
            권한 없음
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="$emit('close-modal')">닫기</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    userId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      userData: null
    }
  },
  mounted() {
    // 사용자 데이터를 API로 불러오는 로직
    this.getUserData()
  },
  methods: {
    async getUserData() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/System-Manager/userDetailData/protected`, {
          params: {
            userId: this.userId
          }
        })
        this.userData = response.data[0]
        console.log(this.userData)
      } catch (error) {
        console.error('사용자 데이터를 불러오는 중 오류 발생:', error)
      }
    }
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
  background: rgba(0, 0, 0, 0.1); /* 어두운 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1049; /* 모달이 다른 요소 위에 있도록 */
}

.modal {
  display: block;
  position: fixed; /* 화면에 고정 */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* 정확한 가운데 정렬 */
  background: white;
  height: auto;
  padding: 30px;
  border-radius: 12px;
  width: 80%;
  max-width: 900px;
  z-index: 1050; /* 모달이 overlay 위에 오도록 z-index 설정 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 가벼운 그림자 */
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

.modal-text {
  font-size: 1rem;
  color: #333;
  margin-bottom: 20px;
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

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.btn-primary {
  background-color: #fd7e14;
  color: white;
}

.btn-primary:hover {
  background-color: #e76e0e;
}
</style>