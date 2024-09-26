<!-- 
 담당자: 양건모
 시작 일자: 2024.09.10
 설명 : 주차장, 주차구역 정보 확인 및 수정 컴포넌트
 ---------------------
 2024.09.11 김찬희 | 대략적 UI 구현
 2024.09.18 양건모 | 주차장 정보 조회
 2024.09.19 양건모 | 주차장 기본 정보 수정, 이미지 조회 및 추가
 2024.09.20 양건모 | 등록된 이미지 삭제 및 버그 수정
 2024.09.20 양건모 | 주차구역 추가
 2024.09.21 양건모 | 주차구역명이 등록되지 않는 버그 수정
 2024.09.22 양건모 | 주차구역 수정, 삭제
 2024.09.22 양건모 | 차량 유형 기본값이 정상적으로 매핑되지 않는 버그 수정
 2024.09.22 양건모 | 입력값 validation 관련 코드 추가, 각종 버그 수정
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
      <div class="input-group">
        <label>주소</label>
        <input id="address" v-model="parkingLot.address" type="text" disabled />
      </div>
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

      <div class="image-preview">
        <div v-for="(image, index) in imagePreviews" :key="index" class="img-wrapper">
          <img :src="image" alt="uploaded image" class="uploaded-img" />
          <button class="remove-btn" @click="removeImage(index)">x</button>
        </div>
      </div>
    </div>

    <button class="btn btn-toggle" @click="toggleAddZoneForm">
      {{ showAddZoneForm ? '취소' : '주차 구역 추가' }}
    </button>

    <div v-if="showAddZoneForm" class="add-zone-form">
      <h3>새로운 주차 구역 추가</h3>
      <div class="input-group">
        <label>구역명</label>
        <input v-model="newParkingSpace.spaceName" type="text" />
      </div>
      <div class="input-group">
        <label>주차 공간 수</label>
        <input v-model.number="newParkingSpace.availableSpaceNum" type="number" />
      </div>
      <div class="input-group">
        <label>허용되는 차량 유형</label>
        <select v-model="newParkingSpace.carTypeId">
          <option v-for="(carType, index) in selectableCarTypes" :key="index" :value="carType.id">
            {{ carType.carTypeKor }}
          </option>
        </select>
      </div>
      <div class="input-group">
        <label>평일 가격</label>
        <input v-model.number="newParkingSpace.weekdaysPrice" type="number" />
      </div>
      <div class="input-group">
        <label>평일 최대 가격</label>
        <input v-model.number="newParkingSpace.weekAllDayPrice" type="number" />
      </div>
      <div class="input-group">
        <label>주말 가격</label>
        <input v-model.number="newParkingSpace.weekendPrice" type="number" />
      </div>
      <div class="input-group">
        <label>주말 최대 가격</label>
        <input v-model.number="newParkingSpace.weekendAllDayPrice" type="number" />
      </div>
      <div class="input-group">
        <label>세차 서비스</label>
        <input v-model="newParkingSpace.washService" type="checkbox" />
      </div>
      <div class="input-group" v-if="newParkingSpace.washService">
        <label>세차 서비스 가격</label>
        <input v-model="newParkingSpace.washPrice" type="number" />
      </div>
      <div class="input-group">
        <label>유지보수 서비스</label>
        <input v-model="newParkingSpace.maintenanceService" type="checkbox" />
      </div>
      <div class="input-group" v-if="newParkingSpace.maintenanceService">
        <label>유지보수 서비스 가격</label>
        <input v-model="newParkingSpace.maintenancePrice" type="number" />
      </div>
      <button class="btn btn-add" @click="addParkingSpace()">구역 추가</button>
    </div>

    <div>
      <h3 class="description">주차 구역 정보</h3>
      <table>
        <thead>
          <tr>
            <th>구역명</th>
            <th>주차 공간 수</th>
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
          <tr v-for="(space, index) in parkingLot.parkingSpaces" :key="index">
            <td>{{ space.spaceName ? space.spaceName : '이름 없음' }}</td>
            <td>{{ space.availableSpaceNum }}</td>
            <td>{{ space.carType }}</td>
            <td>{{ space.weekdaysPrice }}</td>
            <td>{{ space.weekAllDayPrice }}</td>
            <td>{{ space.weekendPrice }}</td>
            <td>{{ space.weekendAllDayPrice }}</td>
            <td>{{ space.washPrice ? space.washPrice : 'X' }}</td>
            <td>{{ space.maintenancePrice ? space.maintenancePrice : 'X' }}</td>
            <td><button @click="modifyParkingSpaceOn(index, space.id)">수정</button></td>
            <td><button @click="deleteParkingSpace(index, space.id)">삭제</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="selectedParkingSpace" class="edit-zone-form">
      <h3>{{ selectedParkingSpace.spaceName }} 구역 수정</h3>
      <div class="input-group">
        <label>구역명</label>
        <input v-model="selectedParkingSpace.spaceName" type="text" />
      </div>
      <div class="input-group">
        <label>주차 공간 수</label>
        <input v-model.number="selectedParkingSpace.availableSpaceNum" type="number" />
      </div>
      <div class="input-group">
        <label>허용되는 차량 유형</label>
        <select v-model="selectedParkingSpace.carTypeId">
          <option v-for="(carType, index) in selectableCarTypes" :key="index" :value="carType.id">
            {{ carType.carTypeKor }}
          </option>
        </select>
      </div>
      <div class="input-group">
        <label>평일 가격</label>
        <input v-model.number="selectedParkingSpace.weekdaysPrice" type="number" />
      </div>
      <div class="input-group">
        <label>평일 최대 가격</label>
        <input v-model.number="selectedParkingSpace.weekAllDayPrice" type="number" />
      </div>
      <div class="input-group">
        <label>주말 가격</label>
        <input v-model.number="selectedParkingSpace.weekendPrice" type="number" />
      </div>
      <div class="input-group">
        <label>주말 최대 가격</label>
        <input v-model.number="selectedParkingSpace.weekendAllDayPrice" type="number" />
      </div>
      <div class="input-group">
        <label>세차 서비스</label>
        <input v-model="selectedParkingSpace.washService" type="checkbox" />
      </div>
      <div class="input-group" v-if="selectedParkingSpace.washService">
        <label>세차 서비스 가격</label>
        <input v-model="selectedParkingSpace.washPrice" type="number" />
      </div>
      <div class="input-group">
        <label>유지보수 서비스</label>
        <input v-model="selectedParkingSpace.maintenanceService" type="checkbox" />
      </div>
      <div class="input-group" v-if="selectedParkingSpace.maintenanceService">
        <label>유지보수 서비스 가격</label>
        <input v-model="selectedParkingSpace.maintenancePrice" type="number" />
      </div>

      <button class="btn btn-save" @click="modifySpaceComplete()">저장</button>
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
        parkingLotId: '',
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
      newParkingSpace: {
        parkingLotId: this.selectedLotId,
        spaceName: '',
        availableSpaceNum: 0,
        carTypeId: '',
        weekdaysPrice: 0,
        weekAllDayPrice: 0,
        weekendPrice: 0,
        weekendAllDayPrice: 0,
        washService: false,
        washPrice: 0,
        maintenanceService: false,
        maintenancePrice: 0
      },
      originData: null,
      selectedParkingSpace: null,
      showAddZoneForm: false,
      imagePreviews: [],
      files: [],
      modifying: false,
      deleteImageIds: [],
      selectableCarTypes: []
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
    async addParkingSpace() {
      const validateResult = this.validateInsertParkingSpace(this.newParkingSpace)
      if (validateResult !== null) {
        alert(validateResult)
        return
      }

      console.log(this.newParkingSpace)
      await axios({
        method: 'post',
        url: '/api/parking-manager/info/parkingarea/protected',
        headers: {
          Authorization: `Bearer ${this.authStore.token}`,
          'Content-Type': 'application/json'
        },
        data: this.newParkingSpace
      })
        .then(() => {
          alert('주차구역이 추가되었습니다.')
          this.resetnewParkingSpace()
          this.showAddZoneForm = false
          this.getParkingLotDetail()
        })
        .catch(function (e) {
          alert(e)
        })
    },
    resetnewParkingSpace() {
      this.newParkingSpace = {
        parkingLotId: this.selectedLotId,
        spaceName: '',
        availableSpaceNum: 0,
        carTypeId: '',
        weekdaysPrice: 0,
        weekAllDayPrice: 0,
        weekendPrice: 0,
        weekendAllDayPrice: 0,
        washService: false,
        washPrice: 0,
        maintenanceService: false,
        maintenancePrice: 0
      }
    },
    modifyParkingSpaceOn(index, parkingSpaceId) {
      this.selectedParkingSpace = { ...this.parkingLot.parkingSpaces[index], index }
      this.selectedParkingSpace.parkingSpaceId = parkingSpaceId
      this.selectedParkingSpace.washService = this.selectedParkingSpace.washPrice > 0
      for (let i = 0; i < this.selectableCarTypes.length; i++) {
        console.log(this.parkingLot.parkingSpaces[index])
        if (this.selectedParkingSpace.carType == this.selectableCarTypes[i].carTypeKor) {
          this.selectedParkingSpace.carTypeId = this.selectableCarTypes[i].id
        }
      }
      console.log('')
      this.selectedParkingSpace.maintenanceService = this.selectedParkingSpace.maintenancePrice > 0
    },
    modifySpaceComplete() {
      const validateResult = this.validateModifyParkingSpace(this.selectedParkingSpace)
      if (validateResult !== null) {
        alert(validateResult)
        return
      }
      const formData = new FormData()

      // Add all the necessary form data from selectedParkingSpace
      formData.append('parkingSpaceId', this.selectedParkingSpace.parkingSpaceId)
      formData.append('spaceName', this.selectedParkingSpace.spaceName)
      formData.append('availableSpaceNum', this.selectedParkingSpace.availableSpaceNum)
      formData.append('carTypeId', this.selectedParkingSpace.carTypeId)
      formData.append('weekdaysPrice', this.selectedParkingSpace.weekdaysPrice)
      formData.append('weekAllDayPrice', this.selectedParkingSpace.weekAllDayPrice)
      formData.append('weekendPrice', this.selectedParkingSpace.weekendPrice)
      formData.append('weekendAllDayPrice', this.selectedParkingSpace.weekendAllDayPrice)
      formData.append('washService', this.selectedParkingSpace.washService)
      formData.append('washPrice', this.selectedParkingSpace.washPrice)
      formData.append('maintenanceService', this.selectedParkingSpace.maintenanceService)
      formData.append('maintenancePrice', this.selectedParkingSpace.maintenancePrice)

      axios
        .put(`/api/parking-manager/info/parkingarea/protected`, formData, {
          headers: {
            Authorization: `Bearer ${this.authStore.token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(() => {
          alert('주차구역이 수정되었습니다.')
          this.selectedParkingSpace = null
          this.getParkingLotDetail()
        })
        .catch(function (error) {
          alert(error)
        })
    },
    cancelEdit() {
      this.selectedParkingSpace = null
    },
    deleteParkingSpace(index, parkingSpaceId) {
      if (
        confirm('주차구역을 삭제해도 기존의 예약은 사라지지 않습니다. 정말로 삭제하시겠습니까?')
      ) {
        axios
          .delete(`/api/parking-manager/info/parkingarea/protected`, {
            headers: {
              Authorization: `Bearer ${this.authStore.token}`,
              parkingSpaceId: parkingSpaceId
            }
          })
          .then(() => {
            alert('삭제되었습니다')
            this.parkingLot.parkingSpaces.splice(index, 1)
          })
          .catch(function (error) {
            alert(error)
          })
      }
    },
    onFileChange(event) {
      const files = Array.from(event.target.files)
      this.files = []
      this.imagePreviews = []

      files.forEach((file) => {
        this.files.push(file)
        this.imagePreviews.push(URL.createObjectURL(file))
      })
    },
    removeImage(index) {
      this.imagePreviews.splice(index, 1)
      this.files.splice(index, 1)

      const dataTransfer = new DataTransfer()
      this.files.forEach((file) => dataTransfer.items.add(file))

      this.$refs.fileInput.files = dataTransfer.files
    },
    modifyOn() {
      this.modifying = true
      this.newParkingSpace.carTypeId = this.selectableCarTypes[0].id
      alert('기본 : ' + this.newParkingSpace.carTypeId)
    },
    modifyCancel() {
      this.parkingLot = JSON.parse(JSON.stringify(this.originData))
      this.modifying = false

      this.removeDarker()
      this.deleteImageIds = []
      this.clearFileInput()
    },

    modifyComplete() {
      if (confirm('수정하시겠습니까?')) {
        const validateResult = this.validateParkingLot(this.parkingLot)
        if (validateResult !== null) {
          alert(validateResult)
          return
        }

        const formData = new FormData()
        formData.append('name', this.parkingLot.name)
        formData.append('tel', this.parkingLot.tel)
        formData.append('weekdaysOpenTime', this.parkingLot.weekdaysOpenTime)
        formData.append('weekdaysCloseTime', this.parkingLot.weekdaysCloseTime)
        formData.append('weekendOpenTime', this.parkingLot.weekendOpenTime)
        formData.append('weekendCloseTime', this.parkingLot.weekendCloseTime)
        formData.append('deleteImageIds', this.deleteImageIds)

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
    },
    async getCarTypes() {
      await axios({
        method: 'get',
        url: '/api/car-type',
        headers: {
          Authorization: `Bearer ${this.authStore.token}`,
          'Content-Type': 'application/json'
        }
      })
        .then((response) => {
          this.selectableCarTypes = response.data.carTypes
        })
        .catch(function (e) {
          alert(e)
        })
    },
    //validations
    validateParkingLot(parkingLot) {
      if (!this.selectedLotId || isNaN(this.selectedLotId)) {
        return '주차장 ID는 숫자여야 하며, 빈 값일 수 없습니다.'
      }

      if (!parkingLot.name || typeof parkingLot.name !== 'string') {
        return '주차장 이름은 빈 값일 수 없으며, 문자열이어야 합니다.'
      }

      if (!parkingLot.address || typeof parkingLot.address !== 'string') {
        return '주소는 빈 값일 수 없으며, 문자열이어야 합니다.'
      }

      const telRegex = /^[0-9-]+$/
      if (!parkingLot.tel || !telRegex.test(parkingLot.tel)) {
        return '전화번호는 숫자와 하이픈(-)만 포함해야 하며, 빈 값일 수 없습니다.'
      }

      const timeRegex = /^[0-9]{2}:[0-9]{2}:[0-9]{2}$/
      if (!parkingLot.weekdaysOpenTime || !timeRegex.test(parkingLot.weekdaysOpenTime)) {
        return '평일 오픈 시간은 HH:MM 형식이어야 하며, 빈 값일 수 없습니다.'
      }
      if (!parkingLot.weekdaysCloseTime || !timeRegex.test(parkingLot.weekdaysCloseTime)) {
        return '평일 마감 시간은 HH:MM 형식이어야 하며, 빈 값일 수 없습니다.'
      }
      if (!parkingLot.weekendOpenTime || !timeRegex.test(parkingLot.weekendOpenTime)) {
        return '주말 오픈 시간은 HH:MM 형식이어야 하며, 빈 값일 수 없습니다.'
      }
      if (!parkingLot.weekendCloseTime || !timeRegex.test(parkingLot.weekendCloseTime)) {
        return '주말 마감 시간은 HH:MM 형식이어야 하며, 빈 값일 수 없습니다.'
      }

      return null
    },
    validateInsertParkingSpace(newParkingSpace) {
      if (!newParkingSpace.parkingLotId || isNaN(newParkingSpace.parkingLotId)) {
        return '주차장 ID가 올바르지 않습니다'
      }

      return this.validateParkingSpaceValues(newParkingSpace)
    },
    validateModifyParkingSpace(selectedParkingSpace) {
      if (
        !this.selectedParkingSpace.parkingSpaceId ||
        isNaN(this.selectedParkingSpace.parkingSpaceId)
      ) {
        return '주차 구역 ID가 올바르지 않습니다'
      }

      return this.validateParkingSpaceValues(selectedParkingSpace)
    },
    validateParkingSpaceValues(parkingSpace) {
      if (!parkingSpace.spaceName || typeof parkingSpace.spaceName !== 'string') {
        return '주차 구역명을 입력해주세요'
      }

      if (
        parkingSpace.availableSpaceNum === null ||
        isNaN(parkingSpace.availableSpaceNum) ||
        parkingSpace.availableSpaceNum <= 0
      ) {
        return '주차 공간 수를 올바르게 작성해주세요'
      }

      if (!parkingSpace.carTypeId || isNaN(parkingSpace.carTypeId)) {
        return '차종 ID를 선택해주세요'
      }

      if (
        parkingSpace.weekdaysPrice === null ||
        isNaN(parkingSpace.weekdaysPrice) ||
        parkingSpace.weekdaysPrice <= 0
      ) {
        return '평일 요금을 올바르게 작성해주세요'
      }
      if (
        parkingSpace.weekAllDayPrice === null ||
        isNaN(parkingSpace.weekAllDayPrice) ||
        parkingSpace.weekAllDayPrice <= 0
      ) {
        return '평일 종일 요금을 올바르게 작성해주세요'
      }
      if (
        parkingSpace.weekendPrice === null ||
        isNaN(parkingSpace.weekendPrice) ||
        parkingSpace.weekendPrice <= 0
      ) {
        return '주말 요금을 올바르게 작성해주세요'
      }
      if (
        parkingSpace.weekendAllDayPrice === null ||
        isNaN(parkingSpace.weekendAllDayPrice) ||
        parkingSpace.weekendAllDayPrice <= 0
      ) {
        return '주말 종일 요금을 올바르게 작성해주세요'
      }

      if (parkingSpace.washService === null || typeof parkingSpace.washService !== 'boolean') {
        return '세차 서비스 지원 여부를 선택해주세요'
      }

      if (
        parkingSpace.washPrice === null ||
        isNaN(parkingSpace.washPrice) ||
        (parkingSpace.washService && parkingSpace.washPrice <= 0)
      ) {
        return '세차 요금을 올바르게 작성해주세요'
      }

      if (
        parkingSpace.maintenanceService === null ||
        typeof parkingSpace.maintenanceService !== 'boolean'
      ) {
        return '정비 서비스 지원 여부를 선택해주세요'
      }

      if (
        parkingSpace.maintenancePrice === null ||
        isNaN(parkingSpace.maintenancePrice) ||
        (parkingSpace.maintenanceService && parkingSpace.maintenancePrice <= 0)
      ) {
        return '정비 요금을 올바르게 작성해주세요'
      }

      return null
    }
  },
  async mounted() {
    this.getParkingLotDetail()
      .then(() => {
        return this.getCarTypes()
      })
      .then(() => {
        if (this.selectableCarTypes.length > 0) {
          this.newParkingSpace.carTypeId = this.selectableCarTypes[0].id
        }
      })
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
