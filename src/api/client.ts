import axios from 'axios';

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
    // localStorage에서 accessToken 가져오기, 없으면 테스트 계정 토큰 사용
    const token = localStorage.getItem('accessToken') || 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzIiwiaWF0IjoxNzYyOTczOTk0LCJleHAiOjE3NjI5NzU3OTQsImVtYWlsIjoidGVzdDJAZXhhbXBsZS5jb20iLCJhdXRoIjoiUk9MRV9VU0VSIn0.0hMA_lmCRxuqoFUiNqzAzXJedgcOlyDtrC6sAmNmkNU';
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 에러 처리 로직
    return Promise.reject(error);
  }
);

export default apiClient;

