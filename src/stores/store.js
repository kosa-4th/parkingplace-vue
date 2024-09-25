/*
 담당자: 오지수
 시작 일자: 2024.09.03
 설명 : 로그인 회원정보 저장 store
 ---------------------
 2024.09.03 오지수 | 기능 구현
 2024.09.11 양건모 | getters.getAuth 메서드 추가
 */

import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'

export const AuthStore = defineStore('userAuth', {
  state: () => ({
    username: '',
    email: '',
    token: '',
    refreshToken: '',
    auth: ''
  }),
  actions: {
    setAuthData({ username, email, token, refreshToken, auth }) {
      this.username = username
      this.email = email
      this.token = token
      this.refreshToken = refreshToken
      this.auth = auth

      // 상태를 localStorage에 저장
      localStorage.setItem('authStore', JSON.stringify(this.$state))
    },
    loadAuthData() {
      const data = localStorage.getItem('authStore')
      if (data) {
        this.$patch(JSON.parse(data))
      }
    },
    clearAuthData() {
      this.username = ''
      this.email = ''
      this.token = ''
      this.refreshToken = ''
      this.auth = ''

      localStorage.removeItem('authStore')
    }
  },
  getters: {
    isLoggedIn: (state) => {
      return !!state.token
    },
    getAuth: (state) => {
      return jwtDecode(state.token).role
    },
    getUsername: (state) => {
      if (state.username && state.username !== '') {
        return state.username;
      }

      if (state.token) {
        try {
          return jwtDecode(state.token).name;
        } catch (error) {
          console.error("토큰 이상..");
          return '';
        }
      }
      return '';
    },
    getEmail: (state) => {
      return jwtDecode(state.token).email;
    }
  }
})
