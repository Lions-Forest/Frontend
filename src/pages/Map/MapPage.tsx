import { getAuth, onAuthStateChanged } from "firebase/auth";
import BaseMap from "./BaseMap";
import { useEffect, useState } from "react";

export default function MapPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setName(user.displayName || user.email?.split("@")[0] || "사용자");
      } else {
        setUserId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  if (!userId) return <>로그인이 필요합니다.</>;

  return <BaseMap userId={userId} name={name} />;
}
