import type { Meeting } from "@/types";
import { useMemo } from "react";
import styled from "styled-components";

interface DueCardProps {
  meeting: Meeting;
}

function getTimeDiffMs(date: Date | string) {
  const now = new Date();
  const d = date instanceof Date ? date : new Date(date);
  return Math.max(d.getTime() - now.getTime(), 0);
}

// function formatTime(diffMs: number) {
//   const totalSeconds = Math.floor(diffMs / 1000);
//   const minutes = Math.floor(totalSeconds / 60);
//   const seconds = totalSeconds % 60;
//   return `${minutes}M:${String(seconds).padStart(2, '0')}S`;
// }

function formatTime(diffMs: number) {
    let totalSeconds = Math.max(Math.floor(diffMs / 1000), 0);
  
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    totalSeconds %= (60 * 60 * 24);
    const hours = Math.floor(totalSeconds / (60 * 60));
    totalSeconds %= (60 * 60);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
  
    let result = "";
  
    // 최소 M:SS는 항상 보여줌
    if (days > 0) {
      result += `${days}D:`;
    }
    if (hours > 0 || days > 0) {
      result += `${String(hours).padStart(2, "0")}H:`;
    }
    // minutes, seconds는 무조건 표기
    result += `${String(minutes).padStart(2, "0")}M:${String(seconds).padStart(2, "0")}S`;
  
    return result;
}
  

function DueCard({ meeting }: DueCardProps) {
  const diffMs = useMemo(() => getTimeDiffMs(meeting.date), [meeting.date]);
  const timeText = formatTime(diffMs);

  // Calculate member progress
  const progress = meeting.memberNumber / meeting.memberLimit;

  return (
    <CardLayout>
      <Header>
        <Time>{timeText}</Time>
      </Header>
      <Body>
        <CircleOutline>
          <svg viewBox="0 0 65 65">
            <circle
              cx="30"
              cy="30"
              r="25"
              stroke="#C4C4C4"
              strokeWidth="5"
              fill="#DBDBDB"
            />
            <circle
              cx="30"
              cy="30"
              r="25"
              stroke="#FF4081"
              strokeWidth="5"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 25}
              strokeDashoffset={2 * Math.PI * 25 * (1 - progress)}
              strokeLinecap="round"
              transform="rotate(-90 30 30)"
            />
          </svg>
        </CircleOutline>
        <MemberNumber>
          <ColoredCount>{meeting.memberNumber}</ColoredCount>/
          {meeting.memberLimit}
        </MemberNumber>
        <Title>{meeting.title}</Title>
      </Body>
    </CardLayout>
  );
}

export default DueCard;

const CardLayout = styled.div`
  width: 114px;
  height: 139px;
  flex-shrink: 0;
  border-radius: 7px;
  background: #fff;
`;

const Header = styled.div`
  width: 114px;
  height: 26px;
  flex-shrink: 0;
  border-radius: 7px 7px 0 0;
  background: #ff2370;

  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
`;

const Time = styled.div`
  color: #fff;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
`;

const CircleOutline = styled.div`
  width: 63px;
  height: 63px;
`;

// const CircleInline = styled.div`
//     width: 63px;
//     height: 62.994px;
//     flex-shrink: 0;
//     fill: #FF2370;
// `;

const MemberNumber = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;

  display: flex;
`;

const ColoredCount = styled.div`
  color: #ff2370;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const Title = styled.div`
  // width: 103px;
  // height: 12px;
  flex-shrink: 0;
  aspect-ratio: 103/12;
  color: #000;
  text-align: center;
  font-family: Pretendard;
  font-size: 10px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;
