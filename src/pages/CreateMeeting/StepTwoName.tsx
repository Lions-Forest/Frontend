import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import errorIcon from '@/assets/icons/error.svg';
import alertboxImage from '@/assets/icons/alertbox.png';
import { getMyInfo } from '@/api/user/myInfoCheckAPI';

interface StepTwoNameProps {
  onNextStep?: () => void;
  onPrevStep?: () => void;
}

const StepTwoName: React.FC<StepTwoNameProps> = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nickname, setNickname] = useState<string>(''); 

  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const data = await getMyInfo();
        setNickname(data.nickname);
      } catch (error) {
        console.error('내 정보 조회 실패:', error);
        // API 실패 시 기존 로컬 스토리지 값을 폴백으로 사용
        const fallbackNickname = localStorage.getItem('nickname') || '임시 닉네임';
        setNickname(fallbackNickname);
      }
    };

    void fetchMyInfo();
  }, []);

  const handleErrorIconClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Container>
        <Title>모임장 이름 확인</Title>
        <Description>모임 정보에 표시될 이름을 확인해주세요</Description>
        <ContentWrapper>
          <NameSection>
            <NameDisplay>
              <NameBox>{nickname}</NameBox>
              <NameText>님</NameText>
            </NameDisplay>
            <ErrorIconButton onClick={handleErrorIconClick}>
              <ErrorIcon src={errorIcon} alt="Error" />
            </ErrorIconButton>
          </NameSection>
        </ContentWrapper>
      </Container>
      {isModalOpen && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalBox onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitleWrapper>
                <ModalTitle>닉네임 변경 방법</ModalTitle>
              </ModalTitleWrapper>
              <CloseButton onClick={handleCloseModal}>
                <CloseIcon viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.5 1.5L13.5 13.5" stroke="#848484" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M13.5 1.5L1.5 13.5" stroke="#848484" strokeWidth="3" strokeLinecap="round"/>
                </CloseIcon>
              </CloseButton>
            </ModalHeader>
            <ModalContent>마이페이지 - 수정하기 - 닉네임 - 직접 입력 or 랜덤 생성</ModalContent>
          </ModalBox>
        </ModalOverlay>
      )}
    </>
  );
};

export default StepTwoName;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;

const Title = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const Description = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 10px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  margin-top: 8px;
`;

const ContentWrapper = styled.div`
  width: 100%;
  margin-top: 16px;
`;

const NameSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const NameDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const NameBox = styled.div`
  width: 283px;
  height: 34px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  color: #000;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  background: #FFF;
  border-radius: 4px;
  border-radius: 7px;
  border: 1px solid #848484;
`;

const NameText = styled.span`
  color: #000;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const ErrorIconButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    opacity: 0.8;
  }
`;

const ErrorIcon = styled.img`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  padding-top: calc(100vh * 3 / 7);
`;

const ModalBox = styled.div`
  position: relative;
  width: 309px;
  height: 85px;
  background-image: url(${alertboxImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 8px 20px 20px 20px;
  box-sizing: border-box;
`;

const ModalHeader = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
`;

const CloseButton = styled.button`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  
  &:hover {
    opacity: 0.8;
  }
`;

const CloseIcon = styled.svg`
  width: 10px;
  height: 10px;
`;

const ModalTitleWrapper = styled.div`
  display: flex;
  width: 103.984px;
  padding: 0 5px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 50px;
  background: #FBBC04;
`;

const ModalTitle = styled.div`
  color: #000;
  text-align: center;
  font-family: dongleRegular;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  white-space: nowrap;
`;

const ModalContent = styled.div`
  color: #000;
  font-family: dongleRegular;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  text-align: center;
`;