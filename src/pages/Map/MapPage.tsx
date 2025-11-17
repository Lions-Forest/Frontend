import { getAuth, onAuthStateChanged } from "firebase/auth";
import BaseMap from "./BaseMap";
import { useEffect, useState } from "react";
import LoadingPage from "./LoadingPage";
import { Navigate } from "react-router-dom";
import { getMyInfo } from "@/api/user/myInfoCheckAPI";

export default function MapPage() {
  const [authStatus, setAuthStatus] = useState<
    "loading" | "authed" | "unauthed"
  >("loading");
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);

        let nickname: string | null = localStorage.getItem("nickname");

        if (!nickname) {
          try {
            const myInfo = await getMyInfo();
            nickname = myInfo.nickname;
            localStorage.setItem("nickname", nickname);
            setName(nickname);
          } catch (err) {
            console.error("닉네임 자동 동기화 실패:", err);
            nickname = null;
          }
        }
        setName(
          nickname || user.displayName || user.email?.split("@")[0] || "사용자"
        );
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
