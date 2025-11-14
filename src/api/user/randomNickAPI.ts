import apiClient from "@/api/client";

// API 응답 타입 정의
export interface RandomNicknameResponse {
  nickname: string;
}

/**
 * 랜덤 닉네임을 생성합니다.
 * @returns 랜덤 닉네임
 */
export const getRandomNickname = async (): Promise<RandomNicknameResponse> => {
  const { data } = await apiClient.get<RandomNicknameResponse>(
    "/api/users/me/random-nickname"
  );
  return data;
};

