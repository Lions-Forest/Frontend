import type { UserLocation } from "@/api/UserLocation";
import styled from "styled-components";
import Nothing from "@/assets/status/nothing.svg";
import Studying from "@/assets/status/studying.svg";
import Working from "@/assets/status/working.svg";
import Relaxing from "@/assets/status/relaxing.svg";
import Eating from "@/assets/status/eating.svg";
import Playing from "@/assets/status/playing.svg";
import Boring from "@/assets/status/boring.svg";
import Hungry from "@/assets/status/hungry.svg";

interface StatusSelectorProps {
  selectedStatus: NonNullable<UserLocation["status"]>;
  onChange: React.Dispatch<
    React.SetStateAction<NonNullable<UserLocation["status"]>>
  >;
}

const statuses = [
  { id: "nothing", img: Nothing },
  { id: "studying", img: Studying },
  { id: "working", img: Working },
  { id: "relaxing", img: Relaxing },
  { id: "eating", img: Eating },
  { id: "playing", img: Playing },
  { id: "boring", img: Boring },
  { id: "hungry", img: Hungry },
];

export default function StatusSelector({
  selectedStatus,
  onChange,
}: StatusSelectorProps) {
  return (
    <Wrap>
      <Title>내 상태 설정</Title>
      <Description>내 상태를 나타내는 아이콘을 설정해주세요.</Description>

      <BtnContainer>
        {statuses.map((status) => (
          <StatusButton
            key={status.id}
            active={selectedStatus === status.id}
            onClick={() =>
              onChange(status.id as NonNullable<UserLocation["status"]>)
            }
          >
            <Icon src={status.img} alt={status.id} />
          </StatusButton>
        ))}
      </BtnContainer>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  margin-bottom: 14px;
`;

const Title = styled.p`
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 500;
  color: #000000;
`;

const Description = styled.p`
  font-family: Pretendard;
  font-size: 12px;
  font-weight: 400;
  color: #000000;
`;

const BtnContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 7px;
`;

const StatusButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== "active",
})<{ active: boolean }>`
  padding: 0;
  border: ${({ active }) => (active ? "3px solid #000000" : "none")};
  border-radius: 50%;
  background: none;
  cursor: pointer;
`;

const Icon = styled.img`
  width: 65.6px;
  height: 65.6px;
`;
