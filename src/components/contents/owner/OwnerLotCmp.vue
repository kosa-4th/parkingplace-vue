<template>
  <div class="parking-lot-management">
    <h1>주차장 관리</h1>

    <!-- 주차장 정보 입력 섹션 -->
    <div class="parking-info">
      <h3>주차장 정보</h3>
      <!-- 주차장명 입력 -->
      <div class="input-group">
        <label>주차장명</label>
        <input v-model="parkingLot.name" type="text" />
      </div>
      <!-- 주소 입력 -->
      <div class="input-group">
        <label>주소</label>
        <input v-model="parkingLot.address" type="text" />
      </div>
      <!-- 연락처 입력 -->
      <div class="input-group">
        <label>연락처</label>
        <input v-model="parkingLot.contact" type="text" />
      </div>
      <!-- 평일 영업시간 입력 -->
      <div class="input-group">
        <label>평일 영업시간</label>
        <input v-model="parkingLot.weekdayHoursStart" type="time" />
        <input v-model="parkingLot.weekdayHoursEnd" type="time" />
      </div>
      <!-- 주말 영업시간 입력 -->
      <div class="input-group">
        <label>주말 영업시간</label>
        <input v-model="parkingLot.weekendHoursStart" type="time" />
        <input v-model="parkingLot.weekendHoursEnd" type="time" />
      </div>
    </div>

    <!-- 구역 추가 버튼 (구역 추가 폼을 표시/숨기기) -->
    <button class="btn btn-toggle" @click="toggleAddZoneForm">
      {{ showAddZoneForm ? '구역 추가 숨기기' : '구역 추가하기' }}
    </button>

    <!-- 주차 구역 추가 폼 (버튼 클릭 시 표시) -->
    <div v-if="showAddZoneForm" class="add-zone-form">
      <h3>새로운 주차 구역 추가</h3>
      <!-- 구역 이름 입력 -->
      <div class="input-group">
        <label>구역 이름</label>
        <input v-model="newZone.name" type="text" />
      </div>
      <!-- 용량 입력 -->
      <div class="input-group">
        <label>용량</label>
        <input v-model.number="newZone.capacity" type="number" />
      </div>
      <!-- 차량 유형 입력 -->
      <div class="input-group">
        <label>차량 유형</label>
        <input v-model="newZone.vehicleType" type="text" />
      </div>
      <!-- 평일 가격 입력 -->
      <div class="input-group">
        <label>평일 가격</label>
        <input v-model.number="newZone.weekdayPrice" type="number" />
      </div>
      <!-- 주말 가격 입력 -->
      <div class="input-group">
        <label>주말 가격</label>
        <input v-model.number="newZone.weekendPrice" type="number" />
      </div>
      <!-- 세차 서비스 여부 체크 -->
      <div class="input-group">
        <label>세차 서비스</label>
        <input v-model="newZone.washService" type="checkbox" />
      </div>
      <!-- 유지보수 서비스 여부 체크 -->
      <div class="input-group">
        <label>유지보수 서비스</label>
        <input v-model="newZone.maintenanceService" type="checkbox" />
      </div>
      <!-- 구역 추가 버튼 -->
      <button class="btn btn-add" @click="addZone">구역 추가</button>
    </div>

    <!-- 주차 구역 정보 컴포넌트 사용 -->
    <ParkingZoneTable :zones="parkingLot.zones" @edit-zone="editZone" @delete-zone="deleteZone" />

    <!-- 주차 구역 수정 폼 (존을 선택한 경우에만 표시) -->
    <div v-if="selectedZone !== null" class="edit-zone-form">
      <h3>{{ selectedZone.name }} 구역 수정</h3>
      <!-- 주차 가능 대수 수정 -->
      <div class="input-group">
        <label>주차 가능 대수</label>
        <input v-model.number="selectedZone.capacity" type="number" />
      </div>
      <!-- 차량 유형 수정 -->
      <div class="input-group">
        <label>차량 유형</label>
        <input v-model="selectedZone.vehicleType" type="text" />
      </div>
      <!-- 평일 가격 수정 -->
      <div class="input-group">
        <label>평일 가격</label>
        <input v-model="selectedZone.weekdayPrice" type="number" />
      </div>
      <!-- 주말 가격 수정 -->
      <div class="input-group">
        <label>주말 가격</label>
        <input v-model="selectedZone.weekendPrice" type="number" />
      </div>
      <!-- 저장 버튼 -->
      <button class="btn btn-save" @click="saveZone">저장</button>
      <!-- 취소 버튼 -->
      <button class="btn btn-cancel" @click="cancelEdit">취소</button>
    </div>
  </div>
</template>

<script>
import ParkingZoneTable from './ParkingZoneTable.vue'

