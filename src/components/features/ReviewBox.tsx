import { fetchMeetingDetail } from '@/api/meeting/meetingListApi';
import type { Meeting, Review } from '@/types';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ReviewBoxContent from './ReviewBoxContent';

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

function ReviewBox({ reviews }: { reviews : Review[] }){
  const [meeting, setMeeting] = useState<Meeting>([])
  const navigate = useNavigate();
  const remainingTime = getRelativeTime(meeting.date);

  useEffect(() => {
    const fetchData = async() => {
      try {
        const meeting = await fetchMeetingDetail(reviews[0].meetingId);
        console.log('해당 meeting 데이터: ', meeting);
        setMeeting(meeting);
      } catch (error) {
        console.error("데이터 로딩 실패: ", error);
        setMeeting([]);
      }
    };
    fetchData();
  }, []);

  const handleBtnClick = () => {
    navigate(`/home/meeting-detail/${meeting?.id}`, { state: { meeting, remainingTime } });
  };

  return (
    <BoxLayout>
        <Header>
          <Title>{meeting.title}</Title>
          <HeaderBtn onClick={handleBtnClick}>모임 정보 확인</HeaderBtn>
        </Header>
        <SubHeader>
          <Row>
            <Category>일시</Category>
            <Info>{remainingTime}</Info>
          </Row>
          <div>|</div>
          <Row>
            <Category>장소</Category>
            <Info>{meeting.location}</Info>
          </Row>
          <div>|</div>
          <Row>
            <Category>모임장</Category>
            <Info>김중앙</Info>
          </Row>
        </SubHeader>
        <ReviewSection>
          {reviews.map((review) => (
            <ReviewBoxContent key={review.id} review={review} />
          ))}
        </ReviewSection>
    </BoxLayout>
  )
}

export default ReviewBox;

const BoxLayout = styled.div`
    width: 100%;
    height: height: 100%;
    flex-shrink: 0;
    border-radius: 8px;
    background: #FFF;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.10);
    gap: 15px;
`;

const Header = styled.div`
    width: 100%;
    height: 43px;
    flex-shrink: 0;
    border-radius: 8px 8px 0 0;
    background: #43D687;

    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 20px;
`;

const Title = styled.div`
    color: #000;
    font-family: dongleLight;
    font-size: 22px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
`;

const HeaderBtn = styled.div`
  display: inline-flex;
  padding: 4px 8px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 7px;
  background: #2A6D49;

  color: #FFF;
  font-family: Pretendard;
  font-size: 10px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

const SubHeader = styled.div`
  width: 100%;
  flex-shrink: 0;
  background: #F3FEF8;
  gap: 16px;
  align-items: center;
  justify-content: center;
  display: flex;
  padding: 15px 0px;
  color: #D9D9D9;

  box-sizing: border-box;
  overflow: hidden;
`;

const Row = styled.div`
  display: flex;
  gap: 8px;
`;

const Category = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

const Info = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0.24px;
`;

const ReviewSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 15px 20px;
`;