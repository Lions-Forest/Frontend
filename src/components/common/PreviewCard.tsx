// TODO: width px -> %로 바꾸기

import { useNavigate } from "react-router-dom";
import lionHead from '../../assets/icons/lionHead.png';
import styled from "styled-components";
import CardButton from "./CardButton";
import type { Meeting } from "@/types";
import { cancelJoinMeeting, deleteMeeting, fetchMyMeetingList, joinMeeting } from "@/api/meeting/meetingJoinApi";
import { useEffect, useState } from "react";
import CheckingModal from "../features/CheckingModal";

interface ColorTheme {
  body: string;
  loading: string;
  button: string;
}

const greenTheme: ColorTheme = {
  body: "#43D687",
  loading: "#FEFF00",
  button: "#017F3B",
};

const pinkTheme: ColorTheme = {
  body: "#FFA3BD",
  loading: "#FFFFFF",
  button: "#FF2370",
};

const blueTheme: ColorTheme = {
  body: "#59B6F8",
  loading: "#FF2370",
  button: "#007ED8",
};

const yellowTheme: ColorTheme = {
  body: "#FBBC04",
  loading: "#FFFFFF",
  button: "#FB7704",
};

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

interface PreviewCardProps {
  meeting: Meeting;
  // 상위(홈)에서 리스트를 다시 불러오도록 하는 콜백
  onChange?: () => void;
}

function PreviewCard({ meeting, onChange }: PreviewCardProps) {
  const navigate = useNavigate();
  const remaining = calculateRemaining(meeting.date);
  const remainingTime = `${remaining.day}D : ${String(remaining.hour).padStart(2, '0')}H : ${String(remaining.min).padStart(2, '0')}M`;
  const progress = meeting.memberNumber / meeting.memberLimit;

  const [ joinState, setJoinState ] = useState<'join' | 'cancel'>('join');
  const [showModal, setShowModal] = useState(false);

  const userId = localStorage.getItem("userId");
  const isOwner =
    meeting?.owner && userId
      ? Number(userId) === meeting.owner.id
      : false;

  let theme: ColorTheme;

  if (meeting.id % 4 === 1) theme = greenTheme;
  else if (meeting.id % 4 === 2) theme = blueTheme;
  else if (meeting.id % 4 === 3) theme = yellowTheme;
  else theme = pinkTheme;

  useEffect (() => {
    const fetchJoinState = async() => {
      try {
        const result = await fetchMyMeetingList();
        console.log("나의 후기 리스트: ", result);
        if (result.some(m => m.id === meeting.id)) setJoinState('cancel');
      } catch (error) {
        console.error("데이터 로딩 실패: ", error);
        setJoinState('join');
      }
    };
    fetchJoinState();
  }, []);


  const handleCardClick = () => {
    navigate(`/home/meeting-detail/${meeting.id}`, { state: { meeting, remainingTime } });
  };

    const handleDelete = async () => {
        if (!meeting?.id) return;

        try {
            await deleteMeeting(meeting.id);
            setJoinState('cancel');
            // 홈(상위) 데이터 새로고침
            onChange?.();
        } catch(e) {
            console.log("handleDelete 함수 실패: ", e);
        }
    }

    const handleJoin = async () => {
        if (!meeting?.id) return;

        try {
            await joinMeeting(meeting.id);
            setJoinState('cancel');
        } catch(e) {
            console.log("handleJoin 함수 실패: ", e);
        }
    }

    const handleJoinCancel = async () => {
        if (!meeting?.id) return;

        try {
            await cancelJoinMeeting(meeting.id);
            setJoinState('join');
        } catch(e) {
            console.log("handleJoin 함수 실패: ", e);
        }
    }


  return (
    <PreviewCardLayout backgroundColor={theme.body}>
        <TitleLayout>
            <Title>{meeting.title}</Title>
        </TitleLayout>
        <Progress>
            <ProgressOuter>
                <ProgressBarInner width={progress * 100} color={theme.loading}/>
                <ProgressBarLion src={lionHead} left={180 * progress}/>
            </ProgressOuter>
            <Time>{remainingTime}</Time>
        </Progress>
            <Body>
                <ImagePlaceholder 
                    src={
                        meeting.photo && meeting.photo.length > 0
                            ? meeting.photo.find(p => p.order === 0)?.photoUrl || meeting.photo[0].photoUrl
                            : ''
                    } 
                    alt={meeting.title}
                />
                <Info>
                    <InfoTitle>
                        <div>모임 종류</div>
                        <div>모임장</div>
                        <div>인원</div>
                        <div>장소</div>
                    </InfoTitle>
                    <InfoDetail>
                        <div>{meeting.type}</div>
                        <div>
                          {meeting.complete
                            ? meeting.owner?.name
                            : meeting.owner?.nickname}
                        </div>
                        <div>{meeting.memberNumber}/{meeting.memberLimit}</div>
                        <div>{meeting.location}</div>
                    </InfoDetail>
                </Info>
            </Body>
            <Buttons onClick={(e) => e.stopPropagation()}>
              <CardButton onInfo={true} onClick={handleCardClick} />
            { !meeting.complete ? (
                meeting.memberNumber === meeting.memberLimit ? (
                  <CardButton onClose={true} />
                ) : (
                  isOwner === false ? (
                    joinState === 'join' ? (
                      <CardButton onJoin={true} onClick={handleJoin} color={theme.button}/>
                    ) : (
                      <CardButton onJoinCancel={true} onClick={handleJoinCancel} color={theme.button}/>
                    )
                  ) : (
                    <CardButton onMakeCancel={true} onClick={() => setShowModal(true)} color={theme.button}/>
                  )
                )
              ) : (
                <>
                  <CardButton onClose={true} />
                </>
              )}
            </Buttons>
            {showModal && (
                <CheckingModal onClick={handleDelete} onClose={() => setShowModal(false)} />
            )}
    </PreviewCardLayout>
  );
}

