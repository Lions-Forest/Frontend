import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "@/firebase/firebase";

export const useAllLocations = () => {
  const [locations, setLocations] = useState<{
    [key: string]: { latitude: number; longitude: number };
  }>({});

  useEffect(() => {
    const usersRef = ref(db, "users");
    const unsubscribe = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) setLocations(snapshot.val());
    });
    return () => unsubscribe();
  }, []);

  return locations;
};
