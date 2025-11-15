import React from 'react';
import styled from 'styled-components';
import arrowBackIcon from '../../assets/icons/arrowBack.svg'; // Correct path relative to src/components/common

interface BackToNavBarProps {
  text: string;
  isNotificationPage?: boolean; // 알림 페이지 여부 (기본값: false)
  remainingTime?: string;
}

const BackToNavBar: React.FC<BackToNavBarProps> = ({ text, isNotificationPage = false, remainingTime }) => {
  const handleGoBack = () => {
    window.history.back();
  };

  const showTimeBar = text === '소모임' && !!remainingTime;
  console.log()

  return (
    <NavBarWrapper $isNotificationPage={isNotificationPage}>
      <NavLeft>
        <BackButton onClick={handleGoBack}>
          <ArrowIcon src={arrowBackIcon} alt="Back" />
        </BackButton>
        <NavText>{text}</NavText>
      </NavLeft>
      {showTimeBar && <TimeBar>{remainingTime}</TimeBar>}
    </NavBarWrapper>
  );
};

export default BackToNavBar;

const NavBarWrapper = styled.nav<{ $isNotificationPage: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 11px 16px;
  background-color: ${props => props.$isNotificationPage ? '#ffffff' : '#E2EDE7'};
  color: black;
  justify-content: space-between;
`;

const NavLeft = styled.div`
  display: flex;
  align-items: center;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 12px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ArrowIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const NavText = styled.span`
  font-family: dongleRegular;
  font-weight: 400;
  font-size: 32px;
`;

const TimeBar = styled.div`
  display: flex;
  padding: 4px 8px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 7px;
  background: #43D687;

  color: #FFF;
  font-family: Pretendard;
  font-size: 15px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.6px;
`;