<template>
  <div class="parking-lot-management">
    <h1 id="description"><b>주차장 관리</b></h1>

    <!-- 주차장 정보 입력 섹션 -->
    <div class="parking-info">
      <!-- 주차장명 입력 -->
      <div class="input-group">
        <label>주차장명</label>
        <input v-model="parkingLot.name" type="text" readonly />
      </div>
      <!-- 주소 입력 -->
      <div class="input-group">
        <label>주소</label>
        <input v-model="parkingLot.address" type="text" disabled />
      </div>
      <!-- 연락처 입력 -->
      <div class="input-group">
        <label>연락처</label>
        <input v-model="parkingLot.tel" type="text" readonly />
      </div>
      <!-- 평일 영업시간 입력 -->
      <div class="input-group">
        <label>평일 영업시간</label>
        <input v-model="parkingLot.weekdaysOpenTime" type="time" readonly />
        <input v-model="parkingLot.weekdaysCloseTime" type="time" readonly />
      </div>
      <!-- 주말 영업시간 입력 -->
      <div class="input-group">
        <label>주말 영업시간</label>
        <input v-model="parkingLot.weekendOpenTime" type="time" readonly />
        <input v-model="parkingLot.weekendCloseTime" type="time" readonly />
      </div>
      <div class="input-group">
        <label>이미지</label>
        <input type="file" multiple @change="onFileChange" ref="fileInput" readonly />
      </div>

      <!-- 이미지 미리보기 -->
      <div class="image-preview">
        <div v-for="(image, index) in imagePreviews" :key="index" class="img-wrapper">
          <img :src="image" alt="uploaded image" class="uploaded-img" />
          <button class="remove-btn" @click="removeImage(index)">x</button>
          <!-- x 아이콘 추가 -->
        </div>
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
import axios from 'axios'
import { AuthStore } from '@/stores/store'

export default {
  components: {
    ParkingZoneTable // 주차 구역 테이블 컴포넌트
  },
  props: ['selectedLotId'],
  data() {
    return {
      authStore: AuthStore(),
      parkingLot: {
        name: '',
        address: '',
        tel: '',
        weekdaysOpenTime: '',
        weekdaysCloseTime: '',
        weekendOpenTime: '',
        weekendCloseTime: '',
        parkingSpaces: []
      },
      newZone: {
        name: '',
        capacity: 0,
        vehicleType: '',
        weekdayPrice: 0,
        weekendPrice: 0,
        washService: false,
        maintenanceService: false
      },
      selectedZone: null,
      showAddZoneForm: false,
      imagePreviews: [],
      files: []
    }
  },
  methods: {
    async getParkingLotDetail() {
      await axios({
        method: 'get',
        url: `/api/parkinglots/${this.selectedLotId}/owner/protected`,
        headers: {
          Authorization: `Bearer ${this.authStore.token}`,
          'Content-Type': 'application/json'
        }
      })
        .then((response) => {
          this.parkingLot = response.data
        })
        .catch(function (e) {
          alert(e)
        })
    },
    toggleAddZoneForm() {
      this.showAddZoneForm = !this.showAddZoneForm
    },
    addZone() {
      if (!this.newZone.name || this.newZone.capacity <= 0 || !this.newZone.vehicleType) {
        alert('모든 필드를 올바르게 입력하세요.')
        return
      }

      this.parkingLot.zones.push({ ...this.newZone })
      this.resetNewZone()
      this.showAddZoneForm = false
    },
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
    editZone(index) {
      this.selectedZone = { ...this.parkingLot.zones[index], index }
    },
    saveZone() {
      if (this.selectedZone !== null) {
        const index = this.selectedZone.index
        this.parkingLot.zones[index] = { ...this.selectedZone }
        this.selectedZone = null
      }
    },
    cancelEdit() {
      this.selectedZone = null
    },
    deleteZone(index) {
      this.parkingLot.zones.splice(index, 1)
    },
    onFileChange(event) {
      const files = Array.from(event.target.files) // 파일 리스트를 배열로 변환
      files.forEach((file) => {
        this.files.push(file) // 파일 저장
        this.imagePreviews.push(URL.createObjectURL(file)) // 미리보기 URL 저장
      })
    },
    removeImage(index) {
      this.imagePreviews.splice(index, 1) // 미리보기에서 이미지 삭제
      this.files.splice(index, 1) // 파일 배열에서 해당 파일 삭제

      // 새로운 FileList 객체 생성
      const dataTransfer = new DataTransfer()
      this.files.forEach((file) => dataTransfer.items.add(file)) // 남은 파일 추가

      // input 요소에 새로운 FileList 적용
      this.$refs.fileInput.files = dataTransfer.files
    }
  },
  mounted() {
    this.getParkingLotDetail()
  },
  watch: {
    selectedLotId() {
      this.getParkingLotDetail(this.selectedLotId)
    }
  }
}
</script>

<style scoped>
.no-update {
  background-color: lightgray;
}

#description {
  font-size: 22px;
  text-align: left;
  margin-bottom: 30px;
}

.font-large {
  font-size: 22px;
}

.parking-lot-management {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1,
h3 {
  text-align: center;
  color: #333;
}

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

input[type='checkbox'] {
  margin-left: 10px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button.btn-toggle {
  background-color: #007bff;
  color: white;
}

button.btn-toggle:hover {
  background-color: #0056b3;
}

button.btn-add,
button.btn-save,
button.btn-cancel {
  color: white;
}

button.btn-add {
  background-color: #007bff;
}

button.btn-add:hover {
  background-color: #0056b3;
}

button.btn-save {
  background-color: #007bff;
}

button.btn-save:hover {
  background-color: #0056b3;
}

button.btn-cancel {
  background-color: #dc3545;
}

button.btn-cancel:hover {
  background-color: #c82333;
}

.add-zone-form,
.edit-zone-form {
  margin-top: 30px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
}

.image-preview {
  display: flex;
  gap: 10px;
}

.img-wrapper {
  position: relative;
  border: 1px solid #000;
  padding: 10px;
}

.uploaded-img {
  max-width: 100px;
  max-height: 100px;
}

.remove-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: #9a64e8;
  color: white;
  border: none;
  width: 20px;
  height: 20px;
  font-size: 12px;
  cursor: pointer;
  padding: 2px;
  border-radius: 50%;
}
</style>
