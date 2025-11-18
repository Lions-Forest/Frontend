import { fetchMeetingDetail } from '@/api/meeting/meetingListApi';
import type { Meeting, Review } from '@/types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ReviewBoxContent from './ReviewBoxContent';

export interface ColorTheme {
  header: string;
  subheader: string;
  button: string;
}

const greenTheme: ColorTheme = {
  header: "#43D687",
  subheader: "#F3FEF8",
  button: "#2A6D49",
};

const pinkTheme: ColorTheme = {
  header: "#FF2370",
  subheader: "#FFF0F5",
  button: "#9A1947",
};

const blueTheme: ColorTheme = {
  header: "#59B6F8",
  subheader: "#F0F9FF",
  button: "#0074C6",
};

const yellowTheme: ColorTheme = {
  header: "#FBBC04",
  subheader: "#FFF9E9",
  button: "#B18400",
};

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

type ColorThemeName = 'green' | 'blue' | 'yellow' | 'pink';

interface ReviewBoxProps {
  reviews: Review[];
  color?: ColorThemeName;
}

function ReviewBox({ reviews, color = 'green' }: ReviewBoxProps){
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const navigate = useNavigate();
  
  const getTheme = (colorName: ColorThemeName): ColorTheme => {
    switch (colorName) {
      case 'green':
        return greenTheme;
      case 'blue':
        return blueTheme;
      case 'yellow':
        return yellowTheme;
      case 'pink':
        return pinkTheme;
      default:
        return greenTheme;
    }
  };

  const theme = getTheme(color);

  useEffect(() => {
    const fetchData = async() => {
      try {
        const meetingData = await fetchMeetingDetail(reviews[0].meetingId);
        console.log('해당 meeting 데이터: ', meetingData);
        setMeeting(meetingData);
      } catch (error) {
        console.error("데이터 로딩 실패: ", error);
        setMeeting(null);
      }
    };
    fetchData();
  }, [reviews]);

  const handleBtnClick = () => {
    if (!meeting) return;
    navigate(`/home/meeting-detail/${meeting.id}`, { state: { meeting, remainingTime } });
  };

  if (!meeting) {
    return null;
  }

  const remainingTime = getRelativeTime(meeting.date);

  return (
    <BoxLayout>
        <Header $header={theme.header}>
          <Title>{meeting.title}</Title>
          <HeaderBtn $button={theme.button} onClick={handleBtnClick}>모임 정보 확인</HeaderBtn>
        </Header>
        <SubHeader $subheader={theme.subheader}>
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
            <Info>{meeting.owner?.name || meeting.ownerName || ''}</Info>
          </Row>
        </SubHeader>
        <ReviewSection>
          {reviews.map((review) => (
            <ReviewBoxContent key={review.id} review={review} theme={theme} />
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

const Header = styled.div<{ $header: string }>`
    width: 100%;
    height: 43px;
    flex-shrink: 0;
    border-radius: 8px 8px 0 0;
    background: ${({ $header }) => $header};

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

const HeaderBtn = styled.div<{ $button: string }>`
  display: inline-flex;
  padding: 4px 8px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 7px;
  background: ${({ $button }) => $button};

  color: #FFF;
  font-family: Pretendard;
  font-size: 10px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  cursor: pointer;
`;

const SubHeader = styled.div<{ $subheader: string }>`
  width: 100%;
  flex-shrink: 0;
  background: ${({ $subheader }) => $subheader};
  gap: 16px;
  align-items: center;
  justify-content: center;
  display: flex;
  padding: 15px 20px;

  box-sizing: border-box;
  overflow: hidden;
`;

const Row = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  min-width: 0;
  // flex: 1;
  max-width: 100%;
`;

const Category = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  flex-shrink: 0;
`;

const Info = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0.24px;
  
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
  flex: 1;
`;

const ReviewSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 15px 20px;
`;