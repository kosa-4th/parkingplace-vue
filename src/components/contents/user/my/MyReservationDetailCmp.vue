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
      showModal: false, // 모달 창의 열림/닫힘 상태 관리
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
    openModal() {
      this.showModal = true // 모달 열기
    },
    closeModal() {
      this.showModal = false // 모달 닫기
    },
    requestPayment() {
      const IMP = window.IMP // 포트원 결제 모듈
      IMP.init('imp25361448') // 포트원 가맹점 식별코드

      const paymentData = {
        pg: 'html5_inicis.INIpayTest',                        // PG사
        pay_method: 'card',                           // 결제수단
        merchant_uid: this.reservationDetails.reservationUuid,   // 주문번호
        amount: this.reservationDetails.totalPrice,                                 // 결제금액
        name: this.reservationDetails.lotName + '예약',                  // 주문명
        m_redirect_url: `${import.meta.env.VITE_API_URL}/api/payment/${this.reservationId}/complete`
      }
      IMP.request_pay(paymentData,
        rsp => {
          if (rsp.success) {
            this.sendPaymentData(rsp)
          } else {
            alert('결제가 실패가 되었습니다.' + rsp.error_msg)
          }
        })
    },
    async sendPaymentData(rsp) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/payment/${this.reservationId}/complete/protected`, {
            impUid: rsp.imp_uid, // 아임포트 결제 고유번호
            merchantUid: rsp.merchant_uid,
            amount: rsp.paid_amount, // 결제 금액
            buyerEmail: rsp.buyer_email,
            buyerName: rsp.buyer_name, // 구매자 이름
            buyerTel: rsp.buyer_tel, // 구매자 이름
            receiptUrl: rsp.receipt_url,
            status: rsp.status,
            cardName: rsp.cardName,
            cardNumber: rsp.cardNumber,
            paidAt: rsp.paid_at
          }
        )
        alert('결제 정보 서버 전송 성공:', response.data)
        // 결제 성공 후 성공 페이지로 리다이렉트
        window.location.reload() // 현재 페이지를 새로고침
      } catch (error) {
        console.error('결제 정보 서버 전송 실패:', error)
        alert('결제 정보 전송에 실패했습니다.')
        // 결제 실패 페이지로 리다이렉트
        window.location.reload() // 현재 페이지를 새로고침
      }
    },
    async getReservationDetails() {
      const url = `${import.meta.env.VITE_API_URL}/api/users/reservationsDetails/${this.reservationId}/protected`

      try {
        const response = await axios.get(url)

        // 응답 데이터를 reservationDetails에 저장
        this.reservationDetails = response.data

      } catch (error) {
        console.error('예약 세부 정보 가져오기 오류:', error.response ? error.response.data : error)
        // 에러 발생 시 추가적인 처리 가능 (ex. 사용자에게 알림)
      }
    },
    async confirmCancel() {
      let checkConfirmed = this.reservationDetails.reservationConfirmed;

      try {
        if (checkConfirmed === 'N') {
          const url = `${import.meta.env.VITE_API_URL}/api/reservation/${this.reservationId}/cancel/protected`;

          const response = await axios.put(url, null);

          if (response.status === 200) {
            alert('예약이 성공적으로 취소되었습니다.');
            window.location.href = '/'; // 메인 페이지로 리다이렉트
          }

        } else if (checkConfirmed === 'Y' || checkConfirmed === 'C') {
          const url = `${import.meta.env.VITE_API_URL}/api/payment/${this.reservationId}/cancel/protected`;
          const paramData = {
            merchantUid: this.reservationDetails.reservationUuid,
            reason: '사용자 요청 취소'
          };

          const response = await axios.post(url, paramData);

          if (response.status === 200) {
            alert('예약 및 결제가 성공적으로 취소되었습니다.');
            window.location.href = '/'; // 메인 페이지로 리다이렉트
          }
        }

        this.cancelReservation();
        this.closeModal(); // 모달 닫기

      } catch (error) {
        console.error('취소 요청 실패:', error.response ? error.response.data : error);
        alert('취소 요청에 실패했습니다. 잠시 후 다시 시도해 주세요.');
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
          <span v-if="reservationDetails.reservationConfirmed === 'Y'" class="badge bg-green text-white">예약 확정</span>
          <span v-else-if="reservationDetails.reservationConfirmed === 'N'"
                class="badge bg-gray text-white">결제 대기</span>
          <span v-else-if="reservationDetails.reservationConfirmed === 'C'"
                class="badge bg-purple text-white">결제 완료</span>
          <span v-else-if="reservationDetails.reservationConfirmed === 'D'"
                class="badge bg-red text-white">예약 취소</span></h6>
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
        <div class="mt-4"
             v-if="reservationDetails.reservationConfirmed === 'Y' || reservationDetails.reservationConfirmed === 'C' || reservationDetails.reservationConfirmed === 'N'">
          <button v-if="reservationDetails.reservationConfirmed === 'N'" class="btn btn-block w-100 bg-green"
                  @click="requestPayment">결제하기
          </button>
          <div class="mt-1"></div>
          <button @click="openModal" class="btn btn-block w-100"
                  style="background-color: #f3e8ff; color: #a678e1;">예약 취소하기
          </button>
        </div>

        <!-- 모달 -->
        <div v-if="showModal" class="modal-overlay">
          <div class="modal-content">
            <h5>예약 취소</h5>
            <p>정말로 예약을 취소하시겠습니까?</p>
            <div class="d-flex justify-content-end">
              <button class="btn btn-secondary me-2" @click="closeModal">취소</button>
              <button class="btn btn-danger" @click="confirmCancel">확인</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  text-align: center;
}
</style>