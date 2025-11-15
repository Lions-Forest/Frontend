import apiClient from "../client";

export const getNotificationNumber = async ( userId: number ) => {
  const data = await apiClient.get(
    `/api/notifications/${userId}/unread/count/`,
  );
  return data.data;
};