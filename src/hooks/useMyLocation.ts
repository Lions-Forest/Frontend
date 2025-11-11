import { useEffect } from "react";
import { db } from "@/firebase/firebase"; // firestore 초기화
import { doc, setDoc } from "firebase/firestore"; // firestore에서 문서를 생성하거나 업데이트하는 함수

export const useMyLocation = (user: {
  userId: string;
  name: string;
  shareLocation: boolean;
}) => {
  useEffect(() => {
    if (!user.shareLocation) return;

    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        await setDoc(doc(db, "locations", user.userId), {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          status: "study", // 나중에 사용자가 바꿀 수 있음
          shareLocation: user.shareLocation,
          name: user.name,
        });
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [user]);
};
