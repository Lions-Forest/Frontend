import React from "react";
import lionHead from '../../assets/icons/lionHead.png';
import styled from "styled-components";
import CardButton from "./CardButton";
import type { Meeting, Member } from "@/types";

// const exampleOwner: Member = {
//     id: 0,
//     name: '김종앙',
//     nickname: '멋쟁이 사자처럼',
//     photoUrl: 'blank.com',
// }

// const exampleMemberOne: Member = {
//     id: 1,
//     name: '김종앙',
//     nickname: '멋쟁이 사자처럼',
//     photoUrl: 'blank.com',
// }

// const exampleMemberTwo: Member = {
//     id: 2,
//     name: '김종앙',
//     nickname: '멋쟁이 사자처럼',
//     photoUrl: 'blank.com',
// }

interface ColorTheme {
    body: string;
    loading: string;
    button: string;
}

const greenTheme: ColorTheme = {
    body: '#43D687',
    loading: '#FEFF00',
    button:'#017F3B',
}

const pinkTheme: ColorTheme = {
    body: '#FFA3BD',
    loading: '#FFFFFF',
    button: '#FF2370',
}

const blueTheme: ColorTheme = {
    body: '#59B6F8',
    loading: '#FF2370',
    button: '#007ED8',
}

const yellowTheme: ColorTheme = {
    body: '#FBBC04',
    loading: '#FFFFFF',
    button: '#FB7704',
}

function calculateRemaining(meetingDate: Date) {

    const now = new Date();

    const diffMs = meetingDate.getTime() - now.getTime(); // 두 날짜의 밀리초 차이
    const diff = Math.max(diffMs, 0);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    const remaining = { day: days, hour: hours, min: minutes };

    return remaining;
}

function PreviewCard({ meeting }: { meeting: Meeting }
    // id, title, date, type, owner, memberLimit, memberNumber, location,
    // id = 0,
    // title = "세션 전 함께 저녁 먹어요~",
    // date =  new Date('2025-12-08T18:30:00'),
    // type = "식사",
    // owner = exampleOwner,
    // memberNumber = 2,
    // memberLimit = 5,
    // location = "양셰프 중앙대점",
) {
  
  const remaining = calculateRemaining(meeting.date);
  const progress = meeting.memberNumber / meeting.memberLimit;
  let theme : ColorTheme;

  if (meeting.id % 4 === 0) theme = greenTheme;
  else if (meeting.id % 4 === 1) theme = blueTheme;
  else if (meeting.id % 4 === 2) theme = yellowTheme;
  else theme = pinkTheme;  

  return (
    <PreviewCardLayout backgroundColor={theme.body}>
        <TitleLayout>
            <Title>{meeting.title}</Title>
        </TitleLayout>
        <Progress>
            <ProgressOuter>
                <ProgressBarInner width={progress * 100} color={theme.loading}/>
                <ProgressBarLion src={lionHead} left={180 * progress * 1.5}/>
            </ProgressOuter>
            <Time>{`${remaining.day}D : ${String(remaining.hour).padStart(2, '0')}H : ${String(remaining.min).padStart(2, '0')}M`}</Time>
        </Progress>
            <Body>
                <ImagePlaceholder src="https://via.placeholder.com/"/>
                <Info>
                    <InfoTitle>
                        <div>모임 종류</div>
                        <div>모임장</div>
                        <div>인원</div>
                        <div>장소</div>
                    </InfoTitle>
                    <InfoDetail>
                        <div>{meeting.type}</div>
                        <div>{meeting.owner.name}</div>
                        <div>{meeting.memberNumber}/{meeting.memberLimit}</div>
                        <div>{meeting.location}</div>
                    </InfoDetail>
                    {/* <div>모임 종류 <span>{type}</span></div>
                    <div>모임장 <span>{owner.name}</span></div>
                    <div>인원 <span>{memberNumber}/{memberLimit}</span></div>
                    <div>장소 <span>{location}</span></div> */}
                </Info>
            </Body>
            <Buttons>
                <CardButton onInfo={true} />
                <CardButton onJoin={true} color={theme.button}/>
            </Buttons>
    </PreviewCardLayout>
  );
}

export default PreviewCard;


const PreviewCardLayout = styled.div<{ backgroundColor: string }>`
    width: 541px;
    height: 324px;
    border-radius: 10px;
    background: ${({ backgroundColor }) => backgroundColor};
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.10);
`;

const TitleLayout = styled.div`
    width: 541px;
    height: 64.5px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background: #FFFFFF;

    display: flex;
    align-items: center;
    justify-content: start;
    margin-bottom: 18px;
`;

const Title = styled.div`
    font-family: dongleBold;
    font-size: 33px;
    color: #000000;
    padding: 0px 18px;
`;

const Progress = styled.div`
    display: flex;
    margin-left: 24px;
    gap: 24px;
    align-items: center;
`;

const ProgressOuter = styled.div`
    width: 280px;
    height: 10px;
    border-radius: 75px;

    position: relative;
    background: #D9D9D9;
`;

interface ProgressBarInnerProps {
    width?: number;
    color?: string;
}

const ProgressBarInner = styled.div<ProgressBarInnerProps>`
    width: ${props => `${props.width}%` || '0%'};
    height: 10px;
    border-radius: 75px;
    background:${props => `${props.color}` || '#fff'};
`;

const ProgressBarLion = styled.img<{ left?: number }>`
    width: 54px;
    height: 46px;
    margin-left: 3%;
    position: absolute;
    left: ${props => `${props.left}px` || '0px'};
    top: -20px;
    transform: translateX(-50%);
`;

const Time = styled.div`
    font-family: Pretendard;
    font-weight: 700;
    font-size: 22px;
    color: #FFFFFF;
`;

const Body = styled.div`
    width: 510px;
    height: 127px;
    border-radius: 10.5px;
    background: #FFF;
    display: flex;
    margin: 22px 15px 12px 15px;
`;

const ImagePlaceholder = styled.img`
    width: 243px;
    height: 127px;
    background: #C4C4C4;
    border-radius: 10px;
`;

const Info = styled.div`
    display: flex;
    gap: 24px;
`;

const InfoTitle = styled.div`
    display: flex;
    flex-direction: column;
    align-item: start;
    justify-content: center;
    margin-left: 24px;
    gap: 9px;

    color: #000;
    font-family: Pretendard;
    font-size: 15px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
`;

const InfoDetail = styled.div`
    display: flex;
    flex-direction: column;
    align-item: start;
    justify-content: center;
    gap: 9px;
    
    color: #000;
    font-family: Pretendard;
    font-size: 15px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
`;

const Buttons = styled.div`
    display: flex;
    gap: 24px;
    margin: 0px 16px 16px 16px;
`;