import axios from "axios";
import { AuthStore } from '@/stores/store';
import { jwtDecode } from "jwt-decode";

// 작성자: 오지수
// 로그인
export async function  signIn(user) {
    try {
        const response = await axios.post("http://localhost:8080/api/open/users/authorize", 
            {
            email:user.email, 
            password:user.password, 
            membershipType:user.membershipType
            },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const accessToken = response.data.accessToken;
        const refreshToken = response.data.refreshToken;

        //토큰이 존재하는지 확인
        if (accessToken && typeof accessToken === 'string' ) {
            //jwt 토큰에서 사용자 정보 추출
            const decodedToken = jwtDecode(accessToken);
            const username = decodedToken.username;
            const email = decodedToken.email;
            const auth = decodedToken.auth;

            // pinia의 authStore에 로그인 정보 저장
            const authStore = AuthStore();
            authStore.setAuthData({username, email, token:accessToken, refreshToken, auth});

        }

        return true;
    } catch (error) {
        console.log("Login failed", error);
        return false;
    }
}

// 로그아웃
export function logout() {
    const authStore = AuthStore();
    authStore.clearAuthData();
}


// refreshToken
async function refreshToken() {
    const authStore = AuthStore();
    try {
        const response = await axios.post("http://localhost:8080/api/open/users/refresh", {
            refreshToken: authStore.refreshToken
        });

        const { accessToken } = response.data;
        authStore.setAuthData({ 
            username: authStore.username,
            email: authStore.email,
            token:accessToken, 
            refreshToken: authStore.refreshToken,
            auth: authStore.auth,    
        });

        // 갱신된 Access Token을 LocalStrage에 저장
        localStorage.setItem('token', accessToken);
        return accessToken;
    } catch (error) {
        console.error("Token refresh failed", error);
        authStore.clearAuthData();
        return null;
    }
}

// 토큰 만료시간 확인 함수
function getTokenExpiration(token) {
    if (!token) return null;

    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    return decodedToken.exp ? decodedToken.exp * 1000 : null;
}

// Axios 인터셉터 설정
axios.interceptors.request.use(
    async config => {
        const authStore = AuthStore();
        let token = authStore.token;

        // 특정 URL 패턴에 대해서만 JWT를 포함
        if (config.url.startsWith('/api/') && config.url.endsWith('/protected')) {
            const tokenExpiration = getTokenExpiration(token);
            const now = Date.now();

            //토큰 만료시간 확인 및 갱신 필요 여부 판단
            if (tokenExpiration && tokenExpiration <= now) {
                token = await refreshToken();
            }

            // 갱신된 토큰이 있다면 Authorization 헤더에 추가
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            } else {
                authStore.clearAuthData();
                return Promise.reject(new Error("유효한 토큰이 아닙니다."))
            }
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
)