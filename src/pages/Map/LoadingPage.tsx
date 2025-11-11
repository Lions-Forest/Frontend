import styled, { keyframes } from "styled-components";
import Background from "@/assets/images/LoadingBackground.svg";
import SpinnerIcon from "@/assets/images/LoadingLion.svg";
import Layout from "@/components/layout/Layout";

export default function LoadingPage() {
  return (
    <Layout>
      <PageWrap>
        <Container>
          <Spinner>
            <img src={SpinnerIcon} width={150} height={120} />
          </Spinner>
          <TextContainer>
            <TextShadow>
              <span>위치</span>
              <span style={{ display: "inline-block", width: "10px" }} />
              <span>로딩중</span>
            </TextShadow>

            <Text>
              <ColoredText color="#FBBC04">위치</ColoredText>
              <span style={{ width: "10px" }} />
              <ColoredText color="#FF2370">로</ColoredText>
              <ColoredText color="#0095FF">딩</ColoredText>
              <ColoredText color="#43D687">중</ColoredText>

              <Dots>
                <DotShadow />
                <DotText />
              </Dots>
            </Text>
          </TextContainer>
        </Container>
      </PageWrap>
    </Layout>
  );
}

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const dotsAnimation = keyframes`
    0%, 20% { content: ""; }
    40% { content: "."; }
    60% { content: ".."; }
    80%, 100% { content: "..."; }
`;

const PageWrap = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${Background});
  background-size: cover;
  background-position: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 85%;
  gap: 10px;
`;

const Spinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    animation: ${rotate} 5s linear infinite;
  }
`;

const TextContainer = styled.div`
  position: relative;
  display: flex;
  align-items: flex-end;
  font-family: dongleBold;
  font-size: 64px;
  font-weight: 700;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
`;

const TextShadow = styled.div`
  color: transparent;
  -webkit-text-stroke: 6px #ffffff;
  position: absolute;
  top: 0;
  left: 0;
`;

const Text = styled.div`
  position: relative;
  display: flex;
  gap: 0;
`;

const ColoredText = styled.span<{ color: string }>`
  color: ${({ color }) => color};
`;

const Dots = styled.span`
  display: inline-block;
  position: relative;
`;

const DotShadow = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  color: transparent;
  -webkit-text-stroke: 6px #ffffff;

  &::after {
    content: "";
    animation: ${dotsAnimation} 2.5s steps(3, end) infinite;
  }
`;

const DotText = styled.span`
  position: relative;
  color: #43d687;

  &::after {
    content: "";
    animation: ${dotsAnimation} 2.5s steps(3, end) infinite;
  }
`;
