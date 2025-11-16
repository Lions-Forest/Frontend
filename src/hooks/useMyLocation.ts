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

  const [geoError, setGeoError] = useState<GeolocationPositionError | null>(
    null
  );
  const lastLocationRef = useRef<{ lat: number; lng: number } | null>(null);

  // 위치 추적
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const newPosition = { lat: latitude, lng: longitude };

        setMyPosition(newPosition);
        setGeoError(null);

        if (!shareLocation) {
          deleteDoc(doc(db, "locations", userId));
          return;
        }

        const last = lastLocationRef.current;
        let shouldWriteToDB = false;

        // 위치 변화가 충분히 큰지 확인 (20m 이상)
        if (!last) {
          shouldWriteToDB = true; // 토글을 켠 후 최초 1회를 무조건 DB에 씀
        } else {
          const distance = getDistanceFromLatLonInMeters(
            last.lat,
            last.lng,
            latitude,
            longitude
          );
          if (distance >= 20) {
            shouldWriteToDB = true;
          }
        }

        if (!shouldWriteToDB) {
          return;
        }

        lastLocationRef.current = newPosition;

        // Firestore에 업데이트
        await setDoc(doc(db, "locations", userId), {
          userId,
          name,
          latitude,
          longitude,
          shareLocation: true,
          status,
          message,
          updatedAt: Date.now(),
        });
      },
      (error) => {
        console.error("Geolocation Error: ", error);
        setGeoError(error);
        setMyPosition(null);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      lastLocationRef.current = null;
      deleteDoc(doc(db, "locations", userId));
    };
  }, [userId, name, shareLocation, status, message]);

  return { myPosition, geoError };
}
