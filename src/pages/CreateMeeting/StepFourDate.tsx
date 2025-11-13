import React, { useState } from 'react';
import styled from 'styled-components';
import toggleArrowIcon from '@/assets/icons/toggleArrow.svg';

interface StepFourDateProps {
  onNextStep?: () => void;
  onPrevStep?: () => void;
}

const StepFourDate: React.FC<StepFourDateProps> = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string>('01');
  
  const memberOptions = Array.from({ length: 10 }, (_, i) => 
    String(i + 1).padStart(2, '0')
  );

  const handleToggleClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMemberSelect = (member: string) => {
    setSelectedMember(member);
    setIsDropdownOpen(false);
  };

  return (
    <Container>
      <TitleSection>
        <Title>모임 인원</Title>
        <Description>참여 인원을 설정해주세요.</Description>
      </TitleSection>
      <DropdownSection>
        <ToggleContainer>
          <ToggleBox onClick={handleToggleClick}>
            <MemberText>{selectedMember}</MemberText>
            <ToggleIcon src={toggleArrowIcon} alt="Toggle" $isOpen={isDropdownOpen} />
          </ToggleBox>
          <MemberUnit>명</MemberUnit>
        </ToggleContainer>
        {isDropdownOpen && (
          <DropdownList>
            {memberOptions.map((member) => (
              <DropdownItem 
                key={member}
                onClick={() => handleMemberSelect(member)}
                $isSelected={selectedMember === member}
              >
                {member}
              </DropdownItem>
            ))}
          </DropdownList>
        )}
      </DropdownSection>
    </Container>
  );
};

export default StepFourDate;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  gap: 8px;
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
`;

const DropdownSection = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  margin-top: 32px;
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ToggleBox = styled.button`
  display: flex;
  width: 144px;
  height: 35px;
  border-radius: 8px;
  border: 1px solid #848484;
  background: #E2EDE7;
  cursor: pointer;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  box-sizing: border-box;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:focus {
    outline: none;
  }
`;

const MemberUnit = styled.span`
  color: #000;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const MemberText = styled.span`
  color: #000;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const ToggleIcon = styled.img<{ $isOpen: boolean }>`
  width: 20px;
  height: 20px;
  transition: transform 0.2s ease;
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const DropdownList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 144px;
  margin-top: 4px;
  border-radius: 8px;
  border: 1px solid #848484;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: 200px;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const DropdownItem = styled.div<{ $isSelected: boolean }>`
  display: flex;
  padding: 8px 16px;
  align-items: center;
  gap: 8px;
  align-self: stretch;
  cursor: pointer;
  color: #000;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  background: ${props => props.$isSelected ? 'rgba(67, 214, 135, 0.2)' : 'transparent'};
  
  &:hover {
    background: rgba(67, 214, 135, 0.1);
  }
  
  &:first-child {
    border-radius: 8px 8px 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 8px 8px;
  }
`;