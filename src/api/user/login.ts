import apiClient from "@/api/client";

export type GoogleLoginRequest = {
  idToken: string;
};

export type GoogleLoginResponse = {
  id: number;
  accessToken: string;
  refreshToken: string;
  nickname: string;
  newUser: boolean;
};

export const loginWithGoogle = async (
  payload: GoogleLoginRequest,
): Promise<GoogleLoginResponse> => {
  const { data } = await apiClient.post<GoogleLoginResponse>(
    "/auth/google",
    payload,
  );
  return data;
};