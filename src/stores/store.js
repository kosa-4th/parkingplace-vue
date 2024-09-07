import { defineStore } from "pinia";

export const AuthStore = defineStore('userAuth', {
    state: () => ({
        username: '',
        email: '',
        token: '',
        refreshToken: '',
        auth: '',
    }),
    actions: {
        setAuthData({ username, email, token, refreshToken, auth }) {
            this.username = username;
            this.email = email;
            this.token = token;
            this.refreshToken = refreshToken;
            this.auth = auth;

            // 상태를 localStorage에 저장
            localStorage.setItem('authStore', JSON.stringify(this.$state));
        },
        loadAuthData() {
            const data = localStorage.getItem('authStore');
            if (data) {
                this.$patch(JSON.parse(data));
            }
        },
        clearAuthData() {
            this.username = '';
            this.email = '';
            this.token = '';
            this.refreshToken = '';
            this.auth = '';

            localStorage.removeItem("authStore");
        }
    },
    getters: {
        isLoggedIn: (state) => {
            return !!state.token;
        }
    }
})