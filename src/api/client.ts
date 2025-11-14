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
    
    // FormData인 경우 Content-Type을 제거하여 axios가 자동으로 multipart/form-data를 설정하도록 함
    if (config.data instanceof FormData) {
      console.log("=== Axios 요청 인터셉터 (FormData) ===");
      console.log("1. 요청 URL:", (config.baseURL || '') + (config.url || ''));
      console.log("2. 요청 메서드:", config.method?.toUpperCase() || 'UNKNOWN');
      console.log("3. AccessToken:");
      console.log("   - localStorage에서 가져온 토큰:", localStorage.getItem('accessToken') ? "있음" : "없음");
      console.log("   - 사용된 토큰:", token ? `${token.substring(0, 50)}...` : "없음");
      console.log("   - 토큰 전체:", token);
      console.log("4. FormData 감지됨 - Content-Type 헤더 제거");
      console.log("5. 요청 전 헤더:", {
        ...config.headers,
        Authorization: config.headers.Authorization ? `Bearer ${token.substring(0, 50)}...` : "없음"
      });
      
      // FormData 내용 확인
      console.log("6. FormData 필드 수:", Array.from(config.data.entries()).length);
      for (const [key, value] of config.data.entries()) {
        if (value instanceof File) {
          console.log(`   ${key}: File(${value.name}, ${value.size} bytes)`);
        } else {
          console.log(`   ${key}: ${value}`);
        }
      }
      console.log("=====================================");
      
      delete config.headers['Content-Type'];
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
    // 성공 응답 로깅 (FormData 요청인 경우만)
    if (response.config.data instanceof FormData) {
      console.log("=== Axios 응답 인터셉터 (FormData) ===");
      console.log("1. 응답 상태:", response.status);
      console.log("2. 응답 데이터:", response.data);
      console.log("=====================================");
    }
    return response;
  },
  (error) => {
    // 에러 처리 로직
    if (error.config?.data instanceof FormData) {
      console.error("=== Axios 응답 인터셉터 에러 (FormData) ===");
      console.error("1. 요청 URL:", error.config?.url);
      console.error("2. 요청 메서드:", error.config?.method?.toUpperCase());
      console.error("3. 에러 메시지:", error.message);
      if (error.response) {
        console.error("4. 응답 상태:", error.response.status);
        console.error("5. 응답 데이터:", error.response.data);
        console.error("6. 응답 헤더:", error.response.headers);
      } else if (error.request) {
        console.error("4. 요청은 전송되었지만 응답을 받지 못함");
      }
      console.error("==========================================");
    }
    return Promise.reject(error);
  }
);

export default apiClient;

