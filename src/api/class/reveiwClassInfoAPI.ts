import apiClient from "@/api/client";

// API 응답 타입 정의
export interface GroupSimpleResponse {
  id: number;
  title: string;
  state: string;
  meetingAt: string;
  participants: string[];
  category: string;
  photos: {
    photoUrl: string;
    order: number;
  }[];
}

/**
 * 그룹의 간단한 정보를 조회합니다.
 * @param groupId 그룹 ID
 * @returns 그룹의 간단한 정보
 */
export const getGroupSimple = async (
  groupId: number,
): Promise<GroupSimpleResponse> => {
  const { data } = await apiClient.get<GroupSimpleResponse>(
    `/api/groups/${groupId}/simple`,
  );
  return data;
};

