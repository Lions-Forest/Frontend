import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import starOnIcon from "@/assets/icons/starOn.svg";
import starOffIcon from "@/assets/icons/starOff.svg";
import photoIcon from "@/assets/icons/photo.svg";
import xIcon from "@/assets/icons/x.svg";
import BackToNavBar from "@/components/common/BackToNavBar";
import Footer from "@/components/layout/Footer";
import { getGroupSimple, type GroupSimpleResponse } from "@/api/class/reveiwClassInfoAPI";
import { getSingleReview, type SingleReviewResponse } from "@/api/user/singleReviewAPI";
import { reviseReview } from "@/api/user/reviseReiviewAPI";

function formatMeetingDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = date.getHours();
  const period = hours >= 12 ? "PM" : "AM";
  let hour12 = hours % 12;
  if (hour12 === 0) hour12 = 12;

  return `${year}.${month}.${day}(${hour12}${period})`;
}

function formatCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    MEAL: "식사",
    WORK: "모각작",
    SOCIAL: "소모임",
    CULTURE: "문화예술",
    ETC: "기타",
  };
  return categoryMap[category] || category;
}

function ReviewRevisePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");
  // 이미지 정보: { type: 'existing' | 'new', id?: number, url: string, file?: File, order?: number, photoUrl?: string }
  const [images, setImages] = useState<Array<{ 
    type: 'existing' | 'new'; 
    id?: number; 
    url: string; 
    file?: File;
    order?: number;
    photoUrl?: string;
  }>>([]);
  const [originalRating, setOriginalRating] = useState<number>(0);
  const [originalContent, setOriginalContent] = useState<string>("");
  const [meetingData, setMeetingData] = useState<GroupSimpleResponse | null>(null);
  const [reviewData, setReviewData] = useState<SingleReviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // location.state에서 review_id 가져오기
  const reviewId = location.state?.reviewId as number | undefined;

  useEffect(() => {
    const fetchData = async () => {
      if (!reviewId) {
        console.error("review_id가 없습니다.");
        navigate("/mypage");
        return;
      }

      setIsLoading(true);
      try {
        // 후기 데이터 조회
        const review = await getSingleReview(reviewId);
        setReviewData(review);

        // 후기 데이터로 초기값 설정
        setRating(review.score);
        setReviewText(review.content);
        setOriginalRating(review.score);
        setOriginalContent(review.content);

        // 기존 사진 설정
        const existingPhotosData = review.photos
          .sort((a, b) => a.order - b.order)
          .map((photo) => ({
            type: 'existing' as const,
            id: photo.id,
            url: photo.photoUrl,
            order: photo.order,
            photoUrl: photo.photoUrl,
          }));
        setImages(existingPhotosData);

        // 모임 정보 조회
        const groupData = await getGroupSimple(review.groupId);
        setMeetingData(groupData);
      } catch (error) {
        console.error("데이터 조회 실패:", error);
        alert("후기 정보를 불러오는데 실패했습니다.");
        navigate("/mypage");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [reviewId, navigate]);

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
      const remainingSlots = 5 - images.length;
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

      Promise.all(promises).then((newImageUrls) => {
        const newImageItems = filesToAdd.map((file, index) => ({
          type: 'new' as const,
          url: newImageUrls[index],
          file: file,
        }));
        setImages((prev) => [...prev, ...newImageItems]);
      });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePhotoIconClick = () => {
    if (images.length < 5) {
      fileInputRef.current?.click();
    }
  };

  const handleRemoveImage = (index: number) => {
    // images 배열에서 제거
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleComplete = async () => {
    if (!reviewId || !reviewData) {
      alert("후기 정보가 없습니다.");
      return;
    }

    if (rating === 0) {
      alert("별점을 선택해주세요.");
      return;
    }

    if (!reviewText.trim()) {
      alert("후기 내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 변경된 데이터만 수집
      const requestData: {
        score?: number;
        content?: string;
        deletePhotoIds?: number[];
        addPhotos?: File[];
      } = {};

      // 별점이 변경되었는지 확인
      if (rating !== originalRating) {
        requestData.score = rating;
      }

      // 내용이 변경되었는지 확인
      if (reviewText !== originalContent) {
        requestData.content = reviewText;
      }

      // 삭제된 기존 사진 ID 수집
      const originalPhotoIds = reviewData.photos
        .sort((a, b) => a.order - b.order)
        .map((photo) => photo.id);
      
      // 현재 남아있는 기존 사진 ID들
      const remainingPhotoIds = images
        .filter((img) => img.type === 'existing')
        .map((img) => img.id!);
      
      // 삭제된 사진 ID = 원본에 있던 ID 중 현재 남아있지 않은 ID들
      const deletedPhotoIds = originalPhotoIds.filter(
        (id) => !remainingPhotoIds.includes(id)
      );
      
      if (deletedPhotoIds.length > 0) {
        requestData.deletePhotoIds = deletedPhotoIds;
      }

      // 새로 추가한 파일이 있는지 확인 (images에서 type이 'new'인 것들)
      const newPhotoFiles = images
        .filter((img) => img.type === 'new' && img.file)
        .map((img) => img.file!);
      
      if (newPhotoFiles.length > 0) {
        requestData.addPhotos = newPhotoFiles;
      }

      // 수정할 데이터가 있으면 API 호출
      if (Object.keys(requestData).length > 0) {
        await reviseReview(reviewId, requestData);
        alert("후기가 수정되었습니다.");
      } else {
        alert("변경된 내용이 없습니다.");
      }

      navigate("/mypage");
    } catch (error: any) {
      console.error("후기 수정 실패:", error);
      alert("후기 수정에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Wrapper>
        <BackToNavBar text="후기 수정하기" />
        <ScrollableContent>
          <Layout>
            <LoadingText>로딩 중...</LoadingText>
          </Layout>
        </ScrollableContent>
        <FooterWrapper>
          <Footer />
        </FooterWrapper>
      </Wrapper>
    );
  }

  if (!meetingData || !reviewData) {
    return (
      <Wrapper>
        <BackToNavBar text="후기 수정하기" />
        <ScrollableContent>
          <Layout>
            <LoadingText>후기 정보를 불러올 수 없습니다.</LoadingText>
          </Layout>
        </ScrollableContent>
        <FooterWrapper>
          <Footer />
        </FooterWrapper>
      </Wrapper>
    );
  }

  const formattedDate = formatMeetingDate(meetingData.meetingAt);
  const participantsText = meetingData.participants.join(", ");
  const categoryText = formatCategory(meetingData.category);

  return (
    <Wrapper>
      <BackToNavBar text="후기 수정하기" />
      <ScrollableContent>
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
                <CreatedAtText>{formattedDate}</CreatedAtText>
                <ParticipantsText>참여자: {participantsText}</ParticipantsText>
                <CategoryText>카테고리: {categoryText}</CategoryText>
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
                  <PhotoItem key={image.type === 'existing' 
                    ? `existing-${image.id}` 
                    : `new-${index}`}>
                    <PhotoImage src={image.url} alt={`Photo ${index + 1}`} />
                    <RemoveButton onClick={() => handleRemoveImage(index)}>
                      <XIcon src={xIcon} alt="Remove" />
                    </RemoveButton>
                  </PhotoItem>
                ))}
                {images.length < 5 && (
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
            <CompleteButton onClick={handleComplete} disabled={isSubmitting}>
              {isSubmitting ? "수정 중..." : "수정 완료"}
            </CompleteButton>
          </ButtonWrapper>
        </Layout>
      </ScrollableContent>
      <FooterWrapper>
        <Footer />
      </FooterWrapper>
    </Wrapper>
  );
}

export default ReviewRevisePage;

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ScrollableContent = styled.div`
  flex: 1;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
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
  min-height: 100%;
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
  padding: 10px 16px;
  padding-bottom: 20px;
  margin-top: auto;
`;

const FooterWrapper = styled.div`
  flex-shrink: 0;
  width: 100%;
`;

const LoadingText = styled.div`
  width: 100%;
  padding: 48px 0;
  text-align: center;
  color: #5f5f5f;
  font-family: dongleRegular;
  font-size: 24px;
`;

const CompleteButton = styled.button<{ disabled?: boolean }>`
  display: flex;
  width: 360px;
  height: 42px;
  padding: 10px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  background: ${({ disabled }) => (disabled ? "#848484" : "#017f3b")};
  border: none;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  color: #fff;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;

  &:hover {
    opacity: ${({ disabled }) => (disabled ? 1 : 0.9)};
  }

  &:active {
    transform: ${({ disabled }) => (disabled ? "none" : "scale(0.98)")};
  }
`;