export default {
  components: {
    ParkingZoneTable // 주차 구역 테이블 컴포넌트
  },
  data() {
    return {
      // 주차장 정보 및 기본값 설정
      parkingLot: {
        name: '혜화 주차장',
        address: '서울시 용산구 명륜동',
        contact: '010-1234-5678',
        weekdayHoursStart: '00:00',
        weekdayHoursEnd: '24:00',
        weekendHoursStart: '02:00',
        weekendHoursEnd: '24:00',
        zones: [
          // 주차 구역 초기값
          {
            name: 'A',
            capacity: 5,
            vehicleType: '모든 차량',
            weekdayPrice: 3000,
            weekendPrice: 4000,
            washService: true,
            maintenanceService: true
          },
          {
            name: 'B',
            capacity: 2,
            vehicleType: '전기차',
            weekdayPrice: 2000,
            weekendPrice: 2500,
            washService: false,
            maintenanceService: false
          },
          {
            name: 'C',
            capacity: 2,
            vehicleType: '경차',
            weekdayPrice: 1500,
            weekendPrice: 2000,
            washService: false,
            maintenanceService: false
          }
        ]
      },
      newZone: {
        // 새로운 구역을 추가할 때 사용하는 초기값
        name: '',
        capacity: 0,
        vehicleType: '',
        weekdayPrice: 0,
        weekendPrice: 0,
        washService: false,
        maintenanceService: false
      },
      selectedZone: null, // 수정 중인 구역 정보를 저장
      showAddZoneForm: false // 구역 추가 폼 표시 여부 관리
    }
  },
  methods: {
    // 구역 추가 폼 토글 함수 (표시/숨기기)
    toggleAddZoneForm() {
      this.showAddZoneForm = !this.showAddZoneForm // 폼을 표시하거나 숨김
    },
    // 새로운 주차 구역 추가 함수
    addZone() {
      // 유효성 검사: 구역 이름, 용량, 차량 유형이 올바르게 입력되었는지 확인
      if (!this.newZone.name || this.newZone.capacity <= 0 || !this.newZone.vehicleType) {
        alert('모든 필드를 올바르게 입력하세요.')
        return
      }

      // 새로운 구역 추가
      this.parkingLot.zones.push({ ...this.newZone }) // 새로운 구역을 배열에 추가
      this.resetNewZone() // 폼 초기화
      this.showAddZoneForm = false // 폼 숨기기
    },
    // 입력 필드 초기화 함수
    resetNewZone() {
      this.newZone = {
        name: '',
        capacity: 0,
        vehicleType: '',
        weekdayPrice: 0,
        weekendPrice: 0,
        washService: false,
        maintenanceService: false
      }
    },
    // 선택된 주차 구역 수정 함수
    editZone(index) {
      this.selectedZone = { ...this.parkingLot.zones[index], index } // 선택된 구역 정보를 저장
    },
    // 수정된 구역 정보 저장
    saveZone() {
      if (this.selectedZone !== null) {
        const index = this.selectedZone.index
        this.parkingLot.zones[index] = { ...this.selectedZone } // 수정된 구역 정보를 원본에 반영
        this.selectedZone = null // 수정 후 초기화
      }
    },
    // 수정 취소 함수
    cancelEdit() {
      this.selectedZone = null // 수정 취소 시 선택된 구역 초기화
    },
    // 주차 구역 삭제 함수
    deleteZone(index) {
      this.parkingLot.zones.splice(index, 1) // 선택한 구역을 배열에서 삭제
    }
  }
}
</script>

<style scoped>
/* 전체 레이아웃 설정 */
.parking-lot-management {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background-color: #f5f7fa;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* 제목 스타일 */
h1,
h3 {
  text-align: center;
  color: #333;
}

/* 입력 그룹 설정: 주차장 정보 및 구역 추가 폼 */
.input-group {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

label {
  display: inline-block;
  width: 120px;
  font-weight: bold;
  color: #555;
}

/* 텍스트 및 숫자 입력 필드 스타일 */
input[type='text'],
input[type='time'],
input[type='number'] {
  width: 100%;
  max-width: 250px;
  padding: 8px;
  border: 1px solid #d1d9e6;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: #fff;
  color: #333;
}

/* 체크박스 스타일 */
input[type='checkbox'] {
  margin-left: 10px;
}

/* 버튼 스타일 */
button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

/* 구역 추가 토글 버튼 스타일 */
button.btn-toggle {
  background-color: #007bff;
  color: white;
}

button.btn-toggle:hover {
  background-color: #0056b3;
}

/* 구역 추가, 저장, 취소 버튼 스타일 */
/* 구역 추가, 저장, 취소 버튼 스타일 */
button.btn-add,
button.btn-save,
button.btn-cancel {
  color: white;
}

/* 버튼 배경색을 파란색 계열로 통일 */
button.btn-add {
  background-color: #007bff; /* 파란색으로 변경 */
}

button.btn-add:hover {
  background-color: #0056b3; /* 호버 시 진한 파란색 */
}

button.btn-save {
  background-color: #007bff; /* 파란색으로 통일 */
}

button.btn-save:hover {
  background-color: #0056b3; /* 호버 시 진한 파란색 */
}

button.btn-cancel {
  background-color: #dc3545; /* 취소 버튼은 빨간색 유지 */
}

button.btn-cancel:hover {
  background-color: #c82333; /* 호버 시 더 진한 빨간색 */
}

/* 주차 구역 추가 및 수정 폼 간격 및 스타일 */
.add-zone-form,
.edit-zone-form {
  margin-top: 30px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
}
</style>
