import { getAuth, onAuthStateChanged } from "firebase/auth";
import BaseMap from "./BaseMap";
import { useEffect, useState } from "react";
import LoadingPage from "./LoadingPage";
import { Navigate } from "react-router-dom";

export default function MapPage() {
  const [authStatus, setAuthStatus] = useState<
    "loading" | "authed" | "unauthed"
  >("loading");
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setName(user.displayName || user.email?.split("@")[0] || "사용자");
        setAuthStatus("authed");
      } else {
        setUserId(null);
        setAuthStatus("unauthed");
      }
    });
    return () => unsubscribe();
  }, []);

  if (authStatus === "loading") {
    return <LoadingPage />;
  }

  if (authStatus === "unauthed") {
    return <Navigate to="/" replace />;
  }

  return <BaseMap userId={userId!} name={name} />;
}
