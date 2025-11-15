import { useEffect, useState } from "react";
import styled from "styled-components";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
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

  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const auth = getAuth(db.app);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      console.log("Firebase idToken:", idToken);

      const loginResponse = await loginWithGoogle({ idToken });

      localStorage.setItem("accessToken", loginResponse.accessToken);
      localStorage.setItem("refreshToken", loginResponse.refreshToken);
      localStorage.setItem("userId", String(loginResponse.id));
      localStorage.setItem("nickname", loginResponse.nickname);
      localStorage.setItem("isNewUser", JSON.stringify(loginResponse.newUser));

      navigate("/home");
    } catch (err: any) {
      console.error("Google login failed", err);
      
      // Axios 에러인 경우 서버 응답 메시지 확인
      if (err.response) {
        const status = err.response.status;
        const message = err.response.data?.message || err.response.data?.error || err.message;
        console.error("서버 응답:", err.response.data);
        
        if (status === 500) {
          setError("서버 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.");
        } else {
          setError(message || "로그인에 실패했습니다.\n잠시 후 다시 시도해주세요.");
        }
      } else if (err.code === "auth/popup-closed-by-user") {
        setError("로그인이 취소되었습니다.");
      } else {
        setError(err.message || "로그인에 실패했습니다.\n잠시 후 다시 시도해주세요.");
      }
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
  font-size: 15px;
  font-weight: 600;
  text-align: center;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.25);
  z-index: 10;
  white-space: pre-line;
`;
