import { ref, set, onValue, off } from "firebase/database";
import { db } from "./firebase";

// 내 위치 업로드
export const uploadLocation = async (
  userId: string,
  latitude: number,
  longitude: number
) => {
  await set(ref(db, `locations/${userId}`), {
    latitude,
    longitude,
    timestamp: Date.now(),
  });
};

// 모든 위치 구독
export const subscribeAllLocations = (callback: (data: any) => void) => {
  const locationsRef = ref(db, "locations");

  const unsubscribe = onValue(locationsRef, (snapshot) => {
    const data = snapshot.val() || {};
    callback(data);
  });

  // 구독 해제 함수 반환
  return () => off(locationsRef);
};
