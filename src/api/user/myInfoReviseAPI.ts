import apiClient from "@/api/client";

// API 응답 타입 정의
export interface MyInfoReviseResponse {
  id: number;
  name: string;
  email: string;
  nickname: string;
  bio: string;
  profile_photo: string;
}

/**
 * 내 정보를 수정합니다.
 * @param formData 수정할 정보 (nickname, bio, profile_photo 파일 - 파일이 없으면 제외)
 * @returns 수정된 내 정보
 */
export const reviseMyInfo = async (
  formData: FormData,
): Promise<MyInfoReviseResponse> => {
  const { data } = await apiClient.put<MyInfoReviseResponse>(
    "/api/users/me",
    formData,
  );
  return data;
};

