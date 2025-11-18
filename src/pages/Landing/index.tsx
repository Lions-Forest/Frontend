import { useEffect, useState } from "react";
import styled from "styled-components";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import landingImage from "../../assets/images/landingImage.png";
import landingImageWider from "../../assets/images/WiderLanding.svg"
import { db } from "@/firebase/firebase";
import { loginWithGoogle } from "@/api/user/login";

type ColorSpanProps = {
  color: string;
  textShadow?: string;
};

type BtnSectionProps = {
  opacity: number;
};


function Index() {
  const [colorStep, setColorStep] = useState(false);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const colorTimer = setTimeout(() => setColorStep(true), 2000);
    return () => clearTimeout(colorTimer);
  }, []);

  useEffect(() => {
    const showTimer = setTimeout(() => setShow(true), 3500);
    return () => clearTimeout(showTimer);
  }, []);

  // 이미 백엔드 로그인 토큰이 있다면 바로 홈으로 이동
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      navigate("/home");
    }
  }, [navigate]);

  // Google OAuth Callback 처리 (code 받기)
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const error = urlParams.get("error");

      // 에러가 있으면 표시
      if (error) {
        setError("로그인에 실패했습니다.\n잠시 후 다시 시도해주세요.");
        // URL에서 에러 파라미터 제거
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }

      // code가 없으면 로그인 처리 안 함
      if (!code) return;

      setIsLoading(true);
      setError(null);

      try {
        // URL에서 code 파라미터 제거
        window.history.replaceState({}, document.title, window.location.pathname);

        // 백엔드에 code와 redirectUri 전송
        const redirectUri = window.location.origin;
        const loginResponse = await loginWithGoogle({ 
          code, 
          redirectUri 
        });

        // 백엔드 JWT 토큰 저장
        localStorage.setItem("accessToken", loginResponse.accessToken);
        localStorage.setItem("refreshToken", loginResponse.refreshToken);
        localStorage.setItem("userId", String(loginResponse.id));
        localStorage.setItem("nickname", loginResponse.nickname);
        localStorage.setItem(
          "isNewUser",
          JSON.stringify(loginResponse.newUser)
        );

        // Firebase Custom Token으로 로그인
        const auth = getAuth(db.app);
        await signInWithCustomToken(auth, loginResponse.firebaseToken);

        navigate("/home");
      } catch (err: any) {
        // 서버 에러인 경우 서버 응답 메시지 확인
        if (err.response) {
          const status = err.response.status;
          const message =
            err.response.data?.message ||
            err.response.data?.error ||
            err.message;

          if (status === 500) {
            setError("서버 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.");
          } else {
            setError(
              message || "로그인에 실패했습니다.\n잠시 후 다시 시도해주세요."
            );
          }
        } else {
          setError(
            err.message || "로그인에 실패했습니다.\n잠시 후 다시 시도해주세요."
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    void handleOAuthCallback();
  }, [navigate]);

  const handleGoogleLogin = () => {
    setError(null);
    setIsLoading(true);

    try {
      // Google OAuth Client ID (환경변수에서 가져오거나 직접 입력)
      const clientId =
        import.meta.env.VITE_GOOGLE_CLIENT_ID ||
        "130525625125-uiduhl2t9iugih013903j4ue18lhj2a1.apps.googleusercontent.com";
      const redirectUri = window.location.origin;
      const scope = "openid email profile";
      const responseType = "code";

      // Google OAuth URL 생성
      const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(clientId)}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=${encodeURIComponent(responseType)}&` +
        `scope=${encodeURIComponent(scope)}&` +
        `prompt=select_account`;

      // Google 로그인 페이지로 이동
      window.location.href = oauthUrl;
    } catch (err: any) {
      setError("로그인 페이지로 이동할 수 없습니다.\n잠시 후 다시 시도해주세요.");
      setIsLoading(false);
    }
  };

  return (
    <Root>
      {error && <ErrorBanner role="alert">{error}</ErrorBanner>}
      <Background src={landingImageWider} />
      <OverlayText>
        <ColorSpan
          color={colorStep ? "rgba(255, 234, 0, 1)" : "rgba(255, 255, 255, 1)"}
        >
          모여봐요
        </ColorSpan>
        <br />
        <ColorSpan
          color={colorStep ? "rgba(255, 35, 112, 1)" : "rgba(255, 255, 255, 1)"}
        >
          사
        </ColorSpan>
        <ColorSpan
          color={colorStep ? "rgba(0, 149, 255, 1)" : "rgba(255, 255, 255, 1)"}
        >
          자
        </ColorSpan>
        <ColorSpan
          color={colorStep ? "rgba(251, 188, 4, 1)" : "rgba(255, 255, 255, 1)"}
        >
          의
        </ColorSpan>
        <ColorSpan
          color={colorStep ? "rgba(67, 214, 135, 1)" : "rgba(255, 255, 255, 1)"}
        >
          숲
        </ColorSpan>
      </OverlayText>
      <BtnSection opacity={show ? 1 : 0}>
        <LoginBtn
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          aria-disabled={isLoading}
        >
          <LoginImg src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" />
          <LoginText>
            {isLoading ? "Signing in..." : "Sign in with Google"}
          </LoginText>
        </LoginBtn>
        <HelperText>
          기등록된 멋사 회원만 이용 가능합니다.
          <br />
          멋사에 등록된 구글 계정으로 로그인해 주세요.
        </HelperText>
      </BtnSection>
    </Root>
  );
}

export default Index;

const Root = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const Background = styled.img`
  object-fit: cover;
  width: 100%;
  max-width: 600px;
  height: 100%;
  // width: 100%;
  // display: flex;
  // flex-direction: column;
  // justify-content: center;
  // align-items: center;
  // position: absolute;

  // @media (min-width: 600px) {
  //   bottom: -15%;
  // }
`;

const OverlayText = styled.div`
  position: absolute;
  top: 30%;
  left: 0;
  width: 100%;
  text-align: center;

  font-family: dongleBold;
  font-size: 96px;
  leading-trim: NONE;
  line-height: 80px;
  letter-spacing: 0%;
  color: rgba(255, 255, 255, 1);
  text-shadow: 0px 0px 50px rgba(0, 0, 0, 0.5);
`;

const ColorSpan = styled.span<ColorSpanProps>`
  color: ${({ color }) => color};
  text-shadow: ${({ textShadow }) =>
    textShadow || "0px 4px 7px rgba(0, 0, 0, 0.5)"};
  transition: color 1s, text-shadow 1s;
`;

const BtnSection = styled.div<BtnSectionProps>`
  position: absolute;
  bottom: 7%;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  // opacity: 0%;
  opacity: ${({ opacity }) => opacity}; // 0 또는 1
  transition: opacity 2s;
`;

const LoginBtn = styled.button`
  padding: 15px 20px;
  border-width: 1px;
  border: 1px solid rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.25);
  background: rgba(255, 255, 255, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.8;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
  }
`;

const LoginImg = styled.img`
  width: 25px;
  height: 100%;
`;

const LoginText = styled.div`
  color: rgba(31, 31, 31, 1);
  font-size: 18.5px;
  font-family: Pretendard;
  font-weight: 600;
`;

const ErrorBanner = styled.div`
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  min-width: 280px;
  max-width: 480px;
  padding: 12px 20px;
  border-radius: 12px;
  background: rgba(255, 77, 79, 0.9);
  color: #fff;
  font-family: Pretendard;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  line-height: 1.5;
  word-break: keep-all;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.25);
  z-index: 10;
  white-space: pre-line;
`;

const HelperText = styled.div`
  color: rgba(250, 20, 24, 0.9);
  font-family: Pretendard;
  font-size: 13px;
  font-weight: 700;
  text-align: center;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.35);
  line-height: 1.5;
  white-space: pre-line;
`;
