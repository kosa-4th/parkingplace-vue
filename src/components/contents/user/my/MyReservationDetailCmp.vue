<script>
/**
 * @Author 김경민
 * @Date 2024.09.18 MyPage 예약 상세 관련 Design 기본 틀
 * @DATE 2024.09.19 Axios를 통한 데이터 받아오기 및 결제 취소 및 예약 취소
 * */
import axios from 'axios'

export default {
  data() {
    return {
      reservationId: null,
      reservationDetails: {
        reservationConfirmed: ''
      }

    }
  },
  created() {
    this.reservationId = this.$route.params.reservationId
    console.log('reservationId : ' + this.reservationId)
  },
  methods: {
    async getReservationDetails() {
      const url = `/api/users/reservationsDetails/${this.reservationId}/protected`
      await axios.get(url)
        .then(response => {
          const getData = response.data
          this.reservationDetails = getData
        })
        .catch(error => {
          console.error(error)
        })
    },
    confirmCancel() {
      let checkConfirmed = this.reservationDetails.reservationConfirmed;

      if (checkConfirmed === 'N') {
        alert('N입니다.');
        const url = `/api/reservation/${this.reservationId}/cancel/protected`;

        axios.put(url)
          .then(response => {
            if (response.status === 200) {
              alert('예약이 성공적으로 취소되었습니다.');
              window.location.href = '/'; // 메인 페이지로 리다이렉트
            }
          })
          .catch(error => {
            console.error('에러취소실패:', error);
          });
      } else if (checkConfirmed === 'Y' || checkConfirmed === 'C') {
        alert('C입니다.');
        const url = `/api/payment/${this.reservationId}/cancel/protected`;
        const paramData = {
          merchantUid: this.reservationDetails.reservationUuid,
          reason: '사용자 요청 취소',
        };

        axios.post(url, paramData)
          .then(response => {
            if (response.status === 200) {
              alert('예약 및 결제가 성공적으로 취소되었습니다.');
              window.location.href = '/'; // 메인 페이지로 리다이렉트
            }
          })
          .catch(error => {
            console.error('에러취소실패:', error);
          });
      }

      // 모달 창 닫기
      const modal = bootstrap.Modal.getInstance(document.getElementById('cancelModal'));
      if (modal) {
        modal.hide();
      }
    },
    formatDate(dateString) {
      if (!dateString) return ''
      const [datePart, timePart] = dateString.split('T')
      const [year, month, day] = datePart.split('-')
      return `${year.slice(2)}-${month}-${day} ${timePart.slice(0, 5)}`
    },
    formatNumber(number) {
      if (!number) return ''
      return number.toLocaleString()
    }
  },
  mounted() {
    this.getReservationDetails()  // 페이지 로드 시 자동으로 요청 실행
  }
}
</script>

