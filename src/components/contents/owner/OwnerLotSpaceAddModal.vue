<!--
@Author 김경민
@Date 2024.09.25
 OwnerLotCmp -> 모달로 분리
-->
<template>
  <div class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <h5>새로운 주차 구역 추가</h5>
        <button type="button" class="close" @click="$emit('close-modal')">×</button>
      </div>
      <div class="modal-body">
        <div class="input-container">
          <label>구역명</label>
          <input v-model="newParkingSpace.spaceName" type="text" class="form-control" />
        </div>
        <div class="input-container">
          <label>주차 공간 수</label>
          <input v-model.number="newParkingSpace.availableSpaceNum" @input="filterInput" placeholder="숫자만 입력"
                 class="form-control" />
        </div>
        <div class="input-container">
          <label>허용되는 차량 유형</label>
          <select v-model="newParkingSpace.carTypeId" class="form-control" style="appearance: auto">
            <!-- 기본 옵션 추가 -->
            <option disabled value="">-- 차량종류 선택 --</option>
            <option v-for="(carType, index) in selectableCarTypes" :key="index" :value="carType.id">
              {{ carType.carTypeKor }}
            </option>
          </select>
        </div>
        <div class="input-container">
          <label>평일 가격</label>
          <input v-model.number="newParkingSpace.weekdaysPrice" @input="filterInput" placeholder="숫자만 입력"
                 class="form-control" />
        </div>
        <div class="input-container">
          <label>평일 최대 가격</label>
          <input v-model.number="newParkingSpace.weekAllDayPrice" @input="filterInput" placeholder="숫자만 입력"
                 class="form-control" />
        </div>
        <div class="input-container">
          <label>주말 가격</label>
          <input v-model.number="newParkingSpace.weekendPrice" @input="filterInput" placeholder="숫자만 입력"
                 class="form-control" />
        </div>
        <div class="input-container">
          <label>주말 최대 가격</label>
          <input v-model.number="newParkingSpace.weekendAllDayPrice" @input="filterInput" placeholder="숫자만 입력"
                 class="form-control" />
        </div>
        <div class="input-container">
          <label>부가 서비스 :</label>
          <div class="additional-services">
            <!-- 세차 서비스 -->
            <div class="service-container">
              <div class="service-row">
                <input
                  id="washService"
                  v-model="newParkingSpace.washService"
                  type="checkbox"
                  class=""
                />
                <label for="washService" class="service-label">세차</label>
              </div>
              <div v-if="newParkingSpace.washService" class="input-below">
                <input
                  v-model="newParkingSpace.washPrice"
                  @input="filterInput"
                  placeholder="세차 가격 입력"
                  class="form-control price-input"
                />
              </div>
            </div>

            <!-- 차량 정비 서비스 -->
            <div class="service-container">
              <div class="service-row">
                <input
                  id="maintenanceService"
                  v-model="newParkingSpace.maintenanceService"
                  type="checkbox"
                  class=""
                />
                <label for="maintenanceService" class="service-label">차량정비</label>
              </div>
              <div v-if="newParkingSpace.maintenanceService" class="input-below">
                <input
                  v-model="newParkingSpace.maintenancePrice"
                  @input="filterInput"
                  placeholder="정비 가격 입력"
                  class="form-control price-input"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-sm bg-green" @click="addParkingSpace()">등록</button>
        <button class="btn btn-sm bg-light " @click="$emit('close-modal')">닫기</button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  props: ['selectedLotId', 'selectableCarTypes'], // 부모로부터 받은 props
  data() {
    return {
      newParkingSpace: {
        parkingLotId: this.selectedLotId,
        spaceName: '',
        availableSpaceNum: 0,
        carTypeId: "",
        weekdaysPrice: 0,
        weekAllDayPrice: 0,
        weekendPrice: 0,
        weekendAllDayPrice: 0,
        washService: false,
        washPrice: null,
        maintenanceService: false,
        maintenancePrice: null
      }
    }
  },
  methods: {
    filterInput(field) {
      // 숫자 필드에만 적용하도록 수정
      this.newParkingSpace[field] = this.newParkingSpace[field].replace(/\D/g, '') // 숫자가 아닌 것은 제거
    },
    async addParkingSpace() {
      const validateResult = this.validateInsertParkingSpace(this.newParkingSpace)
      if (validateResult !== null) {
        alert(validateResult)
        return
      }
      try {
        console.log(this.newParkingSpace)
        await axios.post('/api/parking-manager/info/parkingArea/protected', this.newParkingSpace)
        alert('주차구역이 추가되었습니다.')
        alert('새로운 주차장이 성공적으로 등록되었습니다.')
        this.$emit('refreshData')
        this.$emit('close-modal')
      } catch (e) {
        alert(e)
      }
    },
    validateInsertParkingSpace(newParkingSpace) {
      if (!newParkingSpace.parkingLotId || isNaN(newParkingSpace.parkingLotId)) {
        return '주차장 ID가 올바르지 않습니다'
      }
      return this.validateParkingSpaceValues(newParkingSpace)
    },

    validateParkingSpaceValues(newParkingSpace) {
      if (!newParkingSpace.spaceName || typeof newParkingSpace.spaceName !== 'string') {
        return '주차 구역명을 입력해주세요'
      }

      if (
        newParkingSpace.availableSpaceNum === null ||
        isNaN(newParkingSpace.availableSpaceNum) ||
        newParkingSpace.availableSpaceNum <= 0
      ) {
        return '주차 공간 수를 올바르게 작성해주세요'
      }

      if (!newParkingSpace.carTypeId || isNaN(newParkingSpace.carTypeId)) {
        return '차종 ID를 선택해주세요'
      }

      if (
        newParkingSpace.weekdaysPrice === null ||
        isNaN(newParkingSpace.weekdaysPrice) ||
        newParkingSpace.weekdaysPrice <= 0
      ) {
        return '평일 요금을 올바르게 작성해주세요'
      }
      if (
        newParkingSpace.weekAllDayPrice === null ||
        isNaN(newParkingSpace.weekAllDayPrice) ||
        newParkingSpace.weekAllDayPrice <= 0
      ) {
        return '평일 종일 요금을 올바르게 작성해주세요'
      }
      if (
        newParkingSpace.weekendPrice === null ||
        isNaN(newParkingSpace.weekendPrice) ||
        newParkingSpace.weekendPrice <= 0
      ) {
        return '주말 요금을 올바르게 작성해주세요'
      }
      if (
        newParkingSpace.weekendAllDayPrice === null ||
        isNaN(newParkingSpace.weekendAllDayPrice) ||
        newParkingSpace.weekendAllDayPrice <= 0
      ) {
        return '주말 종일 요금을 올바르게 작성해주세요'
      }

      if (newParkingSpace.washService === null || typeof newParkingSpace.washService !== 'boolean') {
        return '세차 서비스 지원 여부를 선택해주세요'
      }



      if (
        newParkingSpace.maintenanceService === null ||
        typeof newParkingSpace.maintenanceService !== 'boolean'
      ) {
        return '정비 서비스 지원 여부를 선택해주세요'
      }

      return null
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


.modal-body {
  padding: 20px 0;
  overflow-y: auto;
  max-height: 500px;
}

.modal-footer {
  text-align: right;
  height: 50px;
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
  background-color: #9A64E8; /* 기본 보라색 */
  color: white;
}

.bg-purple:hover {
  background-color: #9A64E8; /* hover 상태에서도 기본 색상 유지 */
  color: white; /* hover 상태에서 텍스트 색상 유지 */
}

/* 초록색 버튼 */
.bg-green {
  background-color: #76D672; /* 기본 초록색 */
  color: white;
}

.bg-green:hover {
  background-color: #76D672; /* hover 상태에서도 기본 색상 유지 */
  color: white; /* hover 상태에서 텍스트 색상 유지 */
}

/* 빨간색 버튼 */
.bg-red {
  background-color: #F93A41; /* 기본 빨간색 */
  color: white;
}

.bg-red:hover {
  background-color: #F93A41; /* hover 상태에서도 기본 색상 유지 */
  color: white; /* hover 상태에서 텍스트 색상 유지 */
}

/* 연보라색 버튼 */
.bg-light-purple {
  background-color: #F0E5FF; /* 기본 연보라색 */
  color: black;
}

.bg-light-purple:hover {
  background-color: #F0E5FF; /* hover 상태에서도 기본 색상 유지 */
  color: black; /* hover 상태에서 텍스트 색상 유지 */
}

</style>