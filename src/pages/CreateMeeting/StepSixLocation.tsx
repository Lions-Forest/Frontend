import React, { useState } from 'react';
import styled from 'styled-components';
import searchIcon from '@/assets/icons/search.svg';

interface StepSixLocationProps {
  onNextStep?: () => void;
  onPrevStep?: () => void;
}

const StepSixLocation: React.FC<StepSixLocationProps> = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  const handleSearchClick = () => {
    // API 호출은 추후 구현 예정
    // 임시로 검색어를 주소로 표시
    if (searchQuery.trim()) {
      setAddress(searchQuery.trim());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  return (
    <Container>
      <TitleSection>
        <Title>모임 장소</Title>
        <Description>모임 장소를 정해주세요.</Description>
      </TitleSection>
      <SearchSection>
        <SearchBar>
          <SearchInput
            type="text"
            placeholder="장소 · 주소 검색"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyPress={handleInputKeyPress}
          />
          <SearchIconButton onClick={handleSearchClick}>
            <SearchIcon src={searchIcon} alt="Search" />
          </SearchIconButton>
        </SearchBar>
        {address && (
          <AddressDisplay>
            <AddressText>{address}</AddressText>
          </AddressDisplay>
        )}
      </SearchSection>
    </Container>
  );
};

export default StepSixLocation;

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

const SearchSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  margin-top: 13px;
  gap: 13px;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 35px;
  flex-shrink: 0;
  background: #FFF;
  border-radius: 3px;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
  padding: 0 12px;
  box-sizing: border-box;
  gap: 8px;
`;

const SearchInput = styled.input`
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: #000;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  
  &::placeholder {
    color: #848484;
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
`;

const SearchIconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
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

const SearchIcon = styled.img`
  width: 20px;
  height: 20px;
`;

const AddressDisplay = styled.div`
  width: 100%;
  padding: 12px;
  background: #FFF;
  border-radius: 4px;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.1);
`;

const AddressText = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

