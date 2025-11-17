import { useEffect, useState } from "react";
import styled from "styled-components";
import ReviewCard from "./ReviewCard";
import type { Meeting, Review } from "@/types";
import CircleArrow from "../common/CircleArrow";
import { fetchAllReview } from "@/api/meeting/reviewListApi";
import { fetchMeetingDetail } from "@/api/meeting/meetingListApi";

function groupBy(array, keyFn) {
  return array.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

function HomeReviewList() {
    // group별 reviews 저장, 슬라이드 인덱스
  const [groupedReviews, setGroupedReviews] = useState<{[key: number]: Review[]}>({});
  const [sortedGroupIds, setSortedGroupIds] = useState<number[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  // API에서 전체 reviews 받아와서 groupId로 묶기
  useEffect(() => {
    (async () => {
      try {
        const result = await fetchAllReview();
        console.log("전체 후기 리스트: ", result);

        const reviews = Array.isArray(result) ? result : [];
        // groupId로 묶고, key(=groupId) 내림차순 정렬
        const grouped = groupBy(reviews, r => r.meetingId);
        const groupIds = Object.keys(grouped)
          .map(Number)
          .sort((a, b) => b - a);
        setGroupedReviews(grouped);
        setSortedGroupIds(groupIds);
        setCurrentIdx(0);
      } catch (e) {
        setGroupedReviews({});
        setSortedGroupIds([]);
        setCurrentIdx(0);
      }
    })();
  }, []);

  // 이동 핸들러
  const onPrev = () => setCurrentIdx(idx => Math.max(0, idx - 1));
  const onNext = () => setCurrentIdx(idx => Math.min(sortedGroupIds.length - 1, idx + 1));

  // 현재 보여줄 groupId 및 후기
  const groupId = sortedGroupIds[currentIdx];
  const currentReviews = (groupedReviews[groupId] || []).slice(0, 4);
  const meetingTitle = currentReviews[0]?.meetingTitle || '';
  const meetingDate = currentReviews[0]?.meetingDate || '';

    return (
        <ReviewLayout>
          <ReviewTitle>지난 모임 후기</ReviewTitle>
          <ListLayout>
            <ArrowWrapperLeft onClick={onPrev}>
              <CircleArrow direction="left" />
            </ArrowWrapperLeft>
            <CardSection>
              <CardHeader>
                <MeetingTitle>{meetingTitle}</MeetingTitle>
                {/* <MeetingDate>{meetingDate}</MeetingDate> */}
              </CardHeader>
              <Body>
              {currentReviews.length > 0 ? (
                currentReviews.map(review => (
                  <ReviewCard key={review.id} review={review} />
                ))
              ) : (
                <EmptyText>아직 모임 후기가 없습니다</EmptyText>
              )}
              </Body>
            </CardSection>
            <ArrowWrapperRight onClick={onNext}>
              <CircleArrow direction="right" />
            </ArrowWrapperRight>
          </ListLayout>
        </ReviewLayout>
    )
}

export default HomeReviewList;

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
  font-weight: 700;
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
    flex-direction: column;
    width: 100%;
    height: 100%;
    justify-content: start;
    align-items: center;
    padding: 8px;
    gap: 6px;
`;

const Body = styled.div`
    display: flex;
    flex: 1;
    width: 100%;
    gap: 5px;
    justify-content: start;
    align-items: center;
    padding: 8px 4px;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-left: 6px;
`;

const MeetingTitle = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 16px; /* 114.286% */
`;

const MeetingDate = styled.div`
  color: #696969;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px; /* 133.333% */
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
    padding: 40px 0px;
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