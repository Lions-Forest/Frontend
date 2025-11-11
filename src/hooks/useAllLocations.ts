import type { UserLocation } from "@/api/UserLocation";
import { db } from "@/firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export function useAllLocations() {
  const [locations, setLocations] = useState<Record<string, UserLocation>>({});

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "locations"), (snapshot) => {
      console.log("snapshot docs:", snapshot.docs);
      const newLocations: Record<string, UserLocation> = {};
      snapshot.docs.forEach((doc) => {
        const data = doc.data() as UserLocation;
        if (data.shareLocation) newLocations[data.userId] = data;
      });
      console.log("newLocations:", newLocations);
      setLocations(newLocations);
    });
    return () => unsubscribe();
  }, []);
  return locations;
}
