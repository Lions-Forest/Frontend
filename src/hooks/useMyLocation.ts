import { useEffect, useRef, useState } from "react";
import { db } from "@/firebase/firebase";
import { deleteDoc, doc, setDoc } from "firebase/firestore";

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

  useEffect(() => {
    if (!shareLocation) {
      deleteDoc(doc(db, "locations", userId));
      return;
    }
  }, [shareLocation, userId]);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setMyPosition({ lat: latitude, lng: longitude });

        const last = lastLocationRef.current;

        // 위치 변화가 충분히 큰지 확인 (10m 이상)
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

// 거리 계산 함수 (Haversine 공식)
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
