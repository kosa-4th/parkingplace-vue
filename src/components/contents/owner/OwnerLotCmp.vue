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
 2024.09.25 김경민 | 디자인 전면 수정 / 모달 분리
 2024.09.26 김경민 | 모달 분리 작업 -> 삭제 버튼 변경
 2024.09.26 양건모 | 소실 기능 복원
 -->
<template>
  <div class="main-container">
    <div class="row">
      <div class="col-12">
        <h1 id="description"><b>주차장 관리</b></h1>
      </div>
    </div>

    <div class="col-12">
      <div class="d-flex justify-content-end">
        <button v-if="!modifying" @click="modifyOn" class="btn btn-sm bg-light-purple">수정</button>
        <button v-if="modifying" @click="modifyCancel" class="btn bg-red btn-sm me-2">취소</button>
        <button v-if="modifying" @click="modifyComplete" class="btn bg-green btn-sm">완료</button>
      </div>
    </div>
    <div class="col-12 mt-3">
      <div class="mb-3">
        <label class="form-label">주차장명</label>
        <input
          id="name"
          v-model="parkingLot.name"
          type="text"
          class="form-control"
          :readonly="!modifying"
        />
      </div>

      <div class="mb-3">
        <label class="form-label">주소</label>
        <input
          id="address"
          v-model="parkingLot.address"
          type="text"
          class="form-control"
          disabled
        />
      </div>
      <div class="mb-3">
        <label class="form-label">연락처</label>
        <input
          id="tel"
          v-model="parkingLot.tel"
          type="text"
          class="form-control"
          :readonly="!modifying"
        />
      </div>
      <div class="d-flex">
        <div class="flex-grow-1 me-2">
          <label class="form-label">평일 영업시간</label>
          <div class="d-flex">
            <input
              id="weekdaysOpenTime"
              v-model="parkingLot.weekdaysOpenTime"
              type="time"
              class="form-control"
              :readonly="!modifying"
            />
            <input
              id="weekdaysCloseTime"
              v-model="parkingLot.weekdaysCloseTime"
              type="time"
              class="form-control ms-2"
              :readonly="!modifying"
            />
          </div>
        </div>
        <div class="flex-grow-1">
          <label class="form-label">주말 영업시간</label>
          <div class="d-flex">
            <input
              id="weekendOpenTime"
              v-model="parkingLot.weekendOpenTime"
              type="time"
              class="form-control"
              :readonly="!modifying"
            />
            <input
              id="weekendCloseTime"
              v-model="parkingLot.weekendCloseTime"
              type="time"
              class="form-control ms-2"
              :readonly="!modifying"
            />
          </div>
        </div>
      </div>
      <div class="mb-3">
        <label class="form-label">이미지</label>
        <div class="d-flex flex-wrap">
          <img
            v-for="(image, idx) in parkingLot.images"
            :key="idx"
            :id="`image-${image.id}`"
            class="img-thumbnail"
            :src="image.path"
            style="width: 100px"
            @click="addDeleteImgList(image.id)"
          />
        </div>
      </div>
      <div class="mb-3">
        <div class="d-flex flex-wrap">
          <div
            v-for="(image, index) in imagePreviews"
            :key="index"
            class="position-relative me-2 mb-2"
          >
            <img
              :src="image"
              alt="uploaded image"
              class="img-thumbnail"
              @click="removeImage(index)"
            />
          </div>
        </div>
      </div>
      <div class="mb-3" :hidden="!modifying">
        <label class="form-label">이미지 추가</label>
        <input
          id="images"
          type="file"
          class="form-control"
          multiple
          @change="onFileChange"
          ref="fileInput"
          :disabled="!modifying"
        />
      </div>
      <hr />
      <div class="row">
        <div class="d-flex justify-content-end mb-3">
          <button class="btn btn-sm bg-light-purple" @click="openCreateModal">등록</button>
        </div>
        <table class="table table-bordered table-hover text-center">
          <thead class="thead-dark">
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
              <td>
                <button class="btn bg-purple btn-sm" @click="modifyParkingSpaceOn(index, space)">
                  수정
                </button>
              </td>
              <td>
                <button class="btn bg-red btn-sm" @click="deleteParkingSpace(space)">삭제</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <OwnerLotSpaceModifyModal
    v-if="showModifyModal"
    @close-modal="closeModifyModal"
    @refreshData="reloadPage"
    :parkingSpace="selectedParkingSpace"
    :selectedLotId="selectedLotId"
    :selectableCarTypes="selectableCarTypes"
  />
  <OwnerLotSpaceAddModal
    v-if="showCreateModal"
    @close-modal="closeCreateModal"
    @refreshData="reloadPage"
    :selectedLotId="selectedLotId"
    :selectableCarTypes="selectableCarTypes"
  />
  <confirm-cancel-modal
    v-if="confirmCancelModalState.isVisible"
    :confirm="confirmCancelModalState.confirm"
    :message="confirmCancelModalState.message"
    @close="handleCloseCCModal"
    @confirm="confirmModalAction()"
  />
