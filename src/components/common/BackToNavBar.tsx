import React from 'react';
import styled from 'styled-components';
import arrowBackIcon from '../../assets/icons/arrowBack.svg'; // Correct path relative to src/components/common

interface BackToNavBarProps {
  text: string;
}

const BackToNavBar: React.FC<BackToNavBarProps> = ({ text }) => {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <NavBarWrapper>
      <BackButton onClick={handleGoBack}>
        <ArrowIcon src={arrowBackIcon} alt="Back" />
      </BackButton>
      <NavText>{text}</NavText>
    </NavBarWrapper>
  );
};

export default BackToNavBar;

const NavBarWrapper = styled.nav`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 11px 16px;
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
