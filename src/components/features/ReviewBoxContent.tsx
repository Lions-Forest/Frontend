import type { FC } from 'react';
import styled from 'styled-components'
import ScoreNav from '../common/ScoreNav'
import type { Review } from '@/types'
import { useNavigate } from 'react-router-dom'
import { HiMiniPencil as Pen } from "react-icons/hi2";
import type { ColorTheme } from './ReviewBox';

function getRelativeTime(date: Date | string): string {
  const now = new Date();
  const d = date instanceof Date ? date : new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffMinutes = Math.ceil(diffMs / (1000 * 60));
  const diffHours = Math.ceil(diffMinutes / 60);

  if (diffHours <= 23) {
    return `${diffHours}시간 전`;
  }
  // 24시간 초과: 날짜로 표기
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

interface ReviewBoxContentProps {
  review: Review;
  theme: ColorTheme;
}

const ReviewBoxContent: FC<ReviewBoxContentProps> = ({ review, theme }) => {

  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const handleEditClick = (reviewId: number) => {
    navigate("/mypage/review/revise", { state: { reviewId } });
  };

  return (
    <ContentLayout>
        <HeaderLayout>
            <ProfileLayout>
                <ProfileImg src={review.userProfile}/>
                <ProfileInfo>
                    <NameText>{review.userName}</NameText>
                    <DateText>{getRelativeTime(review.date)}</DateText>
                </ProfileInfo>
                {Number(userId) === review.userId && (
                    <EditButton
                      type="button"
                      aria-label="리뷰 수정"
                      $background={theme.subheader}
                      $border={theme.button}
                      onClick={() => handleEditClick(review.id)}
                    >
                      <EditIcon $color={theme.button} />
                    </EditButton>
                )}
            </ProfileLayout>
            <ScoreNav review={review}/>
        </HeaderLayout>
        <PhotoList>
        {review.photo && review.photo.map((photo, index) => (
            <Photo src={photo.photoUrl} key={photo.order || index} alt={`meeting review photo ${photo.order || index}`} />
        ))}
        </PhotoList>
        <ReviewDetail>{review.detail}</ReviewDetail>
    </ContentLayout>
  )
}

export default ReviewBoxContent

const ContentLayout = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: start;
`;

const HeaderLayout = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    align-self: stretch;
`;

const ProfileLayout = styled.div`
    display: flex;
    width: 100%;
    gap: 8px;
    align-items: center;
`;

const ProfileImg = styled.img`
    width: 35px;
    height: 35px;
    flex-shrink: 0;
    border-radius: 35px;
`;

const ProfileInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const NameText = styled.div`
    color: #000;
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
`;

const DateText = styled.div`
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;

    overflow: hidden;
    color: #000;
    text-align: center;
    text-overflow: ellipsis;
    font-family: Pretendard;
    font-size: 10px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
`;

const PhotoList = styled.div`
    display: flex;
    gap: 5px;
    overflow-x: auto;
    width: 100%;
    scrollbar-width: thin; // 파이어폭스
    &::-webkit-scrollbar {
        height: 6px;
    }
`;

const Photo = styled.img`
    width: 66px;
    height: 66px;
    flex-shrink: 0;
    border-radius: 8px;
    background: #C4C4C4;
    object-fit: cover;
`;

const ReviewDetail = styled.div`
    overflow: hidden;
    color: #000;
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;

    display: flex;
    justify-content: flex-start;
    align-self: stretch;
    word-wrap: break-word;
    overflow-wrap: break-word;
`;

const EditButton = styled.button<{ $background: string; $border: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ $background }) => $background};
  border: 1px solid ${({ $border }) => $border};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  z-index: 10;
  flex-shrink: 0;
`;

const EditIcon = styled(Pen)<{ $color: string }>`
  width: 20px;
  height: 20px;
  color: ${({ $color }) => $color};
`;