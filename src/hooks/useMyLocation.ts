import { useEffect, useRef, useState } from "react";
import { db } from "@/firebase/firebase";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { getDistanceFromLatLonInMeters } from "@/utils/distance";

type MyLocationReturn = {
  myPosition: { lat: number; lng: number } | null;
  geoError: GeolocationPositionError | null;
};

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
}): MyLocationReturn {
  const [myPosition, setMyPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [geoError, setGeoError] = useState<GeolocationPositionError | null>(
    null
  );
  const lastLocationRef = useRef<{ lat: number; lng: number } | null>(null);
  const lastMetaRef = useRef<{
    name: string;
    status: string;
    message: string;
  } | null>(null);
  const firstWriteDone = useRef(false);

  // 1) GPS 위치 추적
  useEffect(() => {
    if (!userId) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPosition = { lat: latitude, lng: longitude };
        setMyPosition(newPosition);
        setGeoError(null);
      },
      (error) => {
        console.error("Geolocation Error:", error);
        setGeoError(error);
        setMyPosition(null);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 30000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      lastLocationRef.current = null;
      lastMetaRef.current = null;
      firstWriteDone.current = false;
    };
  }, [userId]);

  // 2) Firestore 업데이트 (단 하나만 존재)
  useEffect(() => {
    if (!userId) return;

    // 위치 공유 끄면 Firestore에서 삭제
    if (!shareLocation) {
      deleteDoc(doc(db, "locations", userId));
      lastLocationRef.current = null;
      lastMetaRef.current = null;
      firstWriteDone.current = false;
      return;
    }

    // 위치 로딩 중이면 DB 쓰기 보류
    if (!myPosition) return;

    const lastLoc = lastLocationRef.current;
    const lastMeta = lastMetaRef.current;

    let shouldWrite = false;

    // 첫 write는 무조건 실행
    if (!firstWriteDone.current) {
      shouldWrite = true;
    } else if (!lastLoc) {
      shouldWrite = true;
    } else {
      // 위치가 20m 이상 변하면 write
      const distance = getDistanceFromLatLonInMeters(
        lastLoc.lat,
        lastLoc.lng,
        myPosition.lat,
        myPosition.lng
      );

      if (distance >= 20) {
        shouldWrite = true;
      } else {
        // 상태(status/message)가 변경된 경우도 write
        if (
          !lastMeta ||
          lastMeta.name !== name ||
          lastMeta.status !== status ||
          lastMeta.message !== message
        ) {
          shouldWrite = true;
        }
      }
    }

    if (!shouldWrite) return;

    // 최신 위치로 ref 업데이트
    lastLocationRef.current = myPosition;
    lastMetaRef.current = { name, status, message };
    firstWriteDone.current = true;

    // Firestore 업데이트
    setDoc(
      doc(db, "locations", userId),
      {
        userId,
        name,
        latitude: myPosition.lat,
        longitude: myPosition.lng,
        shareLocation: true,
        status,
        message,
        updatedAt: Date.now(),
      },
      { merge: true } // likeCount 등 다른 필드가 덮어쓰이지 않음
    );
  }, [userId, name, shareLocation, status, message, myPosition]);

  return { myPosition, geoError };
}
