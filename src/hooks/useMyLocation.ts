// useMyLocation.ts
import { useEffect, useRef } from "react";
import { db } from "@/firebase/firebase";
import { doc, setDoc } from "firebase/firestore";

export function useMyLocation({
  userId,
  name,
  shareLocation,
}: {
  userId: string;
  name: string;
  shareLocation: boolean;
}) {
  const lastLocationRef = useRef<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!shareLocation) return;

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const last = lastLocationRef.current;

        // ✅ 1️⃣ 위치 변화가 충분히 큰지 확인 (10m 이상)
        if (last) {
          const distance = getDistanceFromLatLonInMeters(
            last.lat,
            last.lng,
            latitude,
            longitude
          );
          if (distance < 10) return; // 10m 미만이면 Firestore에 안 올림
        }

        lastLocationRef.current = { lat: latitude, lng: longitude };

        // ✅ 2️⃣ Firestore에 업데이트
        await setDoc(doc(db, "locations", userId), {
          userId,
          name,
          latitude,
          longitude,
          shareLocation,
          updatedAt: Date.now(),
        });
      },
      (error) => console.error(error),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [userId, name, shareLocation]);
}

// ✅ 거리 계산 함수 (Haversine 공식)
function getDistanceFromLatLonInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371e3; // 지구 반지름 (m)
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // 거리(m)
}
