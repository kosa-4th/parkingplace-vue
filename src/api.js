// src/api.js
import axios from 'axios';

// Axios 인스턴스 생성
const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,  // 환경 변수에서 백엔드 URL을 불러옴
});

export default apiInstance;