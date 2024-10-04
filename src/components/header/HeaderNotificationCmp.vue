<!--
 담당자: 양건모
 시작 일자: 2024.09.25
 설명 : 알림 컴포넌트
 ---------------------
 2024.09.25 양건모 | 기능 구현
 2024.09.26 양건모 | 디자인 수정
 -->
<template>
  <div id="wrapper">
    <div id="modal">
      <div id="buttons">
        <button id="check-all" class="no-decoration" @click="checkAll()">
          <img src="@/assets/img/check-all.png" />
        </button>
        <button id="remove-all" class="no-decoration" @click="removeAll()">
          <img src="@/assets/img/delete-all.png" />
        </button>
      </div>
      <div id="notifications" v-if="notifications !== null">
        <div
          class="noti-info-wrapper"
          :class="notification.checked ? 'checked' : 'unchecked'"
          v-for="(notification, index) in notifications"
          :key="index"
        >
          <div class="noti-upper align-left">
            <span class="font-small">{{ formatDate(notification.createdAt) }}</span>
            <button
              class="no-decoration align-right font-small"
              @click="deleteOne(notification.notificationId)"
            >
              <svg
                class="x-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6c6c6c"
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
          </div>
          <div
            @click="moveToNotification(notification.notificationId, notification.notificationLink)"
          >
            <div class="noti-desc noti-info font-small-mid">{{ notification.description }}</div>
          </div>
        </div>
      </div>
      <infinite-loading
        target="notifications"
        @infinite="getNotifications"
        v-if="!noResult"
        :parent="'#modal'"
      >
        <template #spinner><div></div> </template>
        <template #no-more> <div></div></template>
        <template #no-results><div></div></template>
      </infinite-loading>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { AuthStore } from '@/stores/store'
import { InfiniteLoading } from 'infinite-loading-vue3-ts'
import router from '@/router'

export default {
  components: {
    InfiniteLoading
  },
  data() {
    return {
      notifications: null,
      page: 0,
      authStore: AuthStore()
    }
  },
  methods: {
    async getNotifications() {
      if (this.notifications === null) {
        this.notifications = []
      }

      await axios({
        method: 'get',
        url: '/api/notifications/protected',
        params: {
          page: this.page
        },
        headers: {
          Authorization: `Bearer ${this.authStore.token}`,
          'Content-Type': 'application/json'
        }
      })
        .then((response) => {
          console.log('loaded')
          this.notifications = response.data.notifications
        })
        .catch(function (e) {
          console.error(e)
        })
    },
    formatDate(dateString) {
      const date = new Date(dateString)

      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0') // 월은 0부터 시작하므로 +1 필요
      const day = String(date.getDate()).padStart(2, '0')

      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')

      return `${year}-${month}-${day} ${hours}:${minutes}`
    },
    async checkAll() {
      try {
        await axios({
          method: 'put',
          url: '/api/notifications/all/protected',
          headers: {
            Authorization: `Bearer ${this.authStore.token}`,
            'Content-Type': 'application/json'
          }
        })
        // 요청 성공 시 모든 알림의 checked 값을 true로 변경
        this.notifications.forEach((notification) => {
          notification.checked = true
        })
        console.log('모든 알림이 읽음 처리되었습니다.')
      } catch (e) {
        console.error(e)
      }
    },
    async removeAll() {
      try {
        await axios({
          method: 'delete',
          url: '/api/notifications/all/protected',
          headers: {
            Authorization: `Bearer ${this.authStore.token}`,
            'Content-Type': 'application/json'
          }
        })
        this.notifications = []
        console.log('모든 알림이 삭제되었습니다.')
      } catch (e) {
        console.error(e)
      }
    },
    async checkOne(notificationId) {
      try {
        await axios({
          method: 'put',
          url: `/api/notifications/${notificationId}/protected`,
          headers: {
            Authorization: `Bearer ${this.authStore.token}`,
            'Content-Type': 'application/json'
          }
        })
        // 요청 성공 시 해당 알림의 checked 값을 true로 변경
        const notification = this.notifications.find(
          (notification) => notification.notificationId === notificationId
        )
        if (notification) {
          notification.checked = true
        }
        console.log(`알림 ${notificationId}이(가) 읽음 처리되었습니다.`)
      } catch (e) {
        console.error(e)
      }
    },
    async deleteOne(notificationId) {
      try {
        await axios({
          method: 'delete',
          url: `/api/notifications/${notificationId}/protected`,
          headers: {
            Authorization: `Bearer ${this.authStore.token}`,
            'Content-Type': 'application/json'
          }
        })
        // 요청 성공 시 notifications 배열에서 해당 알림 제거
        this.notifications = this.notifications.filter(
          (notification) => notification.notificationId !== notificationId
        )
      } catch (e) {
        console.error(e)
      }
    },
    async moveToNotification(notificationId, notificationLink) {
      await this.checkOne(notificationId).then(() => {
        this.closeModal()
      })
      router.push(notificationLink)
    },
    closeModal() {
      this.$emit('closed')
    }
  }
}
</script>

<style scoped>
#wrapper {
  position: relative;
}

#notifications {
  height: calc(60vh - 55px);
  overflow: scroll;
  width: 100%;
  background-color: #fafafa;
  position: absolute;
  right: 0;
  top: 40px;
  -ms-overflow-style: none;
  scrollbar-width: none;
  padding: 5px; /* 안쪽 여백 */
  z-index: 1050;
}

#modal {
  height: 60vh;
  overflow: hidden;
  background-color: #fafafa;
  position: absolute;
  right: 0;
  top: 40px;
  -ms-overflow-style: none;
  scrollbar-width: none;
  border: 1px solid #dee2e6; /* 테두리 추가 */
  border-radius: 10px; /* 둥근 모서리 */
  padding: 5px; /* 안쪽 여백 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 그림자 */
  z-index: 1050;
}

#modal::-webkit-scrollbar {
  display: none;
}

@media (orientation: landscape) {
  #modal {
    width: 600px;
  }
}

@media (orientation: portrait) {
  #modal {
    width: 90vw;
  }
}

.noti-date {
  text-align: right;
}

.noti-info-wrapper {
  border-radius: 10px;
  padding: 5px;
  margin: 12px;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 그림자 */
}

.no-decoration {
  border: none;
  background-color: transparent;
}

.align-left {
  text-align: left;
}

.noti-upper {
  width: 100%;
  display: flex; /* 플렉스 박스 사용 */
  justify-content: space-between; /* 좌우로 아이템 분리 */
  align-items: center; /* 수직 가운데 정렬 */
  margin-bottom: 5px;
}

.align-right {
  margin-left: auto; /* 왼쪽에 여백 추가해 오른쪽으로 이동 */
}

.checked {
  color: #bebebe;
}

.unchecked {
}

.font-small {
  font-size: 14px;
}

.font-small-mid {
  font-size: 14px;
}

.x-icon {
  width: 17px;
  height: 17px;
}

#buttons {
  text-align: right;
  margin-right: 10px;
  margin-top: 5px;
}

#buttons img {
  width: 25px;
  height: 25px;
}
</style>
