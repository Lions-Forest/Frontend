import { useEffect } from "react";
import { ref, set } from "firebase/database";
import { db } from "@/firebase/firebase";

export const useMyLocation = (userId: string) => {
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        set(ref(db, `users/${userId}/location`), { latitude, longitude });
      },
      (err) => console.error(err),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [userId]);
};
