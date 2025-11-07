import styled, { keyframes } from "styled-components";
import Background from "@/assets/images/LoadingBackground.svg";
import SpinnerIcon from "@/assets/images/LoadingLion.svg";

export default function LoadingPage() {
  return (
    <PageWrap>
      <Spinner>
        <img src={SpinnerIcon} width={102} height={90} />
      </Spinner>
      <Description>
        <Text>위치 정보를 불러오는 중</Text>
        <Dots />
      </Description>
    </PageWrap>
  );
}

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const PageWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-image: url(${Background});
  background-size: cover;
  background-position: center;
`;

const Spinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 27px;

  img {
    animation: ${rotate} 1.5s linear infinite;
  }
`;

const Description = styled.div`
  width: 121px;
  height: 80px;
  font-size: 64px;
  font-weight: 700;
  border: #ffffff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
`;

const Text = styled.p``;

const Dots = styled.span`
  display: inline-block;
  animation: dots 1.5s steps(3, end) infinite;
  font-size: inherit;
  color: #43d687;

  &::after {
    content: "";
    animation: dots 1.5s steps(4, end) infinite;
  }

  @keyframes dots {
    0%,
    20% {
      content: "";
    }
    40% {
      content: ".";
    }
    60% {
      content: "..";
    }
    80%,
    100% {
      content: "...";
    }
  }
`;
