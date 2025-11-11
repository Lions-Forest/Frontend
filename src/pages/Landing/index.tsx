// TODO
// 1. BtnSection 디자인 수정하기
// 2. background 반응형 적용 방안 구상하기 (위아래 적절히 잘리도록?)

import { useEffect, useState } from "react";
import styled from "styled-components";
import landingImage from "../../assets/images/landingImage.png";

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

  useEffect(() => {
    const colorTimer = setTimeout(() => setColorStep(true), 2000);
    return () => clearTimeout(colorTimer);
  }, []);

  useEffect(() => {
    const showTimer = setTimeout(() => setShow(true), 3500);
    return () => clearTimeout(showTimer);
  }, []);

  return (
    <div>
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
        <LoginBtn>
          <LoginImg src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" />
          <LoginText>Sign in with Google</LoginText>
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
  // background-position: center;
  // position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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

const LoginBtn = styled.div`
  width: 244px;
  height: 58px;
  border-width: 1px;
  border: 1px solid rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.25);
  background: rgba(255, 255, 255, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  border-radius: 8px;
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
