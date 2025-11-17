import type { UserLocation } from "@/api/UserLocation";
import styled from "styled-components";

const statusToKorean: Record<string, string> = {
  nothing: "상태 X",
  studying: "공부 중",
  working: "작업 중",
  relaxing: "쉬는 중",
  eating: "식사 중",
  playing: "노는 중",
  boring: "심심해",
  hungry: "배고파",
};

interface Props {
  name: string;
  status: NonNullable<UserLocation["status"]>;
  onClick: () => void;
}

export default function UserTag({ name, status, onClick }: Props) {
  const statusText = statusToKorean[status] || "상태 X";

  return (
    <TagWrapper onClick={onClick}>
      <Nickname>{name}</Nickname>
      <StatusContainer>
        <Status>{statusText}</Status>
      </StatusContainer>
    </TagWrapper>
  );
}

const TagWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 20px;
  border: 1px solid #ff2370;
  border-radius: 16px;
  background-color: #ff2370;
  cursor: pointer;
  transform: translateY(-43px);
`;

const Nickname = styled.div`
  padding: 4px 8px;
  font-family: Pretendard;
  font-size: 10px;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap;
  line-height: 20px;
`;

const StatusContainer = styled.div`
  position: absolute;
  top: 0;
  left: 100%;
  display: flex;
  //   justify-content: center;
  //   align-items: center;
  width: 47px;
  height: 100%;
  padding: 4px 12px 4px 9px;
  background-color: #ffffff;
  border: none;
  border-radius: 0 16px 16px 0;
  box-sizing: border-box;
  border-left: 2px solid #ff2370;
`;

const Status = styled.div`
  font-family: Pretendard;
  font-size: 10px;
  font-weight: 600;
  color: #000000;
`;
