<!-- 
 담당자: 양건모
 시작 일자: 2024.09.02
 설명 : 주차장 지도 컴포넌트
 ---------------------
 2024.09.02 양건모 | 지도 표시 구현
 2024.09.03 양건모 | 지도 스크립트 호출 코드 위치 변경
 2024.09.03 양건모 | 장소 검색 구현
 2024.09.04 양건모 | 검색을 통해 장소 선택 시 마커 생성
 2024.09.05 양건모 | 현재 위치 근처의 주차장 마커 생성
 2024.09.07 양건모 | 마커 생성 api url 변경
 2024.09.08 양건모 | 마커-주차장id Mapping
 2024.09.09 양건모 | 주차장 구분에 따라 마커 다르게 생성
 2024.09.10 양건모 | api 명세 변경에 따른 axios 요청 url 변경
 2024.10.04 양건모 | 검색 결과 X 아이콘 클릭시 검색 키워드를 그대로 유지
 -->

<template>
  <div id="map-container">
    <div id="search">
      <div id="search-bar">
        <form onsubmit="return false;">
          <input
            id="search-input"
            type="search"
            class="form-control form-control-dark"
            placeholder="장소 검색"
            aria-label="Search"
            autocomplete="off"
            @input="searchBox"
          />
        </form>
        <button id="search-btn" type="button" @click="clearResult" v-if="showResult">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9A64E8"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
            width="24"
            height="24"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <button id="search-btn" type="button" @click="showRecommSelect()" v-if="searchResultMarker">
          <img src="@/assets/img/recommend.png" class="recommend-image" />
        </button>
      </div>
      <div id="place-list" v-if="showResult">
        <ul class="list-unstyled mb-0" v-for="item in placeArray" :key="item">
          <a class="dropdown-item" href="#" @click="setLocation(item)">
            <li>
              <div class="d-flex align-items-center gap-2 py-2">
                <div>
                  <b>{{ item.place_name }}</b>
                </div>
              </div>
              <div class="small">{{ item.address_name }}</div>
            </li>
            <hr />
          </a>
        </ul>
        <div id="no-result" v-if="placeArray.length == 0">
          <span>검색 결과가 없습니다</span>
        </div>
      </div>
    </div>
    <div id="map"></div>
    <div id="locationButtons">
      <button @click="geofind()">버튼</button>
    </div>
    <lot-preview-cmp
      v-if="selectedLot"
      :lotInfo="selectedLot"
      :visible="showLotPreview"
      @close="closeLotPreview"
    ></lot-preview-cmp>
    <recommend-lots-cmp
      v-if="showRecommSelectModal"
      :location="searchResultLatLon"
      @close-modal="hideRecommSelect()"
    ></recommend-lots-cmp>
  </div>
  <ConfirmModal
    v-if="customModalState.isModalVisible"
    :confirm="customModalState.confirm"
    :error="customModalState.error"
    :title="customModalState.modalTitle"
    :message="customModalState.modalMessage"
    :path="customModalState.modalPath"
    @close="closeConfirmModal"
  />
</template>

<script>
import axios from 'axios'
import LotPreviewCmp from './LotPreviewCmp.vue'
import RecommendLotsCmp from './RecommendLotsCmp.vue'
import ConfirmModal from '@/components/modal/ConfirmModal.vue'

