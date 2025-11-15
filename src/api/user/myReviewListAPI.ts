import apiClient from "@/api/client";

// API 응답 타입 정의
export interface MyReviewListResponse {
  id: number;
  groupId: number;
  userId: number;
  userName: string;
  userNickName: string;
  profilePhotoUrl: string;
  groupTitle: string;
  content: string;
  score: number;
  createdAt: string;
  photos: {
    photoUrl: string;
    order: number;
  }[];
}

/**
 * 사용자가 작성한 리뷰 목록을 조회합니다.
 * @param userId 사용자 ID
 * @returns 사용자가 작성한 리뷰 목록
 */
export const getMyReviewList = async (
  userId: number,
): Promise<MyReviewListResponse[]> => {
  const { data } = await apiClient.get<MyReviewListResponse[]>(
    `/api/reviews/by-user/${userId}/`,
    { userId },
  );
  return data;
};

