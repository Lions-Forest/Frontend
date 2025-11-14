import apiClient from "@/api/client";

// API 응답 타입 정의
export interface MyClassListResponse {
  id: number;
  leaderId: number;
  leaderNickname: string;
  leaderName: string;
  title: string;
  category: string;
  capacity: number;
  meetingAt: string;
  location: string;
  state: string;
  participantCount: number;
  photos: {
    photoUrl: string;
    order: number;
  }[];
}

/**
 * 내가 참여한 모임 목록을 조회합니다.
 * @returns 내가 참여한 모임 목록
 */
export const getMyClassList = async (): Promise<MyClassListResponse[]> => {
  const { data } = await apiClient.get<MyClassListResponse[]>(
    "/api/participation/my/",
  );
  return data;
};
