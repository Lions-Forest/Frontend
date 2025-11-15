import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import searchIcon from '@/assets/icons/search.svg';
import mapPinIcon from '@/assets/icons/map-pin.svg';
import { searchPlaces } from '@/utils/mapUtils';

interface StepSixLocationProps {
  onNextStep?: () => void;
  onPrevStep?: () => void;
  onDataChange?: (location: string) => void;
  initialLocation?: string;
}

const StepSixLocation: React.FC<StepSixLocationProps> = ({ onDataChange, initialLocation = "" }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [address, setAddress] = useState<string>(initialLocation);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // 초기값이 변경되면 로컬 상태 업데이트 (뒤로 가기 시 복원)
  useEffect(() => {
    if (initialLocation) {
      setAddress(initialLocation);
      setSearchQuery(initialLocation);
    }
  }, [initialLocation]);

  const handleSearchClick = () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    // 카카오맵 Places API를 사용한 장소 검색
    searchPlaces(searchQuery.trim(), (data) => {
      setIsLoading(false);
      if (data && data.length > 0) {
        setSearchResults(data);
        // 첫 번째 결과를 기본 선택
        const firstResult = data[0];
        const selectedAddress = firstResult.place_name || firstResult.address_name || searchQuery.trim();
        setAddress(selectedAddress);
        if (onDataChange) {
          onDataChange(selectedAddress);
        }
      } else {
        // 검색 결과가 없으면 검색어를 주소로 사용
        setAddress(searchQuery.trim());
        if (onDataChange) {
          onDataChange(searchQuery.trim());
        }
      }
    });
  };

  const handleResultClick = (result: any) => {
    const selectedAddress = result.place_name || result.address_name || searchQuery.trim();
    setAddress(selectedAddress);
    if (onDataChange) {
      onDataChange(selectedAddress);
    }
    setSearchResults([]);
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
        {isLoading && <LoadingText>검색 중...</LoadingText>}
        {searchResults.length > 0 && (
          <SearchResultsList>
            {searchResults.map((result, index) => (
              <SearchResultItem key={index} onClick={() => handleResultClick(result)}>
                <ResultContent>
                  <ResultIcon src={mapPinIcon} alt="Location" />
                  <ResultTextWrapper>
                    <ResultName>{result.place_name || result.address_name}</ResultName>
                    {result.address_name && result.place_name !== result.address_name && (
                      <ResultAddress>{result.address_name}</ResultAddress>
                    )}
                  </ResultTextWrapper>
                </ResultContent>
              </SearchResultItem>
            ))}
          </SearchResultsList>
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
//  background: transparent;
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

const LoadingText = styled.div`
  color: #848484;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  margin-top: 8px;
`;

const SearchResultsList = styled.div`
  width: 100%;
  max-height: 400px;
  overflow-y: auto;
  margin-top: 8px;
//  background: #FFF;
  border-radius: 4px;
//  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.1);
`;

const SearchResultItem = styled.div`
  padding: 12px;
  cursor: pointer;
  border-bottom: 1px solid #848484;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ResultContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ResultIcon = styled.img`
  width: 15px;
  padding: 1px 2px;
  flex-shrink: 0;
  object-fit: contain;
`;

const ResultTextWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ResultName = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const ResultAddress = styled.div`
  color: #848484;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

