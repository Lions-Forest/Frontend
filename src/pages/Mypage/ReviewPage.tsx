import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import starOnIcon from "@/assets/icons/starOn.svg";
import starOffIcon from "@/assets/icons/starOff.svg";
import photoIcon from "@/assets/icons/photo.svg";
import xIcon from "@/assets/icons/x.svg";
import BackToNavBar from "@/components/common/BackToNavBar";

function ReviewPage() {
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 임시 데이터
  const meetingData = {
    title: "세션 전 식사하실 분~",
    createdAt: "2025.11.06(6PM)",
    participants: "홍길동, 김철수, 이영희",
    category: "MEAL",
    photos: [{ photoUrl: "https://via.placeholder.com/150", order: 0 }],
  };

  const handleStarClick = (index: number) => {
    setRating(index + 1);
  };

  const handleReviewTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 500) {
      setReviewText(value);
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const fileArray = Array.from(selectedFiles);
      const remainingSlots = 5 - files.length;
      const filesToAdd = fileArray.slice(0, remainingSlots);

      const promises = filesToAdd.map((file) => {
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
        setFiles((prev) => [...prev, ...filesToAdd]);
      });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePhotoIconClick = () => {
    if (files.length < 5) {
      fileInputRef.current?.click();
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleComplete = () => {
    // TODO: API 연동
    console.log("후기 작성 완료", {
      rating,
      reviewText,
      photos: files,
    });
  };

  return (
    <Wrapper>
    <BackToNavBar text="후기 작성하기" />
    <Layout>
      <MeetingCard>
        <CardHeader>
          <CardTitle>{meetingData.title}</CardTitle>
        </CardHeader>
        <CardBody>
          <MeetingImageWrapper>
            {meetingData.photos && meetingData.photos.length > 0 ? (
              <MeetingImage
                src={meetingData.photos[0].photoUrl}
                alt="모임 사진"
              />
            ) : (
              <MeetingImagePlaceholder />
            )}
          </MeetingImageWrapper>
          <MeetingInfo>
            <StatusText>모임 완료</StatusText>
            <CreatedAtText>{meetingData.createdAt}</CreatedAtText>
            <ParticipantsText>참여자: {meetingData.participants}</ParticipantsText>
            <CategoryText>카테고리: {meetingData.category}</CategoryText>
          </MeetingInfo>
        </CardBody>
      </MeetingCard>

      <RatingSection>
        <SectionTitle>별점</SectionTitle>
        <SectionDescription>모임의 별점을 매겨주세요.</SectionDescription>
        <StarRating>
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              src={star <= rating ? starOnIcon : starOffIcon}
              alt={star <= rating ? "채워진 별" : "빈 별"}
              onClick={() => handleStarClick(star - 1)}
            />
          ))}
        </StarRating>
      </RatingSection>

      <ReviewSection>
        <SectionTitle>후기</SectionTitle>
        <SectionDescription>모임 후기를 간단하게 작성해주세요</SectionDescription>
        <ReviewTextAreaWrapper>
          <ReviewTextArea
            ref={textareaRef}
            value={reviewText}
            onChange={handleReviewTextChange}
            placeholder="내용을 입력해주세요."
            maxLength={500}
          />
          <CharacterCount>{reviewText.length}/500자</CharacterCount>
        </ReviewTextAreaWrapper>
      </ReviewSection>

      <PhotoSection>
        <PhotoTitle>모임 사진 (선택)</PhotoTitle>
        <SectionDescription>모임에서 남긴 사진이 있다면 추가해주세요 (최대 5장)</SectionDescription>
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
            {files.length < 5 && (
              <PhotoUploadButton onClick={handlePhotoIconClick}>
                <PhotoIcon src={photoIcon} alt="Add photo" />
              </PhotoUploadButton>
            )}
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

      <ButtonWrapper>
        <CompleteButton onClick={handleComplete}>작성 완료</CompleteButton>
      </ButtonWrapper>
    </Layout>
    </Wrapper>
  );
}

export default ReviewPage;

const Wrapper = styled.div`
  display: felx;
  flex-direction:  
`;

const Layout = styled.div`
  width: 100%;
  background: #E4F2EA;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 21px;
  padding: 16px;
  position: relative;
  padding-bottom: 100px;
`;

const MeetingCard = styled.div`
  width: 100%;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0px 0px 10px #0000001a;
  overflow: hidden;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 35px;
  background: #43d687;
`;

const CardTitle = styled.div`
  color: #000;
  font-family: dongleRegular;
  font-size: 22px;
  font-style: normal;
  font-weight: 700;
`;

const CardBody = styled.div`
  padding: 16px 27px;
  display: flex;
  flex-direction: row;
  gap: 16px;
  align-items: flex-start;
`;

const MeetingImageWrapper = styled.div`
  flex-shrink: 0;
`;

const MeetingImage = styled.img`
  width: 93px;
  height: 95px;
  border-radius: 7px;
  object-fit: cover;
`;

const MeetingImagePlaceholder = styled.div`
  width: 93px;
  height: 95px;
  border-radius: 7px;
  background: #d9d9d9;
`;

const MeetingInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const StatusText = styled.div`
  color: #00b353;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px;
`;

const CreatedAtText = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
`;

const ParticipantsText = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
`;

const CategoryText = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
`;

const RatingSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ReviewSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PhotoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  gap: 8px;
`;

const SectionTitle = styled.div`
  color: #000;
  font-family: dongleRegular;
  font-weight: 700;
  font-size: 30px;
`;

const SectionDescription = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 10px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const PhotoTitle = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const StarRating = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
`;

const StarIcon = styled.img`
  width: 43.403px;
  height: 43.403px;
  flex-shrink: 0;
  cursor: pointer;
  transition: transform 0.1s ease;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ReviewTextAreaWrapper = styled.div`
  position: relative;
  display: flex;
  width: 361px;
  height: 152px;
  padding: 12px;
  align-items: flex-start;
  gap: 10px;
  flex-shrink: 0;
  border-radius: 4px;
  background: #fff;
`;

const ReviewTextArea = styled.textarea`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  color: #000;
  resize: none;
  padding: 0;

  &::placeholder {
    color: #b8b8b8;
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
  }
`;

const CharacterCount = styled.div`
  position: absolute;
  right: 12px;
  bottom: 12px;
  color: #b8b8b8;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
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

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
//  position: fixed;
//  bottom: 0;
//  left: 0;
//  right: 0;
  padding: 10px 16px;
  padding-bottom: 54px;
  background: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
`;

const CompleteButton = styled.button`
  display: flex;
  width: 360px;
  height: 42px;
  padding: 10px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  background: #017f3b;
  border: none;
  cursor: pointer;
  color: #fff;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.98);
  }
`;

