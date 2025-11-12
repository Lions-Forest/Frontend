import React, { useState } from 'react';
import styled from 'styled-components';

interface StepThreeTypeProps {
  onNextStep?: () => void;
  onPrevStep?: () => void;
}

const StepThreeType: React.FC<StepThreeTypeProps> = () => {
  const meetingTypes = ['식사', '모각작', '소모임', '문화예술', '기타'];
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleTypeClick = (type: string) => {
    if (selectedType === type) {
      // 이미 선택된 타입을 다시 클릭하면 선택 해제
      setSelectedType(null);
    } else {
      // 다른 타입을 선택
      setSelectedType(type);
    }
  };

  return (
    <Container>
      <TitleSection>
        <Title>모임 종류</Title>
        <Description>모임 종류를 선택해주세요</Description>
      </TitleSection>
      <TypeSection>
        {meetingTypes.map((type, index) => (
          <TypeBox 
            key={index} 
            $isSelected={selectedType === type}
            onClick={() => handleTypeClick(type)}
          >
            <TypeText $isSelected={selectedType === type}>{type}</TypeText>
          </TypeBox>
        ))}
      </TypeSection>
    </Container>
  );
};

export default StepThreeType;

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

const TypeSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  gap: 24px;
  margin-top: 32px;
`;

const TypeBox = styled.div<{ $isSelected: boolean }>`
  display: flex;
  height: 35px;
  padding: 4px 8px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  border-radius: 7px;
  background: ${props => props.$isSelected ? '#43D687' : '#9F9F9F'};
  width: 100%;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const TypeText = styled.div<{ $isSelected: boolean }>`
  color: ${props => props.$isSelected ? '#ffffff' : '#000'};
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;