</template>

<script>
import axios from 'axios'
import { AuthStore } from '@/stores/store'
import OwnerLotSpaceModifyModal from '@/components/contents/owner/OwnerLotSpaceModifyModal.vue'
import OwnerLotSpaceAddModal from '@/components/contents/owner/OwnerLotSpaceAddModal.vue'
import ConfirmCancelModal from '@/components/modal/ConfirmCancelModal.vue'
import {
  confirmCancelModalState,
  handleColseCCModal,
  showCCInfoModal
} from '@/components/modal/ConfirmModalService.js'

export default {
  components: {
    OwnerLotSpaceAddModal,
    OwnerLotSpaceModifyModal,
    ConfirmCancelModal
  },
  props: ['selectedLotId'],
  data() {
    return {
      confirmCancelModalState,
      showCreateModal: false, //주차장공간 생성 모달
      showModifyModal: false, //주차장공간 수정 모달
      selectedParkingSpace: null,
      selectedParkingSpaceId: null,
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
      showAddZoneForm: false,
      imagePreviews: [],
      files: [],
      modifying: false,
      deleteImageIds: [],
      selectableCarTypes: []
    }
  },
  methods: {
    reloadPage() {
      this.getParkingLotDetail()
    },
    openCreateModal() {
      this.showCreateModal = true
    },
    closeCreateModal() {
      this.showCreateModal = false
    },
    closeModifyModal() {
      this.showModifyModal = false
      this.selectedParkingSpace = null
    },
    handleCloseCCModal() {
      handleColseCCModal()
    },
    deleteParkingSpace(space) {
      this.selectedParkingSpaceId = space.id
      showCCInfoModal('주차 공간 정보를 삭제하시겠습니까?<br> 기존 예약은 삭제가 되지않습니다.')
    },
    modifyParkingSpaceOn(index, space) {
      this.showModifyModal = true // 모달 열기
      this.selectedParkingSpace = space // 주차 공간 정보 조회 메서드
      for (let i = 0; i < this.selectableCarTypes.length; i++) {
        console.log(this.parkingLot.parkingSpaces[index])
        if (this.selectedParkingSpace.carType == this.selectableCarTypes[i].carTypeKor) {
          this.selectedParkingSpace.carTypeId = this.selectableCarTypes[i].id
        }
      }
    },
    async getParkingLotDetail() {
      await axios({
        method: 'get',
        url: `${import.meta.env.VITE_API_URL}/api/parkinglots/${this.selectedLotId}/owner/protected`,
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
    confirmModalAction() {
      axios
        .delete(`${import.meta.env.VITE_API_URL}/api/parking-manager/info/parkingArea/protected`, {
          params: {
            parkingSpaceId: this.selectedParkingSpaceId // 쿼리 파라미터로 전달
          },
          headers: {
            Authorization: `Bearer ${this.authStore.token}`,
            'Content-Type': 'application/json'
          }
        })
        .then(() => {
          alert('삭제되었습니다')
          this.parkingLot.parkingSpaces.splice(1)
          this.handleCloseCCModal() // 성공 시 모달 닫기
        })
        .catch(function (error) {
          alert(error)
        })
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
    formatTimeWithSeconds(time) {
      if (time && time.length === 5) {
        return `${time}:00` // HH:MM 형식의 시간에 :00 (초)를 추가
      }
      return time // 이미 초가 있는 경우 그대로 반환
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
      parkingLot.weekdaysOpenTime = this.formatTimeWithSeconds(parkingLot.weekdaysOpenTime)

      if (!parkingLot.weekdaysOpenTime || !timeRegex.test(parkingLot.weekdaysOpenTime)) {
        return '평일 오픈 시간은 HH:MM 형식이어야 하며, 빈 값일 수 없습니다.'
      }
      parkingLot.weekdaysCloseTime = this.formatTimeWithSeconds(parkingLot.weekdaysCloseTime)

      if (!parkingLot.weekdaysCloseTime || !timeRegex.test(parkingLot.weekdaysCloseTime)) {
        return '평일 마감 시간은 HH:MM 형식이어야 하며, 빈 값일 수 없습니다.'
      }
      parkingLot.weekendOpenTime = this.formatTimeWithSeconds(parkingLot.weekendOpenTime)

      if (!parkingLot.weekendOpenTime || !timeRegex.test(parkingLot.weekendOpenTime)) {
        return '주말 오픈 시간은 HH:MM 형식이어야 하며, 빈 값일 수 없습니다.'
      }
      parkingLot.weekendCloseTime = this.formatTimeWithSeconds(parkingLot.weekendCloseTime)

      if (!parkingLot.weekendCloseTime || !timeRegex.test(parkingLot.weekendCloseTime)) {
        return '주말 마감 시간은 HH:MM 형식이어야 하며, 빈 값일 수 없습니다.'
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
#description {
  font-size: 22px;
  text-align: left;
  margin-bottom: 15px;
}

.font-large {
  font-size: 22px;
}

/* 메인 컨테이너 테두리 및 그림자 */
.main-container {
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 80vw;
  border: 1px solid #dee2e6; /* 테두리 추가 */
  border-radius: 10px; /* 둥근 모서리 */
  padding: 20px; /* 안쪽 여백 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 그림자 */
  background-color: #fff; /* 배경색 추가 */
  height: auto;
}

.text-left {
  text-align: left;
}

/* 시간 입력 필드와 텍스트 입력 필드의 스타일링 */
.form-control {
  margin-bottom: 1rem;
}

.d-flex input[type='time'] {
  width: 100%;
}

.ms-2 {
  margin-left: 0.5rem;
}

.me-2 {
  margin-right: 0.5rem;
}

.img-thumbnail {
  width: 100px; /* 원하는 너비 */
  height: 100px; /* 원하는 높이 */
  object-fit: cover; /* 이미지 비율을 유지하면서 자르기 */
}

.text-center {
  text-align: center;
}

.table {
  width: 97%;
  margin: 0 auto; /* 테이블을 가운데 정렬 */
  justify-content: center;
  border-color: #dddddd;
}

.table th,
.table td {
  border-color: #dddddd; /* 테이블 셀의 선 색상 */
}

/* 보라색 버튼 */
.bg-purple {
  background-color: #9a64e8; /* 기본 보라색 */
  color: white;
}

.bg-purple:hover {
  background-color: #9a64e8; /* hover 상태에서도 기본 색상 유지 */
  color: white; /* hover 상태에서 텍스트 색상 유지 */
}

/* 초록색 버튼 */
.bg-green {
  background-color: #76d672; /* 기본 초록색 */
  color: white;
}

.bg-green:hover {
  background-color: #76d672; /* hover 상태에서도 기본 색상 유지 */
  color: white; /* hover 상태에서 텍스트 색상 유지 */
}

/* 빨간색 버튼 */
.bg-red {
  background-color: #f93a41; /* 기본 빨간색 */
  color: white;
}

.bg-red:hover {
  background-color: #f93a41; /* hover 상태에서도 기본 색상 유지 */
  color: white; /* hover 상태에서 텍스트 색상 유지 */
}

/* 연보라색 버튼 */
.bg-light-purple {
  background-color: #f0e5ff; /* 기본 연보라색 */
  color: black;
}

.bg-light-purple:hover {
  background-color: #f0e5ff; /* hover 상태에서도 기본 색상 유지 */
  color: black; /* hover 상태에서 텍스트 색상 유지 */
}

.darker {
  filter: brightness(50%);
  filter: grayscale(100%);
}
</style>
