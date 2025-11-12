import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import photoIcon from '@/assets/icons/photo.svg';

interface StepOneInfoProps {
  onNextStep?: () => void;
}

const StepOneInfo: React.FC<StepOneInfoProps> = () => {
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const promises = fileArray.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(promises).then((newImages) => {
        setImages((prev) => [...prev, ...newImages]);
      });
    }
    // 같은 파일을 다시 선택할 수 있도록 value 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePhotoIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Container>
      <TitleSection>
        <Title>모임 제목</Title>
        <TitleInput type="text" placeholder="제목을 입력해주세요." />
      </TitleSection>
      <PhotoSection>
        <Title>대표 사진(선택)</Title>
        <Description>공고에 사용할 사진이 있다면 추가해주세요.</Description>
        <PhotoContainer>
          <PhotoList>
            {images.map((image, index) => (
              <PhotoItem key={index}>
                <PhotoImage src={image} alt={`Uploaded ${index + 1}`} />
                <RemoveButton onClick={() => handleRemoveImage(index)}>×</RemoveButton>
              </PhotoItem>
            ))}
            <PhotoUploadButton onClick={handlePhotoIconClick}>
              <PhotoIcon src={photoIcon} alt="Add photo" />
            </PhotoUploadButton>
          </PhotoList>
          <HiddenFileInput
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
          />
        </PhotoContainer>
      </PhotoSection>
    </Container>
  );
};

export default StepOneInfo;

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
  gap: 15px;
`;

const Title = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const TitleInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  border-radius: 4px;
  background: #FFF;
  border: none;
  outline: none;

  color: #000;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  &::placeholder {
    color: #B8B8B8;
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
`;

const PhotoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  gap: 8px;
  margin-top: 30px;
`;

const Description = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 10px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const PhotoContainer = styled.div`
  width: 100%;
  margin-top: 8px;
`;

const PhotoList = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  justify-content: flex-start;
  
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const PhotoItem = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 94px;
  height: 94px;
  border-radius: 7px;
  overflow: hidden;
`;

const PhotoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  line-height: 1;
  padding: 0;
  
  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;

const PhotoUploadButton = styled.button`
  flex-shrink: 0;
  width: 94px;
  height: 94px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  
  &:hover {
    opacity: 0.8;
  }
`;

const PhotoIcon = styled.img`
  width: 94px;
  height: 94px;
`;

const HiddenFileInput = styled.input`
  display: none;
`;