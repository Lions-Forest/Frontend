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
 * @param requestData 수정할 정보
 *   - nickname: string (필수, 수정사항 없으면 기존 값)
 *   - bio: string (필수, 수정사항 없으면 기존 값)
 *   - removePhoto: boolean (필수, 사진 삭제: true, 사진 유지: false)
 *   - photo?: File (선택적, multipart 파일, removePhoto=false이고 새 파일 선택 시만)
 * @returns 수정된 내 정보
 */
export const reviseMyInfo = async (
  requestData: {
    nickname: string;
    bio: string;
    removePhoto: boolean;
    photo?: File;
  },
): Promise<MyInfoReviseResponse> => {
  // 항상 FormData로 변환 (multipart/form-data)
  const formData = new FormData();
  formData.append("nickname", requestData.nickname);
  formData.append("bio", requestData.bio);
  formData.append("removePhoto", String(requestData.removePhoto));
  if (requestData.photo) {
    formData.append("photo", requestData.photo);
  }
  
  const { data } = await apiClient.patch<MyInfoReviseResponse>(
    "/api/users/me",
    formData,
  );
  return data;
};
