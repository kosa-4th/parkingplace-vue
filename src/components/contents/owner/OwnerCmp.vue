<!-- 
 담당자: 양건모
 시작 일자: 2024.09.18
 설명 : 주차장 업주 컴포넌트
 ---------------------
 2024.09.18 양건모 | 주차장 선택 관련 기능 추가
 -->
<template>
  <div class="owner-container">
    <owner-menu-cmp
      :myLots="myLots"
      :selectedLotId="selectedLotId"
      @select-change="
        (localSelectedLotId) => {
          this.selectedLotId = localSelectedLotId
        }
      "
    ></owner-menu-cmp>
    <router-view v-if="myLots.length > 0" :selectedLotId="selectedLotId"></router-view>
    <div v-else>나의 주차장 없음</div>
  </div>
</template>

<script>
import OwnerMenuCmp from './OwnerMenuCmp.vue'
import axios from 'axios'
import { AuthStore } from '@/stores/store'

export default {
  components: { OwnerMenuCmp },
  data() {
    return {
      authStore: AuthStore(),
      myLots: [],
      selectedLotId: null
    }
  },
  async mounted() {
    await this.getMyLots()
  },
  methods: {
    async getMyLots() {
      await axios({
        method: 'get',
        url: '/api/parkinglots/my/protected',
        headers: {
          Authorization: `Bearer ${this.authStore.token}`,
          'Content-Type': 'application/json'
        }
      })
        .then((response) => {
          this.myLots = response.data.parkingLots
          if (this.myLots.length > 0) {
            this.selectedLotId = this.myLots[0].id
          }
        })
        .catch(function (e) {
          alert(e)
        })
    }
  },
  watch: {
    selectedLotId() {
      alert('새로 변경된 id = ' + this.selectedLotId)
    }
  }
}
</script>

<style scoped>
.owner-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* background-color: whitesmoke; */
  display: flex;
  flex-direction: column;
  font-size: 17px;
}
</style>