export default PreviewCard;

const PreviewCardLayout = styled.div<{ backgroundColor: string }>`
    // width: 361px;
    width: 100%;
    height: 100%;
    min-height: 216px;
    border-radius: 7px;
    background: ${({ backgroundColor }) => backgroundColor};
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.10);
`;

const TitleLayout = styled.div`
    // width: 361px;
    width: 100%;
    height: 43px;
    border-top-left-radius: 7px;
    border-top-right-radius: 7px;
    background: #FFFFFF;

  display: flex;
  align-items: center;
  justify-content: start;
  margin-bottom: 15px;
`;

const Title = styled.div`
  font-family: dongleBold;
  font-size: 22px;
  color: #000000;
  padding: 0px 18px;
`;

const Progress = styled.div`
  display: flex;
  margin: 0px 16px;
  gap: 16px;
  align-items: center;
  width: 100%;
`;

const ProgressOuter = styled.div`
  width: 187px;
  height: 7px;
  border-radius: 50px;

  position: relative;
  background: #d9d9d9;
`;

interface ProgressBarInnerProps {
  width?: number;
  color?: string;
}

const ProgressBarInner = styled.div<ProgressBarInnerProps>`
  width: ${(props) => `${props.width}%` || "0%"};
  height: 7px;
  border-radius: 50px;
  background: ${(props) => `${props.color}` || "#fff"};
`;

const ProgressBarLion = styled.img<{ left?: number }>`
  width: 36px;
  height: 31px;
  margin-left: 3%;
  position: absolute;
  left: ${(props) => `${props.left}px` || "0px"};
  top: -15px;
  transform: translateX(-50%);
`;

const Time = styled.div`
  font-family: Pretendard;
  font-weight: 700;
  font-size: 15px;
  color: #ffffff;
`;

const Body = styled.div`
  // width: 100%;
  // width: 340px;
  height: 85px;
  border-radius: 7px;
  background: #fff;
  display: flex;
  margin: 10px 10px;
`;

const ImagePlaceholder = styled.img`
  width: 48%;
  height: 85px;
  background: #fff;
  border-radius: 7px;
  object-fit: scale-down; // TODO: 이게 낫나,,? 아님 그냥 cover로 바꿔??
`;

const Info = styled.div`
  display: flex;
  gap: 14.87px;
`;

const InfoTitle = styled.div`
  display: flex;
  flex-direction: column;
  align-item: start;
  justify-content: center;
  margin-left: 16px;
  gap: 6px;

  color: #000;
  font-family: Pretendard;
  font-size: 10px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

const InfoDetail = styled.div`
  display: flex;
  flex-direction: column;
  align-item: start;
  justify-content: center;
  gap: 6px;

  color: #000;
  font-family: Pretendard;
  font-size: 10px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin: 11px;
`;
