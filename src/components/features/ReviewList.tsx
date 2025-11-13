import { useEffect, useState } from "react";
import styled from "styled-components";
import ReviewCard from "./ReviewCard";
import type { Review } from "@/types";
import CircleArrow from "../common/CircleArrow";
import { fetchMeetingReviewList } from "@/api/meeting/reviewListApi";

interface ReviewListProps {
    groupId: number,
    onPrev?: () => void;
    onNext?: () => void;
}

function ReviewList({ groupId, onPrev, onNext }: ReviewListProps) {
  const [ reviews, setReviews ] = useState<Review[]>([]);
  
  useEffect (() => {
    const fetchReviewData = async() => {
      try {
        const result = await fetchMeetingReviewList(groupId || 0);
        console.log("전체 후기 리스트: ", result);
        setReviews(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error("데이터 로딩 실패: ", error);
        setReviews([]); // 에러 발생 시 빈 배열로 설정
      }
    };
    fetchReviewData();
  }, []);

    return (
        <ReviewLayout>
          <ReviewTitle>모임 후기</ReviewTitle>
          <ListLayout>
            <ArrowWrapperLeft onClick={onPrev}>
              <CircleArrow direction="left" />
            </ArrowWrapperLeft>
            <CardSection>
              {reviews && reviews.length > 0 ? (
                reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))
              ) : (
                <EmptyText>아직 모임 후기가 없습니다</EmptyText>
              )}
            </CardSection>
            <ArrowWrapperRight onClick={onNext}>
              <CircleArrow direction="right" />
            </ArrowWrapperRight>
          </ListLayout>
        </ReviewLayout>
    )
}

export default ReviewList;

const ReviewLayout = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
`;

const ReviewTitle = styled.div`
    color: #000;
    font-family: dongleRegular;
    font-size: 30px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`;

const ListLayout = styled.div`
    display: flex;
    width: 95%;
    // width: 345px;
    height: 100%;
    padding: 8px 4px;
    align-items: center;
    justify-content: space-between;
    // gap: 10px;
    flex-shrink: 0;
    margin: 2px 8px 16px 8px;
    position: relative;

    border-radius: 8px;
    background: #FFFAE4;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.10);
`;

const CardSection = styled.div`
    display: flex;
    flex: 1;
    // width: 100%;
    height: 100%;
    gap: 5px;
    justify-content: start;
    align-items: center;
    padding: 8px 4px;
`;

const EmptyText = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6B7280;
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
`;

const ArrowWrapperLeft = styled.div`
  position: absolute;
  left: -15px;
  z-index: 2;
  cursor: pointer;
`;

const ArrowWrapperRight = styled.div`
  position: absolute;
  right: -15px;
  z-index: 2;
  cursor: pointer;
`;