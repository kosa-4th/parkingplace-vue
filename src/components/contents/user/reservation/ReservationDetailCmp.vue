<template>
  <div class="container text-center">
    <div class="card mx-auto my-5 p-4" style="width: 90%; border: 2px solid #ddd; border-radius: 10px;">
      <div class="card-body">
        <!-- 상단 아이콘 및 텍스트 -->
        <div class="d-flex justify-content-center mb-4">
          <!-- 결제 전 -->
          <svg viewBox="0 0 80 80" style="width: 20vw; height: 20vw; max-width: 80px; max-height: 80px;"
               preserveAspectRatio="xMidYMid meet" class="mx-3">
            <circle cx="40" cy="40" r="40" :class="{ 'bg-secondary': reservationInfo.reservationConfirmed !== 'N',
          'bg-purple': reservationInfo.reservationConfirmed === 'N' }" />
            <text x="40" y="45" text-anchor="middle" class="text-white" font-size="17">결제전</text>
          </svg>

          <!-- 결제 완료 -->
          <svg viewBox="0 0 80 80" style="width: 20vw; height: 20vw; max-width: 80px; max-height: 80px;"
               preserveAspectRatio="xMidYMid meet" class="mx-3">
            <circle cx="40" cy="40" r="40" :class="{ 'bg-secondary': reservationInfo.reservationConfirmed !== 'C',
          'bg-purple': reservationInfo.reservationConfirmed === 'C' }" />
            <text x="40" y="45" text-anchor="middle" class="text-white" font-size="17">결제완료</text>
          </svg>

          <!-- 예약 완료 -->
          <svg viewBox="0 0 80 80" style="width: 20vw; height: 20vw; max-width: 80px; max-height: 80px;"
               preserveAspectRatio="xMidYMid meet" class="mx-3">
            <circle cx="40" cy="40" r="40" :class="{ 'bg-secondary': reservationInfo.reservationConfirmed !== 'Y',
          'bg-purple': reservationInfo.reservationConfirmed === 'Y' }" />
            <text x="40" y="45" text-anchor="middle" class="text-white" font-size="17">예약완료</text>
          </svg>
        </div>
        <p>
          <span class="subtitle">{{ reservationInfo.userName }}</span>
          <span class="body-text">님의 예약 정보</span>
        </p>
        <p>
          <span class="fw-bold body-text ">{{ reservationInfo.lotName }}</span>
          <span>으로</span>
        </p>
        <p></p>
        <hr>
        <p class="fw-bold body-text" align="left">예약 날짜 : <span
          class="body-text">{{ formatDate(reservationInfo.startTime).date }}</span>
          <br>
          <span class="body-text">{{ formatDate(reservationInfo.startTime).time
            }}-{{ formatDate(reservationInfo.endTime).time }}</span>
        </p>
        <p class="fw-bold body-text" align="left">부가 서비스 &nbsp;
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" id="wash" v-model="washChecked" disabled>
            <label class="form-check-label" for="wash">세차</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" id="maintenance" v-model="maintenanceChecked" disabled>
            <label class="form-check-label" for="maintenance">정비</label>
          </div>
        </p>

        <p class="fw-bold body-text" align="left">결제 금액 : &nbsp;&nbsp;&nbsp;<span
          class="body-text">{{ formatNumber(reservationInfo.totalPrice) }}원</span>
        </p>

        <div>
          <!-- 결제 버튼 -->
          <button v-if="reservationInfo.reservationConfirmed === 'N'" type="button" class="bg-purple btn btn-spacing"
                  @click="requestPayment">결제하기
          </button>

          <!-- 예약 취소 및 결제 취소 버튼 -->
          <button v-if="reservationInfo.reservationConfirmed === 'N'"
                  type="button" class="bg-purple btn btn-spacing"
                  @click="openModal('예약 취소')">예약취소
          </button>

          <button v-if="reservationInfo.reservationConfirmed === 'C' || reservationInfo.reservationConfirmed==='Y'"
                  type="button" class="bg-purple btn btn-spacing"
                  @click="openModal('결제 및 예약 취소')">결제 및 예약 취소
          </button>

          <!-- 모달 창 -->
          <div v-if="showModal" class="modal-overlay">
            <div class="modal-content">
              <h4>{{ modalTitle }}</h4>
              <p>정말로 {{ modalTitle }}를 하시겠습니까?</p>
              <div class="d-flex justify-content-end">
                <button class="btn btn-secondary me-2" @click="closeModal">취소</button>
                <button class="btn btn-danger" @click="confirmAction">확인</button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  data() {
    return {
      showModal: false, // 모달 상태
      modalTitle: '',   // 모달 제목
      reservationId: null,
      washChecked: false,
      maintenanceChecked: false,
      reservationInfo: {
        reservationUuid: '',
        startTime: '',
        endTime: '',
        totalPrice: 0,
        wash: false,
        maintenance: false,
        userName: '',
        lotName: '',
        reservationConfirmed: false
      }

    }

  },
  created() {
    this.reservationId = this.$route.params.reservationId
    console.log('reservationId : ' + this.reservationId)
  },
  mounted() {
    // 컴포넌트가 마운트될 때 API 호출
    this.getReservationPaymentData()
  },
  methods: {
    /*
    * @Date 2024.09.18
    * 모달처리 및 디자인 */
    openModal(action) {
      this.modalTitle = action // 모달 제목 설정
      this.showModal = true    // 모달 열기
    },
    closeModal() {
      this.showModal = false   // 모달 닫기
    },
    confirmAction() {
      if (this.modalTitle === '예약 취소') {
        this.cancelReservation()
      } else if (this.modalTitle === '결제 및 예약 취소') {
        this.cancelPayment()
      }
      this.closeModal()
    },
    /**
     * @Author 김경민
     * @Date 2024.09.17
     * @method 결제취소 및 예약 취소
     * API (Post)
     * */
    async cancelPayment() {
      try {
        const url = `/api/payment/${this.reservationId}/cancel/protected`
        const paramData = {
          merchantUid: this.reservationInfo.reservationUuid,
          reason: '사용자 요청 취소'
        }
        const response = await axios.post(url, paramData)

        // API 요청이 성공했을 경우
        if (response && response.status === 200) {
          alert('예약 및 결제가 성공적으로 취소되었습니다.')
          window.location.href = '/' // 메인 페이지로 리다이렉트
        } else {
          console.error('예약 취소 요청이 실패했습니다.')
        }
      } catch (error) {
        console.error('에러취소실패:', error)
      }
    },
    /**
     * @Author 김경민
     * @Date 2024.09.14
     * @method 예약취소
     * API (put)
     * */
    async cancelReservation() {
      try {
        const url = `/api/reservation/${this.reservationId}/cancel/protected`

        const response = await axios.put(url)

        // API 요청이 성공했을 경우
        if (response && response.status === 200) {
          alert('예약이 성공적으로 취소되었습니다.')
          window.location.href = '/' // 메인 페이지로 리다이렉트
        } else {
          console.error('예약 취소 요청이 실패했습니다.')
        }
      } catch (error) {
        console.error('에러취소실패:', error)
      } finally {
        // 예약 취소 후에도 항상 실행될 코드
        console.log('취소 요청 처리 완료')
      }
    },
    //예약정보에서 데이터 가져오기
    async getReservationPaymentData() {
      try {
        const url = `/api/payment/${this.reservationId}/protected`
        const responseReservationPaymentData = await axios.get(url)
        this.reservationInfo = {
          reservationUuid: responseReservationPaymentData.data.reservationUuid,
          startTime: responseReservationPaymentData.data.startTime,
          endTime: responseReservationPaymentData.data.endTime,
          totalPrice: responseReservationPaymentData.data.totalPrice,
          wash: responseReservationPaymentData.data.wash,
          maintenance: responseReservationPaymentData.data.maintenance,
          userName: responseReservationPaymentData.data.userName,
          userEmail: responseReservationPaymentData.data.userEmail,
          lotName: responseReservationPaymentData.data.lotName,
          reservationConfirmed: responseReservationPaymentData.data.reservationConfirmed
        }
        console.log(this.reservationInfo.startTime)

      } catch (error) {
        console.log()
      } finally {
        console.log('')
      }
    },

    requestPayment() {
      const IMP = window.IMP // 포트원 결제 모듈
      IMP.init('imp25361448') // 포트원 가맹점 식별코드

      const paymentData = {
        pg: 'html5_inicis.INIpayTest',                        // PG사
        pay_method: 'card',                           // 결제수단
        merchant_uid: this.reservationInfo.reservationUuid,   // 주문번호
        amount: this.reservationInfo.totalPrice,                                 // 결제금액
        name: this.reservationInfo.lotName + '예약',                  // 주문명
        buyer_name: this.reservationInfo.userName,
        buyer_email: this.reservationInfo.userEmail,
        m_redirect_url: `http://localhost:8080/api/payment/${this.reservationId}/complete`

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
        const response = await axios.post(`/api/payment/${this.reservationId}/complete/protected`, {
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
        })
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
    formatDate(dateTime) {
      const date = new Date(dateTime)
      const formattedDate = date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
      const formattedTime = date.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit'
      })
      return {
        date: formattedDate,
        time: formattedTime
      }
    },
    formatNumber(number) {
      if (!number) return ''
      return number.toLocaleString()
    }
  },
  watch: {
    reservationInfo: {
      handler(newVal) {
        // reservationInfo의 값이 바뀌면 체크박스 값 업데이트
        this.washChecked = newVal.wash === 'Y'
        this.maintenanceChecked = newVal.maintenance === 'Y'
      },
      deep: true
    }
  }
}

</script>


<style scoped>
.title {
  font-size: 22px;
  font-weight: bold;
}

/* 부제목 스타일 */
.subtitle {
  font-size: 20px;
  font-weight: 600;
}

/* 본문 스타일 */
.body-text {
  font-size: 17px;
  font-weight: normal;
}

/* 작은 글씨 스타일 */
.small-text {
  font-size: 12px;
  font-weight: normal;
}

/* 원의 배경색 (동적 클래스) */
.bg-purple {
  fill: #a678e1; /* 보라색 배경 */
}

.bg-secondary {
  fill: #6c757d; /* 회색 배경 */
}

/* 텍스트 스타일 */
.text-white {
  fill: white; /* 텍스트 흰색 */
}

/* 버튼 간의 간격 설정 */
.btn-spacing {
  margin-right: 10px; /* 오른쪽에 10px 간격 추가 */
}

/* 버튼 hover 시 효과 */
.bg-purple {
  background-color: #9b59b6; /* 기본 보라색 */
  color: white;
}

.bg-purple:hover {
  background-color: #8e44ad; /* hover 시 보라색을 더 진하게 */
  color: white; /* 흰색이 아닌 다른 색을 사용하지 않음 */
}

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