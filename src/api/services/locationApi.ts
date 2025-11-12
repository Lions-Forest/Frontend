import { getCurrentLocation } from "@/utils/getCurrentLocation";

// 나중에 서버 연동 가능
export const fetchCurrentLocation = async () => {
  const coords = await getCurrentLocation();
  return coords;
};
