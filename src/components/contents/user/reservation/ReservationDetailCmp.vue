<template>
  <div class="container text-center">
    <div class="card mx-auto my-5 p-4" style="width: 90%; border: 2px solid #ddd; border-radius: 10px;">
      <div class="card-body">
        <!-- 상단 아이콘 및 텍스트 -->
        <div class="d-flex justify-content-center mb-4">
          <div class="circle-icon text-white mx-3" style="background-color: #9A64E8;">
            <h6>결제전</h6>
          </div>
          <div class="circle-icon bg-secondary text-white mx-3">
            <h6>결제완료</h6>
          </div>
          <div class="circle-icon bg-secondary text-white mx-3">
            <h6>예약완료</h6>
          </div>
        </div>

        <!-- 예약 정보 -->
        <p class="font-weight-bold">{{reservationInfo.userName}}님의 예약 정보입니다.</p>
        <h5 class="mb-3">{{ reservationInfo.lotName }}</h5>
        <p>{{reservationInfo.startTime}} ~ {{ reservationInfo.endTime }}</p>
        <p>세차 여부 : {{ reservationInfo.wash }} 정비 여부 : {{reservationInfo.maintenance}}</p>
        <p class="text-success font-weight-bold">예약 되었습니다.</p>

        <!-- 결제 버튼 -->
        <button type="button" class="btn btn-primary">결제하기</button>
        <PaymentModal v-if="isModalOpen" :isOpen="isModalOpen" @close="closeModal"></PaymentModal>

      </div>
    </div>
  </div>
</template>
<script>
import paymentModal from '@/components/contents/user/reservation/PaymentModal.vue'
import axios from 'axios'

export default {
  components: {
    paymentModal
  },
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
        lotName : '',
      }

    }

  },
  created() {
    this.reservationId = this.$route.params.reservationId
    console.log("reservationId : "+this.reservationId)
  },
  mounted() {
    // 컴포넌트가 마운트될 때 API 호출
    this.getReservationPaymentData();
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
          lotName : responseReservationPaymentData.data.lotName,
        };
        console.log(this.reservationInfo.startTime)

      } catch (error) {
        console.log()
      } finally {
        console.log('')
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
</style>