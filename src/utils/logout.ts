import { getAuth, signOut } from "firebase/auth";

const clearAuthStorage = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("nickname");
  localStorage.removeItem("isNewUser");
};

export const performLogout = async (): Promise<void> => {
  const auth = getAuth();
  await signOut(auth);
  clearAuthStorage();
};

