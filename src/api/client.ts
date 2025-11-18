import axios from 'axios';
import { emitInvalidTokenAlert } from '@/utils/authAlert';
import { Navigate, useNavigate } from 'react-router-dom';

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    // localStorage에서 accessToken 가져오기
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // FormData인 경우 Content-Type을 제거하여 axios가 자동으로 multipart/form-data를 설정하도록 함
    if (config.data instanceof FormData) {
      // FormData인 경우 Content-Type을 완전히 제거하여 브라우저가 자동으로 multipart/form-data를 설정하도록 함
      // axios의 기본 헤더에서도 제거
      if (config.headers) {
        delete config.headers['Content-Type'];
        delete config.headers['content-type'];
        // AxiosHeaders 객체인 경우 set 메서드 사용
        if (typeof config.headers.set === 'function') {
          config.headers.set('Content-Type', undefined);
        } else {
          config.headers['Content-Type'] = undefined;
        }
      }
    }
    return config;
  },
  (error) => {
    console.error("=== Axios 요청 인터셉터 에러 ===");
    console.error("에러:", error);
    console.error("================================");
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error?.response?.status;

    if (status && [401, 403].includes(status)) {
      emitInvalidTokenAlert();
    }

    return Promise.reject(error);
  }
);
export default apiClient;