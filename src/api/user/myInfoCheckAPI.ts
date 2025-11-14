import apiClient from "@/api/client";

// API 응답 타입 정의
export interface MyInfoResponse {
  id: number;
  name: string;
  email: string;
  nickname: string;
  bio: string;
  profile_photo: string | null;
}

/**
 * 내 정보를 조회합니다.
 * @returns 내 정보
 */
export const getMyInfo = async (): Promise<MyInfoResponse> => {
  const { data } = await apiClient.get<MyInfoResponse>("/api/users/me");
  return data;
};