<template>
  <div class="container mt-4">

    <!-- 예약 정보 카드 -->
    <div class="card shadow-sm p-3 mb-4 bg-white rounded">
      <div class="card-body">
        <!-- 주차장 이름 및 예약 상태 -->
        <!-- 예약 상세 제목 -->
        <h5 class="mb-4 fw-bold">예약 번호 {{ reservationDetails.reservationUuid }}</h5>
        <h6 class="card-title d-flex justify-content-between align-items-center mb-3">
          <span class="fw-bold">{{ reservationDetails.lotName }}</span>
          <span v-if="reservationDetails.reservationConfirmed === 'Y'" class="badge bg-success text-white">예약 확정</span>
          <span v-else-if="reservationDetails.reservationConfirmed === 'N'"
                class="badge bg-warning text-white">예약 대기</span>
          <span v-else-if="reservationDetails.reservationConfirmed === 'C'"
                class="badge bg-primary text-white">결제 대기</span>
          <span v-else-if="reservationDetails.reservationConfirmed === 'D'"
                class="badge bg-secondary text-white">예약 취소</span></h6>
        <h6 class="card-title d-flex justify-content-between align-items-center mb-3">

        </h6>
        <!-- 주소 및 연락처 정보 -->
        <div class="mb-3">
          <div class="d-flex align-items-center mb-2">
            <img src="../../../../assets/img/icon-position.png" alt="서비스 아이콘" width="22" height="22" class="me-2">
            <i class="bi bi-geo-alt-fill text-muted me-2 fs-5"></i>
            <span class="text-muted">{{ reservationDetails.address }}</span>
          </div>
          <div class="d-flex align-items-center">
            <img src="../../../../assets/img/icon-call.png" alt="서비스 아이콘" width="22" height="22" class="me-2">
            <i class="bi bi-telephone-fill text-muted me-2 fs-5"></i>
            <span class="text-muted">{{ reservationDetails.phone }}</span>
          </div>
        </div>

        <hr>

        <!-- 날짜 및 시간 정보 -->
        <div class="mb-3">
          <div class="d-flex align-items-center mb-2">
            <img src="../../../../assets/img/icon-clock.png" alt="서비스 아이콘" width="22" height="22" class="me-2">
            <i class="bi bi-calendar-fill text-muted me-2 fs-5"></i>
            <span class="text-muted">{{ formatDate(reservationDetails.startTime) }} ~ </span>
            <i class="bi bi-calendar-fill text-muted me-2 fs-5"></i>
            <span class="text-muted">{{ formatDate(reservationDetails.endTime) }}</span>
          </div>
        </div>

        <hr>
        <!-- 주차요금 (아이콘 이미지 추가) -->
        <div class="mb-3">
          <div class="d-flex align-items-center">
            <img src="../../../../assets/img/icon-won.png" alt="서비스 아이콘" width="22" height="22" class="me-2">
            <span class="text-muted"> {{ formatNumber(reservationDetails.totalPrice) }}원</span>
          </div>
        </div>
        <hr>

        <!-- 부가 서비스 정보 (아이콘 이미지 추가) -->
        <div class="mb-3">
          <div class="d-flex align-items-center">
            <img src="../../../../assets/img/icon-won.png" alt="서비스 아이콘" width="22" height="22" class="me-2">
            <span v-if="reservationDetails.wash === 'Y'" class="text-muted"> 세차 O&nbsp;</span>
            <span v-else-if="reservationDetails.wash === 'N'" class="text-muted"> 세차 X&nbsp;</span>
            <span v-if="reservationDetails.maintenance === 'Y'" class="text-muted">| 정비 O</span>
            <span v-else-if="reservationDetails.maintenance === 'N'" class="text-muted">| 정비 X</span>
          </div>
        </div>

        <hr>

        <!-- 차량 번호 및 변경 버튼 -->
        <div class="mb-3 d-flex align-items-center">
          <img src="../../../../assets/img/icon-car.png" alt="서비스 아이콘" width="22" height="22" class="me-2">
          <i class="bi bi-car-front-fill text-muted me-2 fs-5"></i>
          <span class="text-muted me-3">{{ reservationDetails.plateNumber }}</span>
        </div>

        <!-- 예약 취소 버튼 -->
        <div class="mt-4" v-if="reservationDetails.reservationConfirmed === 'Y' || reservationDetails.reservationConfirmed === 'C' || reservationDetails.reservationConfirmed === 'N'">
          <button data-bs-toggle="modal" data-bs-target="#cancelModal" class="btn btn-block w-100"
                  style="background-color: #f3e8ff; color: #a678e1;">예약 취소하기
          </button>
        </div>
      </div>
    </div>
    <!-- 모달 -->
    <div class="modal fade" id="cancelModal" tabindex="-1" aria-labelledby="cancelModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered"> <!-- 이 클래스가 모달을 화면 중앙에 위치시킵니다 -->
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="cancelModalLabel">예약 취소</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            정말로 예약을 취소하시겠습니까?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
            <button type="button" class="btn btn-danger" @click="confirmCancel">예약 취소</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>