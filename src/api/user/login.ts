import apiClient from "@/api/client";

export type GoogleLoginRequest = {
  code: string;
  redirectUri: string;
};

export type GoogleLoginResponse = {
  id: number;
  accessToken: string;
  refreshToken: string;
  firebaseToken: string;
  nickname: string;
  newUser: boolean;
};

export const loginWithGoogle = async (
  payload: GoogleLoginRequest,
): Promise<GoogleLoginResponse> => {
  const requestBody = {
    code: payload.code,
    redirectUri: payload.redirectUri,
  };

  const { data } = await apiClient.post<GoogleLoginResponse>(
    "/auth/google",
    requestBody,
  );

  return data;
};