import apiClient from "@/api/client";
import type { MyClassListResponse } from "./myClassListAPI";

/**
 * 내가 개설한 모임 목록을 조회합니다.
 * @returns 내가 개설한 모임 목록
 */
export const getMyOpenList = async (): Promise<MyClassListResponse[]> => {
  const { data } = await apiClient.get<MyClassListResponse[]>(
    "/api/groups/leader/",
  );
  return data;
};

