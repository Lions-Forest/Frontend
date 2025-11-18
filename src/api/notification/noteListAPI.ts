import apiClient from "@/api/client";
import type { NotificationCardProps } from "@/components/features/NotificationCard";

// 백엔드 API 응답 타입
export interface NotificationResponse {
  id: number;
  content: string;
  photo: string;
  targetId: number;
  targetType: "GROUP" | "RADAR";
  read: boolean;
  createdAt: string; // ISO 8601 형식: "2025-11-12T10:42:34.325Z"
}

/**
 * 사용자의 알림 목록을 조회합니다.
 * @param userId 사용자 ID
 * @returns 알림 목록
 */
export const getNotificationList = async (
  userId: number,
): Promise<NotificationResponse[]> => {
  const { data } = await apiClient.get<NotificationResponse[]>(
    `/api/notifications/${userId}/`,
  );
  return data;
};

/**
 * 날짜를 "25.11.07" 형식으로 변환합니다.
 * @param isoDate ISO 8601 형식의 날짜 문자열
 * @returns "YY.MM.DD" 형식의 날짜 문자열
 */
export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const year = date.getFullYear().toString().slice(-2); // 마지막 2자리
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}.${month}.${day}`;
};

/**
 * content에서 모임명을 추출합니다.
 * content 형식에 따라 파싱 로직을 수정해야 할 수 있습니다.
 * 예: "[25.11.07] 카공 번개 모임 참여가 확정되었어요!" -> "카공 번개"
 * 또는 content가 모임명만 있는 경우 그대로 반환
 * 
 * @param content 알림 내용
 * @returns 모임명
 */
export const extractMeetingName = (content: string): string => {
  // content에서 대괄호 안의 날짜와 "모임 참여가 확정되었어요!" 같은 텍스트를 제거
  // 예: "[25.11.07] 카공 번개 모임 참여가 확정되었어요!" -> "카공 번개"
  const match = content.match(/\[.*?\]\s*(.+?)\s*모임 참여가 확정되었어요!/);
  if (match && match[1]) {
    return match[1].trim();
  }
  
  // 패턴이 맞지 않는 경우 content 그대로 반환
  // (백엔드에서 모임명만 전달하는 경우 등)
  return content.trim();
};

/**
 * 백엔드 응답을 NotificationCard에 필요한 형태로 변환합니다.
 * @param notifications 백엔드에서 받은 알림 목록
 * @returns NotificationCard에 전달할 알림 목록 (최신순 정렬)
 */
export const transformNotifications = (
  notifications: NotificationResponse[],
): NotificationCardProps[] => {
  // createdAt 기준으로 최신순 정렬 후 변환
  return notifications
    .sort((a, b) => {
      // createdAt 기준 내림차순 정렬 (최신순)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .map((notification) => ({
      id: notification.id,
      content: notification.content,
      imageUrl: notification.photo || undefined, // 빈 문자열인 경우 undefined
      targetId: notification.targetId,
      targetType: notification.targetType,
      read: notification.read,
    }));
};

