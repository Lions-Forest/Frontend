import { useState } from "react";
import styled from "styled-components";
import background from "../../assets/images/background.png";
import lionWatching from "../../assets/images/lionWatching.png";
import arrow from "../../assets/images/arrow.png";
import type { Meeting } from "@/types";

function formatMeetingDate(date: Date | string) {
  const d: Date = date instanceof Date ? date : new Date(date as string);
  
  // 유효한 날짜인지 확인
  if (isNaN(d.getTime())) {
    console.error('Invalid date:', date);
    return '';
  }
  
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour = d.getHours();
  const minute = d.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";
  let hour12 = hour % 12;
  if (hour12 === 0) hour12 = 12;

  const minuteStr = minute !== 0 ? `:${String(minute).padStart(2, "0")}` : "";
  return `${month}/${day} ${hour12}${minuteStr}${ampm}`;
}

interface MyMeetingProps {
  meetings?: Meeting[];
}

function MyMeeting({ meetings = [] }: MyMeetingProps) {
  const [current, setCurrent] = useState(0);

  // const showArrows = meetings.length > 1;
  const meeting = meetings[current];

  return (
    <Layout>
      <Title>내가 신청한 모임</Title>
      <MeetingInfo>
        <Background src={background} />
        <Info>
          <DateInfo>
            {meetings.length ? formatMeetingDate(meeting.date) : ""}
          </DateInfo>
          {meetings.length ? (
            meetings.length > 1 ? (
                <SubTitleSpan>
                  <ArrowLeft
                    src={arrow}
                    onClick={() =>
                      setCurrent((current - 1 + meetings.length) % meetings.length)
                    }
                  />
                  <SubTitle>{meeting.title}</SubTitle>
                  <ArrowRight
                    src={arrow}
                    onClick={() => setCurrent((current + 1) % meetings.length)}
                  />
                </SubTitleSpan>
              ) : (
                <SubTitle>{meeting.title}</SubTitle>
              )
          ) : (
            <NoneTitle>신청한 모임이 없어요</NoneTitle>
          )}
        </Info>
        <LionImage src={lionWatching} />
        
      </MeetingInfo>
    </Layout>
  );
  // return(
  //     <Layout>
  //         <SubTitle>내가 신청한 모임</SubTitle>
  //         <MeetingInfo>
  //             <Background src={background} />
  //             <Info>
  //                 <Date>{}</Date>
  //             </Info>
  //             <LionImage src={lionWatching} />
  //         </MeetingInfo>
  //     </Layout>
  // )
}

export default MyMeeting;

const Layout = styled.div`
  width: 100%;
  padding: 0px 16px 16px 16px 16px;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 8px;

  position: relative;
`;

const Title = styled.div`
  color: #000;
  font-family: dongleLight;
  font-weight: 700;
  font-size: 45px;
  align-self: stretch;
  margin-bottom: 8px;
`;

const SubTitle = styled.div`
  color: #000;
  font-family: dongleRegular;
  font-size: 22px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const NoneTitle = styled.div`
  color: #5f5f5f;
  font-family: dongleRegular;
  font-size: 22px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const MeetingInfo = styled.div`
  position: relative;
  width: 100%;
`;

const Info = styled.div`
  // position: relative;
  // left: -10%;
  // bottom: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: -10%;
  transform: translateY(-50%);
  z-index: 2;
`;

const SubTitleSpan = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

const DateInfo = styled.div`
  color: #848484;
  font-family: dongleLight;
  font-size: 22px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

const ArrowLeft = styled.img`
  width: 10px;
`;

const ArrowRight = styled.img`
  width: 10px;
  transform: rotate(180deg);
`;

const Background = styled.img`
  width: 332px;
  position: relative;
  display: block;
  z-index: 1;
`;

const LionImage = styled.img`
  // position: relative;
  // left: 60%;
  // bottom: 20%;
  position: absolute;
  right: 0%; // 박스 바깥으로
  top: -60%;
  width: 130px;
  z-index: 2;
  pointer-events: none;
  user-select: none;
`;
