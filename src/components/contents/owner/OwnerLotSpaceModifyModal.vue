<!--
@Author 김경민
@Date 2024.09.26
 OwnerLotCmp -> 모달로 분리
-->
<template>
    <div class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h5>주차 구역 수정</h5>
          <button type="button" class="close" @click="$emit('close-modal')">×</button>
        </div>
        <div class="modal-body">
          <div class="input-container">
            <label>구역명</label>
            <input v-model="editParkingSpace.spaceName" type="text" class="form-control" />
          </div>
          <div class="input-container">
            <label>주차 공간 수</label>
            <input v-model.number="editParkingSpace.availableSpaceNum" @input="filterInput" placeholder="숫자만 입력" class="form-control" />
          </div>
          <div class="input-container">
            <label>허용되는 차량 유형</label>
            <select v-model="editParkingSpace.carTypeId" class="form-control" style="appearance: auto">
              <option disabled value="">-- 차량종류 선택 --</option>

              <option v-for="(carType, index) in selectableCarTypes" :key="index" :value="carType.id">
                {{ carType.carTypeKor }}
              </option>
            </select>
          </div>
          <div class="input-container">
            <label>평일 가격</label>
            <input v-model.number="editParkingSpace.weekdaysPrice" @input="filterInput" placeholder="숫자만 입력" class="form-control" />
          </div>
          <div class="input-container">
            <label>평일 최대 가격</label>
            <input v-model.number="editParkingSpace.weekAllDayPrice" @input="filterInput" placeholder="숫자만 입력" class="form-control" />
          </div>
          <div class="input-container">
            <label>주말 가격</label>
            <input v-model.number="editParkingSpace.weekendPrice" @input="filterInput" placeholder="숫자만 입력" class="form-control" />
          </div>
          <div class="input-container">
            <label>주말 최대 가격</label>
            <input v-model.number="editParkingSpace.weekendAllDayPrice" @input="filterInput" placeholder="숫자만 입력" class="form-control" />
          </div>
          <div class="input-container">
            <label>부가 서비스 :</label>
            <div class="additional-services">
              <!-- 세차 서비스 -->
              <div class="service-container">
                <div class="service-row">
                  <input id="washService" v-model="editParkingSpace.washService" type="checkbox" class="" />
                  <label for="washService" class="service-label">세차</label>
                </div>
                <div v-if="editParkingSpace.washService" class="input-below">
                  <input v-model="editParkingSpace.washPrice" @input="filterInput" placeholder="세차 가격 입력" class="form-control price-input" />
                </div>
              </div>

              <!-- 차량 정비 서비스 -->
              <div class="service-container">
                <div class="service-row">
                  <input id="maintenanceService" v-model="editParkingSpace.maintenanceService" type="checkbox" class="" />
                  <label for="maintenanceService" class="service-label">차량정비</label>
                </div>
                <div v-if="editParkingSpace.maintenanceService" class="input-below">
                  <input v-model="editParkingSpace.maintenancePrice" @input="filterInput" placeholder="정비 가격 입력" class="form-control price-input" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-sm bg-green" @click="updateParkingSpace()">수정</button>
          <button class="btn btn-sm bg-light" @click="$emit('close-modal')">닫기</button>
        </div>
      </div>
    </div>
</template>
<script>

import axios from 'axios'

export default {
  props: ['parkingSpace', 'selectableCarTypes'], // 부모로부터 주차 공간 데이터와 차량 유형 전달
  data() {
    return {
      editParkingSpace: { ...this.parkingSpace } // 주차 공간 데이터를 복사해 편집
    }
  },
  methods: {
    // 숫자 입력 필터링 함수
    filterInput(field) {
      this.editParkingSpace[field] = this.editParkingSpace[field].replace(/\D/g, ''); // 숫자가 아닌 것은 제거
    },

    // 주차 구역 수정 메서드
    async updateParkingSpace() {
      const validateResult = this.validateParkingSpaceValues(this.editParkingSpace)
      if (validateResult !== null) {
        alert(validateResult)
        return
      }
      const parkingSpaceData = {
        parkingSpaceId: this.editParkingSpace.id,
        spaceName: this.editParkingSpace.spaceName,
        availableSpaceNum: this.editParkingSpace.availableSpaceNum,
        carTypeId: this.editParkingSpace.carTypeId,
        weekdaysPrice: this.editParkingSpace.weekdaysPrice,
        weekAllDayPrice: this.editParkingSpace.weekAllDayPrice,
        weekendPrice: this.editParkingSpace.weekendPrice,
        weekendAllDayPrice: this.editParkingSpace.weekendAllDayPrice,
        washService: this.editParkingSpace.washService,
        washPrice: this.editParkingSpace.washPrice,
        maintenanceService: this.editParkingSpace.maintenanceService,
        maintenancePrice: this.editParkingSpace.maintenancePrice
      };
      try {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/parking-manager/info/parkingArea/protected`, parkingSpaceData);
        alert('주차 구역이 성공적으로 수정되었습니다.');

        // 부모 컴포넌트로 이벤트 발행: 데이터 새로고침
        this.$emit('refreshData');

        // 부모 컴포넌트로 이벤트 발행: 모달 닫기
        this.$emit('close-modal');
      } catch (e) {
        // 에러 처리
        console.error(e);
        alert('수정 중 오류가 발생했습니다.');
      }
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
        newParkingSpace.weekAllDayPrice < 0
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
        newParkingSpace.weekendAllDayPrice < 0
      ) {
        return '주말 종일 요금을 올바르게 작성해주세요'
      }

      return null
    },
  },
  mounted() {
    // 컴포넌트가 마운트되었을 때 부모로부터 받은 값이 정상적으로 로드됐는지 확인
    if (!this.editParkingSpace.carTypeId) {
      this.editParkingSpace.carTypeId = ""; // 선택 안된 경우 기본값 설정
    }
  },
}
</script>
<style scoped>
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
</style>