export default {
  components: { LotPreviewCmp, RecommendLotsCmp, ConfirmModal },
  data() {
    return {
      keyword: '',
      placeArray: [],
      map: null,
      showResult: false,
      searchResultMarker: null,
      myPositionMarker: null,
      searchResultName: null,
      searchResultLatLon: null,
      lots: [],
      lotsMarker: [],
      lotsName: [],
      markerAndIdMap: null,
      selectedLot: null,
      showRecommSelectModal: false,
      customModalState: {
        confirm: false,
        error: false,
        isModalVisible: false,
        modalTitle: '제목',
        modalMessage: '메시지',
        modalPath: ''
      },
      myPosition: {
        latitude: null,
        longitude: null
      }
    }
  },
  mounted() {
    kakao.maps.load(() => {
      var container = document.getElementById('map')
      var options = {
        center: new kakao.maps.LatLng(37.583422, 126.999828),
        level: 3
      }

      this.map = new kakao.maps.Map(container, options)
      this.map.setMaxLevel(4)

      //드래그 이벤트 등록
      kakao.maps.event.addListener(this.map, 'dragend', () => {
        this.createLots()
      })
      //휠 이벤트 등록
      kakao.maps.event.addListener(this.map, 'zoom_changed', () => {
        this.createLots()
      })

      this.createLots()
    })
  },
  methods: {
    searchBox: function (e) {
      this.showResult = true
      this.keyword = e.target.value
      this.placeArray = []

      const places = new kakao.maps.services.Places()

      let callback = (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          this.placeArray = this.placeArray.concat(result)
        }
      }

      places.keywordSearch(this.keyword, callback)
    },
    clearResult: function () {
      this.keyword = ''
      this.showResult = false
      // document.getElementById('search-input').value = null
    },
    setLocation: function (item) {
      //기존 마커 삭제
      if (this.searchResultMarker != null) {
        this.searchResultMarker.setMap(null)
        this.searchResultName.setMap(null)
      }

      //위치, 지도 정보 설정
      var moveLatLon = new kakao.maps.LatLng(item.y, item.x)
      this.searchResultLatLon = {
        latitude: item.y,
        longitude: item.x
      }
      this.map.setLevel(2)

      //마커 생성
      this.searchResultMarker = new kakao.maps.Marker({ position: moveLatLon })
      const overlay = `<div class='overlay' style='border: 1.5px solid gray'>${item.place_name}</div>`
      this.searchResultName = new kakao.maps.CustomOverlay({
        position: moveLatLon,
        content: overlay
      })

      //마커 출력
      this.searchResultName.setMap(this.map)
      this.searchResultMarker.setMap(this.map)

      //해당 위치로 이동
      this.map.panTo(moveLatLon)
      this.createLots()
    },
    createLots() {
      const bound = this.map.getBounds()
      console.log(bound.qa)

      axios({
        method: 'get',
        url: `${import.meta.env.VITE_API_URL}/api/parkinglots`, // 환경 변수로 API URL 설정
        params: {
          minLat: bound.qa,
          maxLat: bound.pa,
          minLon: bound.ha,
          maxLon: bound.oa
        }
      })
        .then((response) => {
          this.lots = response.data.lots

          //기존 마커 삭제
          if (this.lotsMarker.length > 0) {
            this.lotsMarker.map((item) => {
              item.setMap(null)
            })
          }

          this.markerAndIdMap = new Map()
          this.lotsMarker = []

          //마커, 인포 윈도우 생성, id Mapping
          this.lots.forEach((item, index) => {
            //마커 형태 구분
            const imageSrc = item.hasUser
              ? 'https://parple-s3-bucket.s3.ap-northeast-2.amazonaws.com/basic-lot-marker.png'
              : 'https://parple-s3-bucket.s3.ap-northeast-2.amazonaws.com/marker-lot-no-owner.png'
            const imageSize = new kakao.maps.Size(40, 40)
            const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize)

            var latLon = new kakao.maps.LatLng(item.latitude, item.longitude)
            const marker = new kakao.maps.Marker({
              position: latLon,
              image: markerImage,
              clickable: true
            })

            //마커 클릭 이벤트 등록
            kakao.maps.event.addListener(marker, 'click', () => {
              this.markerClickEvent(marker)
            })

            marker.setMap(this.map)

            this.markerAndIdMap.set(marker, item.id)
            this.lotsMarker.push(marker)
          })
        })
        .catch(function (e) {
          console.error(e)
        })
    },
    markerClickEvent: function (marker) {
      console.log('클릭한 마커 : ' + marker)
      console.log('해당 마커의 id는 : ' + this.markerAndIdMap.get(marker))

      const selectedLot = {
        lotId: this.markerAndIdMap.get(marker)
      }

      if (selectedLot) {
        this.selectedLot = selectedLot
        this.showLotPreview = true // 바텀 시트 표시
      }
    },
    closeLotPreview() {
      this.showLotPreview = false // 바텀 시트 닫기
      this.selectedLot = null
    },
    showRecommSelect() {
      this.showRecommSelectModal = true
    },
    hideRecommSelect() {
      this.showRecommSelectModal = false // 모달 상태 변경
    },
    geofind() {
      if (!('geolocation' in navigator)) {
        this.openConfirmModal('경고', '브라우저가 위치 측정을 지원하지 않습니다.', false, false)
        return
      }
      this.textContent = 'Locating...'

      // get position
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (this.myPositionMarker != null) {
            this.myPositionMarker.setMap(null)
          }

          const latitude = pos.coords.latitude
          const longitude = pos.coords.longitude
          const latLon = new kakao.maps.LatLng(latitude, longitude)
          this.map.panTo(latLon)

          const imageSrc = 'https://parple-s3-bucket.s3.ap-northeast-2.amazonaws.com/myLocation.png'
          const imageSize = new kakao.maps.Size(40, 40)
          const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize)

          this.myPositionMarker = new kakao.maps.Marker({
            position: latLon,
            image: markerImage
          })

          //마커 출력
          this.myPositionMarker.setMap(this.map)
        },
        (error) => {
          console.log(error)
          this.openConfirmModal(
            '경고',
            '위치를 찾을 수 없습니다. <br> 위치 권한을 허용해주세요.',
            false,
            false
          )
        }
      )
    },
    openConfirmModal(title, message, confirm, error) {
      this.customModalState.modalTitle = title
      this.customModalState.modalMessage = message
      this.customModalState.confirm = confirm
      this.customModalState.error = error
      this.customModalState.isModalVisible = true
    },
    closeConfirmModal() {
      this.customModalState.isModalVisible = false
    }
  }
}
</script>

