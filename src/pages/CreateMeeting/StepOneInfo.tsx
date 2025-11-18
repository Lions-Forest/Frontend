import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import photoIcon from '@/assets/icons/photo.svg';
import xIcon from '@/assets/icons/x.svg';

interface StepOneInfoProps {
  onNextStep?: () => void;
  onDataChange?: (title: string, photos: File[]) => void;
  initialTitle?: string;
  initialPhotos?: File[];
}

const StepOneInfo: React.FC<StepOneInfoProps> = ({ onDataChange, initialTitle = "", initialPhotos = [] }) => {
  const [images, setImages] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>(initialPhotos);
  const [title, setTitle] = useState<string>(initialTitle);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 초기값이 변경되면 로컬 상태 업데이트 (뒤로 가기 시 복원)
  useEffect(() => {
    if (initialTitle && initialTitle !== title) {
      setTitle(initialTitle);
    }
  }, [initialTitle]);

  useEffect(() => {
    // initialPhotos가 변경되면 파일과 이미지 복원
    if (initialPhotos.length > 0) {
      // 파일이 있으면 미리보기 이미지 생성
      const promises = initialPhotos.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      });
      Promise.all(promises).then((newImages) => {
        setImages(newImages);
        setFiles(initialPhotos);
      });
    } else if (initialPhotos.length === 0) {
      // 초기값이 비어있으면 초기화
      setImages([]);
      setFiles([]);
    }
  }, [initialPhotos]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const fileArray = Array.from(selectedFiles);
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
        setFiles((prev) => {
          const updatedFiles = [...prev, ...fileArray];
          // 데이터 변경 시 콜백 호출
          if (onDataChange) {
            onDataChange(title, updatedFiles);
          }
          return updatedFiles;
        });
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
    setFiles((prev) => {
      const updatedFiles = prev.filter((_, i) => i !== index);
      // 데이터 변경 시 콜백 호출
      if (onDataChange) {
        onDataChange(title, updatedFiles);
      }
      return updatedFiles;
    });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    // 15자 이내로 제한
    if (newTitle.length <= 15) {
      setTitle(newTitle);
      // 데이터 변경 시 콜백 호출
      if (onDataChange) {
        onDataChange(newTitle, files);
      }
    }
  };

  return (
    <Container>
      <TitleSection>
        <Title>모임 제목</Title>
        <TitleInput 
          type="text" 
          placeholder="제목을 입력해주세요. (15자 이내)" 
          value={title}
          onChange={handleTitleChange}
          maxLength={15}
        />
      </TitleSection>
      <PhotoSection>
        <Title>대표 사진</Title>
        <Description>공고에 사용할 사진이 있다면 추가해주세요.</Description>
        <PhotoContainer>
          <PhotoList>
            {images.map((image, index) => (
              <PhotoItem key={index}>
                <PhotoImage src={image} alt={`Uploaded ${index + 1}`} />
                <RemoveButton onClick={() => handleRemoveImage(index)}>
                  <XIcon src={xIcon} alt="Remove" />
                </RemoveButton>
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
  bottom: 4px;
  right: 4px;
  width: 12px;
  height: 12px;
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

const XIcon = styled.img`
  width: 12px;
  height: 12px;
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