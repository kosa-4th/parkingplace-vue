<!-- 
 담당자: 양건모
 시작 일자: 2024.09.10
 설명 : 즐겨찾기한 주차장
 ---------------------
 2024.09.10 양건모 | 기능 구현
 -->
<template>
  <div id="content-wrapper">
    <div id="content-header">
      <h3 class="font-large"><b>즐겨찾기한 주차장</b></h3>
    </div>
    <div id="favorites-wrapper">
      <div class="favorite" v-for="(favorite, index) in favorites" :key="index">
        <div>
          <img
            class="favorite-img"
            src="../../../../assets/img/favorite-filled.png"
            @click="toggleFavorite(favorite.id, index)"
            v-if="favorite.toggleResult"
          />
          <img
            class="favorite-img"
            src="../../../../assets/img/favorite-empty.png"
            @click="toggleFavorite(favorite.id, index)"
            v-else
          />
        </div>
        <div>
          <p class="bottom-margin-3px">
            <b>{{ favorite.name }}</b>
          </p>
          <p class="bottom-margin-3px">{{ favorite.address }}</p>
        </div>
        <div>
          <router-link :to="{ path: `/lot/${favorite.id}` }">
            <svg width="15" height="30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 30">
              <g fill="none" stroke="#9a64e8" stroke-width="4" stroke-linecap="round">
                <path d="M 2 2 L 13 15 L 2 28" />
              </g>
            </svg>
          </router-link>
        </div>
      </div>
      <infinite-loading @infinite="loadFavorites" v-if="!noResult">
        <template #spinner>
          <div class="posts-end">
            <p>즐겨찾기를 불러오는 중입니다</p>
          </div>
        </template>
        <template #no-more>
          <div class="posts-end">
            <p class="loading-msg">마지막 즐겨찾기입니다</p>
          </div>
        </template>
        <template #no-results>
          <div class="posts-end">
            <p class="loading-msg">등록된 즐겨찾기가 없습니다</p>
          </div>
        </template>
      </infinite-loading>
    </div>
    <div class="posts-end" v-if="noResult">
      <p class="loading-msg">즐겨찾기한 주차장이 없습니다</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import router from '@/router'
import { AuthStore } from '@/stores/store'
import { InfiniteLoading } from 'infinite-loading-vue3-ts'

export default {
  components: {
    InfiniteLoading
  },
  data() {
    return {
      authStore: AuthStore(),
      page: 0,
      favorites: [],
      noResult: false
    }
  },
  created() {
    //로그인이 되어있지 않을 경우 이전 페이지로 이동
    if (!this.authStore.isLoggedIn) {
      router.go(-1)
    }
  },
  methods: {
    async loadFavorites(state) {
      console.log(this.authStore.getAuth)

      await axios({
        method: 'get',
        url: '/api/favorites/protected',
        params: {
          page: this.page
        },
        headers: {
          Authorization: `Bearer ${this.authStore.token}`,
          'Content-Type': 'application/json'
        }
      })
        .then((response) => {
          const data = response.data.favorites

          this.favorites = [...this.favorites, ...data.content]
          this.page++
          state.loaded()

          if (data.last) {
            state.complete()
          }

          if (data.totalElements == 0) {
            this.noResult = true
          }
        })
        .catch(function (e) {
          state.complete()
          console.error(e)
        })
    },
    async toggleFavorite(parkingLotId, index) {
      await axios({
        method: 'post',
        url: '/api/favorites/toggle/protected',
        params: {
          parkingLotId: parkingLotId
        },
        headers: {
          Authorization: `Bearer ${this.authStore.token}`,
          'Content-Type': 'application/json'
        }
      })
        .then((response) => {
          const toggleResult = response.data.toggleResult
          this.favorites[index].toggleResult = toggleResult
        })
        .catch(function (e) {
          console.error(e)
        })
    }
  }
}
</script>

<style>
#content-wrapper {
  width: 90%;
  padding: 10px;
  margin: auto;
}

#content-header {
  text-align: center;
  margin-bottom: 10px;
}

.favorite {
  border: 2px solid lightgray;
  margin-bottom: 5px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

.favorite div {
  flex-grow: 0;
}

.favorite div:first-child {
  flex-basis: 10%;
  /* background-color: #f9aaaa; */
  margin-right: 10px;
  text-align: center;
}

.favorite div:nth-child(2) {
  width: 78%;
  /* background-color: #acacff; */
  flex-basis: 80%;
}

.favorite div:last-child {
  /* background-color: #b5ffb5; */
  flex-basis: 10%;
  text-align: right;
}

.bottom-margin-3px {
  margin-bottom: 3px;
}

.font-mid {
  font-size: 18px;
}

.font-large {
  font-size: 20px;
}

.font-small {
  font-size: 12px;
}

p {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.favorite-img {
  width: 30px;
  height: 30px;
}

.posts-end {
  padding-top: 5px;
  width: 100%;
  height: 40px;
  text-align: center;
  border: 2px solid lightgray;
  border-radius: 5px;
}

.loading-msg {
  font-size: 18px;
  font-weight: bold;
  color: gray;
}
</style>
