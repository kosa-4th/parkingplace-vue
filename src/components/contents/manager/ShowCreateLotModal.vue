<template>
  <div class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <h5>새로운 주차장 등록</h5>
        <button type="button" class="close" @click="$emit('close-modal')">×</button>
      </div>
      <div class="modal-body">
        <!-- 한 줄로 정렬된 입력 필드와 레이블 -->
        <div class="input-container">
          <label><strong>주차장 이름:</strong></label>
          <input v-model="editableLotData.name" class="form-control" placeholder="주차장 이름 입력" />
        </div>

        <div class="input-container">
          <label><strong>주소:</strong></label>
          <input v-model="editableLotData.address" class="form-control" placeholder="주소 입력" />
        </div>

        <div class="input-container">
          <label><strong>전화번호:</strong></label>
          <input v-model="editableLotData.tel" class="form-control" placeholder="전화번호 입력" />
        </div>

        <div class="input-container">
          <label><strong>주차장 타입:</strong></label>
          <input v-model="editableLotData.parkingType" class="form-control" placeholder="주차장 타입 입력" />
        </div>

        <div class="input-container">
          <label><strong>위도:</strong></label>
          <input v-model="editableLotData.latitude" class="form-control" placeholder="위도 입력" />
        </div>

        <div class="input-container">
          <label><strong>경도:</strong></label>
          <input v-model="editableLotData.longitude" class="form-control" placeholder="경도 입력" />
        </div>

        <!-- 시간 입력 필드도 한 줄로 정렬 -->
        <div class="input-container">
          <label><strong>주중 Open:</strong></label>
          <TimePicker
            v-model="editableLotData.weekdaysOpenTime"
            format="HH:mm"
            is24hr
            :step="1800"
            :manual-input="true"
          />
          <label><strong>주중 Close:</strong></label>
          <TimePicker
            v-model="editableLotData.weekdaysCloseTime"
            format="HH:mm"
            is24hr
            :step="1800"
            :manual-input="true"
          />
        </div>

        <div class="input-container">
          <label><strong>주말 Open:</strong></label>
          <TimePicker
            v-model="editableLotData.weekendOpenTime"
            format="HH:mm"
            is24hr
            :step="1800"
            :manual-input="true"
          />
          <label><strong>주말 Close:</strong></label>
          <TimePicker
            v-model="editableLotData.weekendCloseTime"
            format="HH:mm"
            is24hr
            :step="1800"
            :manual-input="true"
          />
        </div>

        <div class="input-container">
          <label><strong>부가 서비스 :</strong></label>
          <div class="checkbox-container">
            <!-- 세차 서비스 체크박스 -->
            <label><strong>세차 서비스 - </strong>
              <input type="checkbox" v-model="editableLotData.wash" :true-value="'Y'" :false-value="'N'" />
            </label>

            <!-- 정비 서비스 체크박스 -->
            <label><strong>기본 정비 - </strong>
              <input type="checkbox" v-model="editableLotData.maintenance" :true-value="'Y'" :false-value="'N'" />
            </label>
          </div>
        </div>
        <!-- 관리자 이메일 -->
        <div class="input-container">
          <label><strong>관리자 이메일:</strong></label>
          <input v-model="editableLotData.user.email" class="form-control" placeholder="관리자 이메일 입력" />
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary btn-sm " @click="createNewParkingLot">등록</button>
        <button class="btn btn-secondary btn-sm " @click="$emit('close-modal')">닫기</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import TimePicker from 'vue3-timepicker'

export default {
  components: { TimePicker },
  data() {
    return {
      editableLotData: {
        name: '',
        address: '',
        tel: '',
        parkingType: '',
        latitude: '',
        longitude: '',
        weekdaysOpenTime: '',
        weekdaysCloseTime: '',
        weekendOpenTime: '',
        weekendCloseTime: '',
        wash: 'N',
        maintenance: 'N',
        user: {
          email: ''
        }
      }
    }
  },
  methods: {
    async createNewParkingLot() {
      try {
        // POST 요청으로 새로운 주차장 데이터를 생성
        const response = await axios.post('/api/System-Manager/parkingLotData/create/protected', {
          name: this.editableLotData.name,
          address: this.editableLotData.address,
          tel: this.editableLotData.tel,
          parkingType: this.editableLotData.parkingType,
          latitude: this.editableLotData.latitude,
          longitude: this.editableLotData.longitude,
          weekdaysOpenTime: this.editableLotData.weekdaysOpenTime,
          weekdaysCloseTime: this.editableLotData.weekdaysCloseTime,
          weekendOpenTime: this.editableLotData.weekendOpenTime,
          weekendCloseTime: this.editableLotData.weekendCloseTime,
          wash: this.editableLotData.wash,
          maintenance: this.editableLotData.maintenance,
          userEmail: this.editableLotData.user.email
        })

        // 요청 성공 시 처리
        if (response.status === 200) {
          alert('새로운 주차장이 성공적으로 등록되었습니다.')
          this.$emit('refreshData')
          this.$emit('close-modal')
        } else {
          alert('주차장 등록에 실패했습니다.')
        }
      } catch (error) {
        alert(error.response.data.message)

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
  height: 700px;
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


.modal-body {
  padding: 20px 0;
  overflow-y: auto;
  max-height: 500px;
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

.input-container, .checkbox-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.input-container label {
  min-width: 150px; /* 레이블의 최소 너비 설정 */
  margin-right: 10px; /* 레이블과 입력 필드 사이의 간격 */
}

.input-container input,
.input-container p {
  flex: 1; /* 입력 필드나 텍스트가 공간을 적절히 차지하게 함 */
}


</style>