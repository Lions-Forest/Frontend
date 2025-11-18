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

const statusColor: Record<string, string> = {
  nothing: "#848484",
  studying: "#43D687",
  working: "#FEFF00",
  relaxing: "#0095FF",
  eating: "#FF2370",
  playing: "#0CE3D8",
  boring: "#FBBC04",
  hungry: "#C243D6",
};

interface Props {
  name: string;
  status: NonNullable<UserLocation["status"]>;
  onClick: () => void;
}

export default function UserTag({ name, status, onClick }: Props) {
  const statusText = statusToKorean[status] || "상태 X";
  const color = statusColor[status] || "#848484";

  return (
    <TagWrapper $color={color} onClick={onClick}>
      <Nickname $status={status}>{name}</Nickname>
      <StatusContainer>
        <Status>{statusText}</Status>
      </StatusContainer>
    </TagWrapper>
  );
}

const TagWrapper = styled.div<{ $color: string }>`
  display: inline-flex;
  height: 20px;
  border: 1px solid ${(p) => p.$color};
  border-radius: 16px;
  background-color: ${(p) => p.$color};
  cursor: pointer;
  align-items: center;
  transform: translateY(-81.5px);
  pointer-events: none;
`;

const Nickname = styled.div<{ $status: string }>`
  padding: 4px 10px;
  font-family: Pretendard;
  font-size: 10px;
  font-weight: 600;
  color: ${(p) => (p.$status === "working" ? "000000" : "#ffffff")};
  white-space: nowrap;
  line-height: 20px;
`;

const StatusContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 47px;
  height: 100%;
  padding: 4px 12px 4px 9px;
  background-color: #ffffff;
  border: none;
  border-radius: 0 16px 16px 0;
  box-sizing: border-box;
`;

const Status = styled.div`
  font-family: Pretendard;
  font-size: 10px;
  font-weight: 600;
  color: #000000;
`;
