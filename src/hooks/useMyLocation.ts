import { useEffect, useRef, useState } from "react";
import { db } from "@/firebase/firebase";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { getDistanceFromLatLonInMeters } from "@/utils/distance";

export function useMyLocation({
  userId,
  name,
  shareLocation,
  status,
  message,
}: {
  userId: string;
  name: string;
  shareLocation: boolean;
  status: string;
  message: string;
}) {
  const [myPosition, setMyPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const lastLocationRef = useRef<{ lat: number; lng: number } | null>(null);

  // 위치 공유 X -> Firestore에서 삭제
  useEffect(() => {
    if (!shareLocation) {
      deleteDoc(doc(db, "locations", userId));
      return;
    }
  }, [shareLocation, userId]);

  // 위치 추적
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setMyPosition({ lat: latitude, lng: longitude });

        const last = lastLocationRef.current;

        // 위치 변화가 충분히 큰지 확인 (20m 이상)
        if (last) {
          const distance = getDistanceFromLatLonInMeters(
            last.lat,
            last.lng,
            latitude,
            longitude
          );
          if (distance < 20) return; // 20m 미만이면 Firestore에 안 올림
        }

        lastLocationRef.current = { lat: latitude, lng: longitude };

        // Firestore에 업데이트
        await setDoc(doc(db, "locations", userId), {
          userId,
          name,
          latitude,
          longitude,
          shareLocation,
          status,
          message,
          updatedAt: Date.now(),
        });
      },
      (error) => console.error(error),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [userId, name, shareLocation, status, message]);

  return myPosition;
}
