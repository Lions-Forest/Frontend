import { setDoc, doc, collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

// 내 위치 업로드 (사용자 문서 생성/업데이트)
export const uploadLocation = async (
  userId: string,
  latitude: number,
  longitude: number
) => {
  await setDoc(doc(db, "locations", userId), {
    latitude,
    longitude,
    timestamp: Date.now(),
  });
};

// 모든 사용자 위치 실시간 구독
export const subscribeAllLocations = (callback: (data: any) => void) => {
  const locationsRef = collection(db, "locations");

  // Firestore의 실시간 구독
  const unsubscribe = onSnapshot(locationsRef, (snapshot) => {
    const data: Record<string, any> = {};
    snapshot.forEach((doc) => {
      data[doc.id] = doc.data();
    });
    callback(data);
  });

  // 구독 해제 함수 반환
  return unsubscribe;
};
