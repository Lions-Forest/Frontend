import apiClient from "@/api/client";

/**
 * 지정한 알림을 읽음 처리합니다.
 * @param notificationId 알림 ID
 */
export const markNotificationAsRead = async (notificationId: number) => {
  await apiClient.post(`/api/notifications/${notificationId}/read/`);
};
