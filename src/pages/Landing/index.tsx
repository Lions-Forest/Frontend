import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import landingImage from "../../assets/images/landingImage.png";
import { db } from "@/firebase/firebase";
import { loginWithGoogle } from "@/api/user/login";

type ColorSpanProps = {
  color: string;
  textShadow?: string;
};

type BtnSectionProps = {
  opacity: number;
};

const isInStandaloneMode = () =>
  window.matchMedia?.("(display-mode: standalone)").matches ||
  // iOS PWA
  (window.navigator as any).standalone === true;

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

  // Firebase 리다이렉트 로그인 결과 처리 (PWA/standalone 등에서 사용)
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const auth = getAuth(db.app);
        const redirectPending = localStorage.getItem("googleRedirectPending");
        const result = await getRedirectResult(auth);

        // 리다이렉트 로그인 시도 후 돌아왔는데, 결과/유저가 없으면
        // 시크릿 모드 또는 스토리지 제약 등으로 인해 실패한 것으로 간주
        if (redirectPending === "1" && !result && !auth.currentUser) {
          localStorage.removeItem("googleRedirectPending");
          setError(
            "시크릿 모드 또는 쿠키/스토리지 제한 환경에서는\n구글 로그인이 제한될 수 있습니다.\n일반 브라우저 모드에서 다시 시도해 주세요.",
          );
          return;
        }

        // 리다이렉트 로그인 결과가 없는 첫 방문 등의 경우
        // 단, 이미 로그인된 사용자가 있다면 currentUser로 처리
        if (!result && !auth.currentUser) return;

        setIsLoading(true);
        setError(null);

        const firebaseUser = result?.user ?? auth.currentUser;
        if (!firebaseUser) return;

        localStorage.removeItem("googleRedirectPending");

        const idToken = await firebaseUser.getIdToken();
        const loginResponse = await loginWithGoogle({ idToken });

        localStorage.setItem("accessToken", loginResponse.accessToken);
        localStorage.setItem("refreshToken", loginResponse.refreshToken);
        localStorage.setItem("userId", String(loginResponse.id));
        localStorage.setItem("nickname", loginResponse.nickname);
        localStorage.setItem("isNewUser", JSON.stringify(loginResponse.newUser));

        navigate("/home");
      } catch (err: any) {
        console.error("Google redirect login failed", err);

        // Firebase가 세션스토리지/쿠키 제약으로 state를 잃어버린 경우 안내 문구 표시
        // Axios 에러인 경우 서버 응답 메시지 확인
        if (err.response) {
          const status = err.response.status;
          const message =
            err.response.data?.message ||
            err.response.data?.error ||
            err.message;
          console.error("서버 응답:", err.response.data);

          if (status === 500) {
            setError("서버 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.");
          } else {
            setError(
              message || "로그인에 실패했습니다.\n잠시 후 다시 시도해주세요.",
            );
          }
        } else {
          setError(
            err.message || "로그인에 실패했습니다.\n잠시 후 다시 시도해주세요.",
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    void handleRedirectResult();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const auth = getAuth(db.app);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      if (isInStandaloneMode()) {
        // PWA/설치 앱 환경: 리다이렉트 방식 사용
        localStorage.setItem("googleRedirectPending", "1");
        await signInWithRedirect(auth, provider);
        return;
      }

      // 일반 브라우저: 팝업 방식 사용
      const result = await signInWithPopup(auth, provider);

      const firebaseUser = result.user;
      const idToken = await firebaseUser.getIdToken();
      const loginResponse = await loginWithGoogle({ idToken });

      localStorage.setItem("accessToken", loginResponse.accessToken);
      localStorage.setItem("refreshToken", loginResponse.refreshToken);
      localStorage.setItem("userId", String(loginResponse.id));
      localStorage.setItem("nickname", loginResponse.nickname);
      localStorage.setItem("isNewUser", JSON.stringify(loginResponse.newUser));

      navigate("/home");
    } catch (err: any) {
      console.error("Google login failed", err);
      setError(
        err.message || "로그인에 실패했습니다.\n잠시 후 다시 시도해주세요.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {error && <ErrorBanner role="alert">{error}</ErrorBanner>}
      <Background src={landingImage} />
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
      </BtnSection>
        <HelperText>
          기등록된 멋사 회원만 이용 가능합니다.
          <br />
          멋사에 등록된 구글 계정으로 로그인해 주세요.
        </HelperText>
    </div>
  );
}

export default Index;

// TODO: 랜딩페이지 이미지 확대시키기 (위아래 크롭)
const Background = styled.img`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  object-fit: scale-up;
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
  bottom: 10%;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
//  align-items: center;
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
  text-align: left;
  line-height: 1.5;
  word-break: keep-all;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.25);
  z-index: 10;
  white-space: pre-line;
`;

const HelperText = styled.div`
  margin-top: 12px;
  color: rgba(250, 20, 24, 0.9);

  font-family: Pretendard;
  font-size: 13px;
  font-weight: 700;
  text-align: center;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.35);
  line-height: 1.5;
  white-space: pre-line;
  position: fixed;
  top: 90%;
  left: 30%;
  
`;
