import React from 'react';
import styled from 'styled-components';
import arrowBackIcon from '../../assets/icons/arrowBack.svg'; // Correct path relative to src/components/common

interface BackToNavBarProps {
  text: string;
  isNotificationPage?: boolean; // 알림 페이지 여부 (기본값: false)
}

const BackToNavBar: React.FC<BackToNavBarProps> = ({ text, isNotificationPage = false }) => {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <NavBarWrapper $isNotificationPage={isNotificationPage}>
      <BackButton onClick={handleGoBack}>
        <ArrowIcon src={arrowBackIcon} alt="Back" />
      </BackButton>
      <NavText>{text}</NavText>
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