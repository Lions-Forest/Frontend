import apiClient from "@/api/client";

// API 응답 타입 정의 (필요시 추가)
export interface MakeReviewResponse {
  id: number;
  groupId: number;
  userId: number;
  content: string;
  score: number;
  createdAt: string;
  photos?: {
    photoUrl: string;
    order: number;
  }[];
}

/**
 * 리뷰를 작성합니다.
 * @param groupId 그룹 ID (path parameter)
 * @param requestData 리뷰 작성 데이터
 *   - score: number (필수, 별점 1-5)
 *   - content: string (필수, 후기 내용)
 *   - photos?: File[] (선택적, 사진 파일 배열)
 * @returns 작성된 리뷰 정보
 */
export const makeReview = async (
  groupId: number,
  requestData: {
    score: number;
    content: string;
    photos?: File[];
  },
): Promise<MakeReviewResponse> => {
  // FormData로 변환 (multipart/form-data)
  const formData = new FormData();
  formData.append("score", String(requestData.score));
  formData.append("content", requestData.content);
  
  // photos가 있으면 각 파일을 추가
  if (requestData.photos && requestData.photos.length > 0) {
    requestData.photos.forEach((photo) => {
      formData.append("photos", photo);
    });
  }

  const { data } = await apiClient.post<MakeReviewResponse>(
    `/api/reviews/${groupId}/`,
    formData,
  );
  return data;
};
