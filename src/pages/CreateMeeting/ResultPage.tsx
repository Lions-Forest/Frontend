import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import resultOutButtonIcon from '@/assets/icons/resultOutButton.svg';
import resultLionImage from '@/assets/images/resultLion.png';
import resultpageTextImage from '@/assets/icons/resultpageText.png';
import resultBackImage from '@/assets/images/resultBack.png';

const ResultPage: React.FC = () => {
  const navigate = useNavigate();

  const handleIconClick = () => {
    navigate('/home');
  };

  return (
    <ResultContainer>
      <TopSection>
        <CongratulationsImage src={resultpageTextImage} alt="Congratulations" />
        <CompletionText>모임 개설이 완료되었어요</CompletionText>
      </TopSection>
      <ContentArea>
        {/* ResultPage 내용 영역 */}
      </ContentArea>
      <BackgroundImage src={resultBackImage} alt="" />
      <LionImage src={resultLionImage} alt="Result Lion" />
      <BottomActionBar>
        <ActionText>확인하러 가볼까요?</ActionText>
        <ActionIconButton onClick={handleIconClick}>
          <ActionIcon src={resultOutButtonIcon} alt="Go to Home" />
        </ActionIconButton>
      </BottomActionBar>
    </ResultContainer>
  );
};

export default ResultPage;

const ResultContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 430px;
  height: 100vh;
  margin: 0 auto;
//  position: relative;
  background-color: #E2EDE7;
  overflow: hidden;
`;

const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-top: 127px;
  gap: 13px;
  z-index: 10;
`;

const CongratulationsImage = styled.img`
  display: block;
`;

const CompletionText = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const BackgroundImage = styled.img`
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  pointer-events: none;
  width: 100%;
  max-width: 100%;
  height: auto;
  object-fit: contain;
`;

const LionImage = styled.img`
  display: block;
  // width: 140px;
  // height: 251px;
  margin: 40px auto 140px; /* 가운데 정렬 + 상단/하단 여백 */
  position: relative;
  z-index: 2; /* 배경보다 위에 위치 */
`;

const BottomActionBar = styled.div`
  position: absolute;
  bottom: 5%;
  left: 65%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  z-index: 100;
  width: calc(100% - 32px);
  max-width: 398px;
  padding: 0 16px;
`;

const ActionText = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

const ActionIconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
  
  &:hover {
    opacity: 0.8;
  }
  
  &:focus {
    outline: none;
  }
`;

const ActionIcon = styled.img`
  width: 48px;
  height: 48px;
`;