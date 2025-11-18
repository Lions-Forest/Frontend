import apiClient from "@/api/client";

// API 응답 타입 정의
export interface MakeClassResponse {
  id: number;
  leaderId: number;
  leaderNickname: string;
  leaderName: string;
  title: string;
  category: "MEAL" | "WORK" | "SOCIAL" | "CULTURE" | "ETC";
  capacity: number;
  meetingAt: string;
  location: string;
  state: "OPEN";
  participantCount: number;
}

// API 요청 파라미터 타입 정의
export interface MakeClassRequest {
  title: string;
  category: "MEAL" | "WORK" | "SOCIAL" | "CULTURE" | "ETC";
  capacity: number;
  meetingAt: string; // ISO-8601 형식
  location: string;
  photos: File[]; // 이미지 파일 배열
}

/**
 * 모임을 생성합니다.
 * @param requestData 모임 생성 정보
 * @returns 생성된 모임 정보
 */
export const makeClass = async (
  requestData: MakeClassRequest
): Promise<MakeClassResponse> => {
  const formData = new FormData();
  
  formData.append("title", requestData.title);
  formData.append("category", requestData.category);
  formData.append("capacity", String(requestData.capacity));
  formData.append("meetingAt", requestData.meetingAt);
  formData.append("location", requestData.location);
  
  // 동일 키 'photos'로 여러 파일 append
  requestData.photos.forEach((file) => {
    formData.append("photos", file);
  });
  
  const { data } = await apiClient.post<MakeClassResponse>(
    "/api/groups/",
    formData,
    {
      headers: {
        // Content-Type을 명시적으로 제거 (undefined로 설정하면 axios가 설정하지 않음)
      },
      transformRequest: [(data) => {
        // FormData인 경우 그대로 반환 (axios가 자동으로 처리)
        return data;
      }],
    }
  );
  
  return data;
};

