import apiClient from "@/api/client";

// API 응답 타입 정의 (필요시 추가)
export interface ReviseReviewResponse {
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
 * 후기를 수정합니다.
 * @param reviewId 후기 ID (path parameter)
 * @param requestData 수정할 데이터
 *   - score?: number (선택적, 별점 1-5, 변경 없으면 보내지 않음)
 *   - content?: string (선택적, 후기 내용, 변경 없으면 보내지 않음)
 *   - deletePhotoIds?: number[] (선택적, 삭제할 사진 ID 배열, 없으면 보내지 않음)
 *   - addPhotos?: File[] (선택적, 추가할 사진 파일 배열, 없으면 보내지 않음)
 * @returns 수정된 후기 정보
 */
export const reviseReview = async (
  reviewId: number,
  requestData: {
    score?: number;
    content?: string;
    deletePhotoIds?: number[];
    addPhotos?: File[];
  },
): Promise<ReviseReviewResponse> => {
  // FormData로 변환 (multipart/form-data)
  const formData = new FormData();
  
  // 수정할 데이터만 추가
  if (requestData.score !== undefined) {
    formData.append("score", String(requestData.score));
  }
  
  if (requestData.content !== undefined) {
    formData.append("content", requestData.content);
  }
  
  // deletePhotoIds가 있으면 추가 (배열 형식으로 전송)
  // 백엔드에 따라 deletePhotoIds[] 또는 deletePhotoIds[0], deletePhotoIds[1] 형식이 필요할 수 있음
  if (requestData.deletePhotoIds && requestData.deletePhotoIds.length > 0) {
    console.log("삭제할 사진 ID들 (API 전송 전):", requestData.deletePhotoIds);
    // 방법 1: deletePhotoIds[] 형식
    requestData.deletePhotoIds.forEach((id) => {
      formData.append("deletePhotoIds[]", String(id));
    });
    // 방법 2: deletePhotoIds[0], deletePhotoIds[1] 형식도 시도
    // requestData.deletePhotoIds.forEach((id, index) => {
    //   formData.append(`deletePhotoIds[${index}]`, String(id));
    // });
  }
  
  // addPhotos가 있으면 각 파일을 추가
  if (requestData.addPhotos && requestData.addPhotos.length > 0) {
    requestData.addPhotos.forEach((photo) => {
      formData.append("addPhotos", photo);
    });
  }

  const { data } = await apiClient.patch<ReviseReviewResponse>(
    `/api/reviews/${reviewId}/`,
    formData,
  );
  return data;
};

