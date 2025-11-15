import apiClient from "@/api/client";

// API 응답 타입 정의
export interface SingleReviewResponse {
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
    id: number; // 사진 ID (삭제 시 필요)
    photoUrl: string;
    order: number;
  }[];
}

/**
 * 개별 후기 정보를 조회합니다.
 * @param reviewId 후기 ID
 * @returns 후기 정보
 */
export const getSingleReview = async (
  reviewId: number,
): Promise<SingleReviewResponse> => {
  const { data } = await apiClient.get<SingleReviewResponse>(
    `/api/reviews/${reviewId}/`,
  );
  return data;
};

