<!-- 
 담당자: 양건모
 시작 일자: 2024.09.10
 설명 : 주차장, 주차구역 정보 확인 및 수정 컴포넌트
 ---------------------
 2024.09.11 김찬희 | 대략적 UI 구현
 2024.09.18 양건모 | 주차장 정보 조회
 2024.09.19 양건모 | 주차장 기본 정보 수정, 이미지 조회 및 추가
 2024.09.20 양건모 | 등록된 이미지 삭제 및 버그 수정
 -->
<template>
  <div class="parking-lot-management">
    <h1 id="description"><b>주차장 관리</b></h1>

    <div id="modify-box">
      <button v-if="!modifying" @click="modifyOn()">수정</button>
      <button v-if="modifying" @click="modifyCancel()">취소</button>
      <button v-if="modifying" @click="modifyComplete()">완료</button>
    </div>
    <div class="parking-info">
      <!-- 주차장명 입력 -->
      <div class="input-group">
        <label>주차장명</label>
        <input
          id="name"
          v-model="parkingLot.name"
          type="text"
          class="lot-modify-able"
          :readonly="!modifying"
        />
      </div>
      <!-- 주소 입력 -->
      <div class="input-group">
        <label>주소</label>
        <input id="address" v-model="parkingLot.address" type="text" disabled />
      </div>
      <!-- 연락처 입력 -->
      <div class="input-group">
        <label>연락처</label>
        <input
          id="tel"
          v-model="parkingLot.tel"
          type="text"
          class="lot-modify-able"
          :readonly="!modifying"
        />
      </div>
      <!-- 평일 영업시간 입력 -->
      <div class="input-group">
        <label>평일 영업시간</label>
        <input
          id="weekdaysOpenTime"
          v-model="parkingLot.weekdaysOpenTime"
          type="time"
          class="lot-modify-able time"
          :readonly="!modifying"
        />
        <input
          id="weekdaysCloseTime"
          v-model="parkingLot.weekdaysCloseTime"
          type="time"
          class="lot-modify-able time"
          :disabled="!modifying"
        />
      </div>
      <!-- 주말 영업시간 입력 -->
      <div class="input-group">
        <label>주말 영업시간</label>
        <input
          id="weekendOpenTime"
          v-model="parkingLot.weekendOpenTime"
          type="time"
          class="lot-modify-able time"
          :readonly="!modifying"
        />
        <input
          id="weekendCloseTime"
          v-model="parkingLot.weekendCloseTime"
          type="time"
          class="lot-modify-able time"
          :readonly="!modifying"
        />
      </div>

      <div class="image-preview">
        <label>이미지</label>
        <div v-for="(image, idx) in parkingLot.images" :key="idx">
          <img
            :id="`image-${image.id}`"
            src="../../../assets/img/tempLot.png"
            class="uploaded-img"
            @click="addDeleteImgList(image.id)"
          />
        </div>
      </div>

      <div class="input-group" :hidden="!modifying">
        <label>이미지 추가</label>
        <input
          id="images"
          type="file"
          multiple
          @change="onFileChange"
          ref="fileInput"
          class="lot-modify-able"
          :disabled="!modifying"
        />
      </div>

      <!-- 이미지 미리보기 -->
      <div class="image-preview">
        <div v-for="(image, index) in imagePreviews" :key="index" class="img-wrapper">
          <img :src="image" alt="uploaded image" class="uploaded-img" />
          <button class="remove-btn" @click="removeImage(index)">x</button>
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
    <div>
      <h3>주차 구역 정보</h3>
      <!-- 주차 구역 정보를 표시하는 테이블 -->
      <table>
        <thead>
          <tr>
            <!-- 테이블 헤더 -->
            <th>구역명</th>
            <th>주차 가능 대수</th>
            <th>차종</th>
            <th>평일 요금</th>
            <th>평일 최대</th>
            <th>주말 요금</th>
            <th>주말 최대</th>
            <th>세차 요금</th>
            <th>정비 요금</th>
            <th>수정</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          <!-- 테이블 바디: 각 구역 정보 출력 -->
          <tr v-for="(space, index) in parkingLot.parkingSpaces" :key="index">
            <td>{{ space.name ? space.name : '이름 없음' }}</td>
            <td>{{ space.availableSpaceNum }}</td>
            <td>{{ space.carType }}</td>
            <td>{{ space.weekdaysPrice }}</td>
            <td>{{ space.weekAllDayPrice }}</td>
            <td>{{ space.weekendPrice }}</td>
            <td>{{ space.weekendAllDayPrice }}</td>
            <td>{{ space.washPrice ? space.washPrice : 'X' }}</td>
            <td>{{ space.maintenancePrice ? space.maintenancePrice : 'X' }}</td>
            <td><button @click="editSpace(index)">수정</button></td>
            <td><button @click="deleteSpace(index)">삭제</button></td>
          </tr>
        </tbody>
      </table>
    </div>

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
import axios from 'axios'
import { AuthStore } from '@/stores/store'

