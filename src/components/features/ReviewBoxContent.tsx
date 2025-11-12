import React from 'react'
import styled from 'styled-components'
import ScoreNav from '../common/ScoreNav'
import type { Review } from '@/types'
import WriteButton from '../common/WriteButton'

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

function ReviewBoxContent({ review }: { review: Review }){
  return (
    <ContentLayout>
        <HeaderLayout>
            <ProfileLayout>
                <ProfileImg src={review.writer.photoUrl}/>
                <ProfileInfo>
                    <NameText>{review.writer.name}</NameText>
                    <DateText>{review.date}</DateText>
                </ProfileInfo>
                {userId === review.writer.id && (
                    <WriteButton />
                )}
            </ProfileLayout>
            <ScoreNav review={review}/>
        </HeaderLayout>
        <PhotoList>
        {review.photoUrl && review.photoUrl.map((src, idx) => (
            <Photo src={src} key={idx} alt={`photo${idx}`} />
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
    margin-right: 15.5px;
`;

const ProfileLayout = styled.div`
    display: flex;
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
    text-overflow: ellipsis;
    white-space: nowrap;
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;

    display: flex;
    justify-content: flex-start;
`;