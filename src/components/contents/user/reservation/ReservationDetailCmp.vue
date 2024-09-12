<template>
  <div class="container text-center">
    <div class="card mx-auto my-5 p-4" style="width: 90%; border: 2px solid #ddd; border-radius: 10px;">
      <div class="card-body">
        <!-- 상단 아이콘 및 텍스트 -->
        <div class="d-flex justify-content-center mb-4">
          <!-- 결제 전 -->
          <div class="circle-icon text-white mx-3" :class="{ 'bg-secondary': reservationInfo.reservationConfirmed !== 'N',
          'bg-purple': reservationInfo.reservationConfirmed === 'N' }">
            <h6>결제전</h6>
          </div>

          <!-- 결제 완료 -->
          <div class="circle-icon text-white mx-3" :class="{ 'bg-secondary': reservationInfo.reservationConfirmed !== 'C',
          'bg-purple': reservationInfo.reservationConfirmed === 'C' }">
            <h6>결제완료</h6>
          </div>

          <!-- 예약 완료 -->
          <div class="circle-icon text-white mx-3" :class="{ 'bg-secondary': reservationInfo.reservationConfirmed !== 'Y',
          'bg-purple': reservationInfo.reservationConfirmed === 'Y' }">
            <h6>예약완료</h6>
          </div>
        </div>

        <!-- 예약 정보 -->
        <p class="font-weight-bold">{{ reservationInfo.userName }}님의 예약 정보입니다.</p>
        <h5 class="mb-3">{{ reservationInfo.lotName }}</h5>
        <p>{{ reservationInfo.startTime }} ~ {{ reservationInfo.endTime }}</p>
        <p>세차 여부 : {{ reservationInfo.wash }} 정비 여부 : {{ reservationInfo.maintenance }}</p>
        <p>결제 금액 : {{ reservationInfo.totalPrice }}</p>
        <p class="text-success font-weight-bold">{{ reservationInfo.reservationConfirmed }} 예약 되었습니다.</p>

        <!-- 결제 버튼 -->
        <button v-if="reservationInfo.reservationConfirmed === 'N'" type="button" class="btn btn-primary"
                @click="requestPayment">결제하기
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  data() {
    return {
      reservationId: null,

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
    //axios를 통한 데이터 가져오기
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
        amount: 100,                                 // 결제금액
        name: this.reservationInfo.lotName + '예약',                  // 주문명
        buyer_name: this.reservationInfo.userName,
        buyer_email: this.reservationInfo.userEmail,
        m_redirect_url: `http://localhost:8080/api/payment/${this.reservationId}/complete`,

      };
      IMP.request_pay(paymentData,
      rsp => {
        if(rsp.success){
          this.sendPaymentData(rsp);
        }else{
          alert('결제가 실패가 되었습니다.'+rsp.error_msg);
        }
      });
    },
    async sendPaymentData(rsp) {
      try {
        const response = await axios.post(`/api/payment/${this.reservationId}/complete/protected`, {
          imp_uid: rsp.imp_uid, // 아임포트 결제 고유번호
          amount: rsp.paid_amount, // 결제 금액
          buyerEmail : rsp.buyer_email,
          buyerName: rsp.buyer_name, // 구매자 이름
          reciptUrl : rsp.receipt_url,
          status : rsp.status,
          cardName : rsp.cardName,
          cardNumber : rsp.cardNumber,


        });
        console.log('결제 정보 서버 전송 성공:', response.data);
        alert('결제 성공! 결제 정보가 서버에 전송되었습니다.');
        // 결제 성공 후 성공 페이지로 리다이렉트
        window.location.reload(); // 현재 페이지를 새로고침
      } catch (error) {
        console.error('결제 정보 서버 전송 실패:', error);
        alert('결제 정보 전송에 실패했습니다.');
        // 결제 실패 페이지로 리다이렉트
        window.location.reload(); // 현재 페이지를 새로고침
      }
    },
  }
}

</script>


<style scoped>
.circle-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  font-size: 1.2rem;
}

.bg-purple {
  background-color: #9A64E8;
}
</style>