export default {
  components: {},
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
        parkingSpaces: [],
        images: []
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
      originData: null,
      selectedZone: null,
      showAddZoneForm: false,
      imagePreviews: [], // 미리보기 이미지 배열
      files: [], // 업로드할 파일 배열
      modifying: false,
      deleteImageIds: []
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
          this.originData = JSON.parse(JSON.stringify(this.parkingLot))
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
    saveSpace() {
      if (this.selectedZone !== null) {
        const index = this.selectedZone.index
        this.parkingLot.zones[index] = { ...this.selectedZone }
        this.selectedZone = null
      }
    },
    cancelEdit() {
      this.selectedZone = null
    },
    deleteSpace(index) {
      this.parkingLot.zones.splice(index, 1)
    },
    onFileChange(event) {
      // 선택된 파일을 배열로 변환하여 파일 및 미리보기 갱신
      const files = Array.from(event.target.files)
      this.files = [] // 기존 파일 배열 초기화
      this.imagePreviews = [] // 미리보기 배열 초기화

      files.forEach((file) => {
        this.files.push(file)
        this.imagePreviews.push(URL.createObjectURL(file)) // 새롭게 미리보기 갱신
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
    },
    modifyOn() {
      this.modifying = true
    },
    modifyCancel() {
      this.parkingLot = JSON.parse(JSON.stringify(this.originData))
      this.modifying = false

      // 어둡게 변경된 이미지 복구
      this.removeDarker()

      // 삭제할 이미지 목록 초기화
      this.deleteImageIds = []

      // 파일 및 미리보기 초기화
      this.clearFileInput()
    },

    modifyComplete() {
      console.log(this.parkingLot)
      if (confirm('수정하시겠습니까?')) {
        const formData = new FormData()
        formData.append('name', this.parkingLot.name)
        formData.append('tel', this.parkingLot.tel)
        formData.append('weekdaysOpenTime', this.parkingLot.weekdaysOpenTime)
        formData.append('weekdaysCloseTime', this.parkingLot.weekdaysCloseTime)
        formData.append('weekendOpenTime', this.parkingLot.weekendOpenTime)
        formData.append('weekendCloseTime', this.parkingLot.weekendCloseTime)
        formData.append('deleteImageIds', this.deleteImageIds)

        // 파일을 FormData에 추가
        const files = this.$refs.fileInput.files
        for (let i = 0; i < files.length; i++) {
          formData.append('images', files[i])
        }

        axios
          .put(`/api/parkinglots/${this.selectedLotId}/owner/protected`, formData, {
            headers: {
              Authorization: `Bearer ${this.authStore.token}`,
              'Content-Type': 'multipart/form-data'
            }
          })
          .then((response) => {
            this.parkingLot = response.data
            this.originData = JSON.parse(JSON.stringify(this.parkingLot))
            this.modifying = false

            this.removeDarker()

            this.clearFileInput()
          })
          .catch(function (error) {
            alert(error)
          })
      }
    },
    clearFileInput() {
      this.files = []
      this.imagePreviews = []

      const fileInput = this.$refs.fileInput
      if (fileInput) {
        fileInput.value = ''
      }
    },
    addDeleteImgList(id) {
      if (!this.modifying) {
        return
      }

      const imgElement = document.getElementById(`image-${id}`)

      if (this.deleteImageIds.includes(id)) {
        this.removeDeleteImg(id)
        imgElement.classList.remove('darker')
      } else {
        this.deleteImageIds.push(id)
        imgElement.classList.add('darker')
      }

      console.log(this.deleteImageIds)
    },
    removeDeleteImg(id) {
      const index = this.deleteImageIds.indexOf(id)
      if (index !== -1) {
        this.deleteImageIds.splice(index, 1)
      }
    },
    removeDarker() {
      this.deleteImageIds.forEach((id) => {
        const imgElement = document.getElementById(`image-${id}`)
        if (imgElement) {
          imgElement.classList.remove('darker')
        }
      })
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
  max-width: 500px;
  padding: 8px;
  border: 1px solid #d1d9e6;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: #fff;
  color: #333;
}

.time {
  width: 100%;
  max-width: 250px !important;
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
  transition: filter 0.2s ease;
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

/* 테이블 스타일 */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 테이블에 그림자 효과 */
  border-radius: 8px;
  overflow: hidden;
}

/* 테이블 셀 스타일 */
th,
td {
  padding: 12px 15px; /* 셀 내부 여백 */
  text-align: center; /* 텍스트 가운데 정렬 */
}

/* 테이블 헤더 스타일 */
th {
  background-color: #9ac3ff; /* 헤더 배경색 */
  color: white; /* 헤더 텍스트 색 */
  text-transform: uppercase; /* 텍스트 대문자로 표시 */
}

/* 테이블 바디 셀 스타일 */
td {
  background-color: #f9f9f9; /* 셀 배경색 */
  border-bottom: 1px solid #ddd; /* 셀 하단 테두리 */
}

/* 행 hover 효과 */
tbody tr {
  transition: background-color 0.3s ease; /* 배경색 변화 애니메이션 */
}

/* 마우스를 올렸을 때 행의 배경색 변경 */
tbody tr:hover {
  background-color: #f1f1f1;
}

/* 짝수 행의 배경색 다르게 적용 */
tbody tr:nth-child(even) td {
  background-color: #f5f5f5;
}

/* 첫 번째와 마지막 셀의 테두리를 둥글게 처리 */
td:first-child,
th:first-child {
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}

td:last-child,
th:last-child {
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}

/* 버튼 스타일 */
button {
  background-color: #007bff; /* 기본 버튼 색상 (파란색) */
  color: white; /* 버튼 텍스트 색상 (흰색) */
  border: none; /* 버튼 테두리 없음 */
  padding: 8px 12px; /* 버튼 내부 여백 */
  border-radius: 5px; /* 버튼 둥근 모서리 */
  cursor: pointer; /* 커서를 포인터로 변경 */
  transition: background-color 0.3s ease; /* 배경색 변화 애니메이션 */
}

/* 버튼 hover 시 배경색 변경 */
button:hover {
  background-color: #0056b3;
}

/* 버튼 focus 시 테두리 제거 */
button:focus {
  outline: none;
}

/* 버튼 클릭 시 배경색 더 어둡게 변경 */
button:active {
  background-color: #004085;
}

/* 비활성화된 버튼 스타일 */
button:disabled {
  background-color: #cccccc; /* 비활성화 시 버튼 배경색 */
  cursor: not-allowed; /* 비활성화 시 커서 금지 모양 */
}

.darker {
  filter: brightness(50%);
}
</style>