<style scoped>
#map-container {
  width: 100%;
  position: relative;
}

#search {
  width: 95%;
  height: 0;
  position: absolute;
  top: 20px;
  left: 0;
  z-index: 100;
  transform: translateX(2.5%);
}

#search-bar {
  height: 44px;
  background-color: white;
  border: 2px solid #9a64e8;
  border-radius: 20px;
  padding-right: 2%;
}

#search-input {
  width: calc(100% - 120px);
  margin-left: 2%;
  height: 40px;
  float: left;
  border: 0;
  background-color: transparent;
  border-radius: 2%;
  outline: none !important;
  box-shadow: none !important;

  -webkit-box-shadow: 0 0 0 30px #fff inset;
  &::-webkit-search-decoration,
  &::-webkit-search-cancel-button,
  &::-webkit-search-results-button,
  &::-webkit-search-results-decoration {
    display: none;
  }
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  transition: background-color 5000s ease-in-out 0s;
}

#search-btn {
  width: 30px;
  height: 40px;
  float: right;
  border: 0;
  background-color: transparent;
  text-align: right;
}

#map {
  width: 100%;
  height: calc(100dvh - 50px);
  margin: auto;
}

#place-list {
  overscroll-behavior: none;
  max-height: 265px;
  width: 90%;
  margin: auto;
  overflow: scroll;
  -ms-overflow-style: auto;
  background-color: #ffffffe6;
}

#place-list li,
span {
  margin-left: 10px;
  text-overflow: clip;
}

#place-list::-webkit-scrollbar {
  display: none;
}

#no-result {
  width: 100%;
  height: 50px;
  text-align: center;
  padding-top: 10px;
}

hr {
  margin: 0;
  padding: 0;
  margin-top: 10px;
}

.recommend-image {
  width: 22px;
  height: 22px;
}
</style>
