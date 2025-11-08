import React, { useState } from "react";
import styled from "styled-components";
import background from "../../assets/images/background.png"
import lionWatching from "../../assets/images/lionWatching.png"
import arrow from "../../assets/images/arrow.png"
import type { Meeting } from "@/types";

function formatMeetingDate(date: Date | string) {
    const d = new Date(date);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    let hour = d.getHours();
    const minute = d.getMinutes();
    const ampm = hour >= 12 ? "PM" : "AM";
    let hour12 = hour % 12;
    if (hour12 === 0) hour12 = 12;
  
    const minuteStr = minute !== 0 ? `:${String(minute).padStart(2, '0')}` : '';
    return `${month}/${day} ${hour12}${minuteStr}${ampm}`;
}  

interface MyMeetingProps {
    meetings?: Meeting[];
}

function MyMeeting({ meetings = [] }: MyMeetingProps) {
    const [current, setCurrent] = useState(0);

    const showArrows = meetings.length > 1;
    const meeting = meetings[current];

    return (
        <Layout>
            {/* <SubTitle>내가 신청한 모임</SubTitle> */}
            <MeetingInfo>
                <Background src={background} />
                <Info>
                    <DateInfo>
                        {meetings.length
                        ? formatMeetingDate(meeting.date)
                        : ""}
                    </DateInfo>
                    <Title>
                        {meetings.length
                        ? meeting.title
                        : "신청한 모임이 없습니다."}
                    </Title>
                </Info>
                <LionImage src={lionWatching} />
                {showArrows && (
                <>
                    <ArrowLeft
                    src={arrow}
                    onClick={() => setCurrent((current - 1 + meetings.length) % meetings.length)}
                    />
                    <ArrowRight
                    src={arrow}
                    onClick={() => setCurrent((current + 1) % meetings.length)}
                    />
                </>
                )}
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
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 8px;

    position: relative;
`;

const MeetingInfo = styled.div`

`;

const Info = styled.div`
    position: relative;
    bottom: 50%;
    left: 25%;

    z-index: 2;
`;

const Title = styled.div`
    color: #000;
    font-family: dongleRegular;
    font-size: 33px;
    line-height: normal;
`;

const DateInfo = styled.div`
    color: #848484;
    font-family: dongleRegular;
    font-size: 33px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
`;

const ArrowLeft = styled.img`
    width: 25px;
`;

const ArrowRight = styled.img`
    width: 25px;
    transform: rotate(180deg);
`;

const Background = styled.img`
    width: 450px;
    position: relative;
    display: flex;
    overflow: visible;

    z-index: 1;
`;

const LionImage = styled.img`
    // width: 194px;
    // position: absolute;
    // right: 0%;
    // top: 10%;
    position: absolute;
    right: 15px;  // 박스 바깥으로
    bottom: 67px;
    width: 170px;
    z-index: 2;
    pointer-events: none;
    user-select: none;
`;