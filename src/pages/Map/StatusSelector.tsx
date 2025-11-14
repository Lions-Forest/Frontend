import type { UserLocation } from "@/api/UserLocation";
import styled from "styled-components";
import Nothing from "@/assets/status/nothing.svg";
import NothingActive from "@/assets/status/nothingActive.svg";
import Studying from "@/assets/status/studying.svg";
import StudyingActive from "@/assets/status/studyingActive.svg";
import Working from "@/assets/status/working.svg";
import WorkingActive from "@/assets/status/workingActive.svg";
import Relaxing from "@/assets/status/relaxing.svg";
import RelaxingActive from "@/assets/status/relaxingActive.svg";
import Eating from "@/assets/status/eating.svg";
import EatingActive from "@/assets/status/eatingActive.svg";
import Playing from "@/assets/status/playing.svg";
import PlayingActive from "@/assets/status/playingActive.svg";
import Boring from "@/assets/status/boring.svg";
import BoringActive from "@/assets/status/boringActive.svg";
import Hungry from "@/assets/status/hungry.svg";
import HungryActive from "@/assets/status/hungryActive.svg";

interface StatusSelectorProps {
  selectedStatus: NonNullable<UserLocation["status"]>;
  onChange: (newStatus: NonNullable<UserLocation["status"]>) => void;
  shareLocation: boolean;
}

const statuses = [
  { id: "nothing", defaultImg: Nothing, activeImg: NothingActive },
  { id: "studying", defaultImg: Studying, activeImg: StudyingActive },
  { id: "working", defaultImg: Working, activeImg: WorkingActive },
  { id: "relaxing", defaultImg: Relaxing, activeImg: RelaxingActive },
  { id: "eating", defaultImg: Eating, activeImg: EatingActive },
  { id: "playing", defaultImg: Playing, activeImg: PlayingActive },
  { id: "boring", defaultImg: Boring, activeImg: BoringActive },
  { id: "hungry", defaultImg: Hungry, activeImg: HungryActive },
];

export default function StatusSelector({
  selectedStatus,
  onChange,
  shareLocation,
}: StatusSelectorProps) {
  return (
    <Wrap>
      <Title>내 상태 설정</Title>
      <Description>내 상태를 나타내는 아이콘을 설정해주세요.</Description>

      <BtnContainer>
        {statuses.map((status) => {
          const isActive = selectedStatus === status.id;
          return (
            <StatusButton
              key={status.id}
              active={isActive}
              disabled={!shareLocation}
              onClick={() =>
                onChange(status.id as NonNullable<UserLocation["status"]>)
              }
            >
              <Icon
                src={
                  !shareLocation
                    ? status.defaultImg
                    : isActive
                    ? status.activeImg
                    : status.defaultImg
                }
                alt={status.id}
              />
            </StatusButton>
          );
        })}
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
  flex-wrap: wrap;
  gap: 6px 20px;
  margin-top: 7px;
`;

const Icon = styled.img`
  width: 65.6px;
  height: 96px;
  transition: transform 0.2s ease-in-out;
`;

const StatusButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== "active",
})<{ active: boolean }>`
  padding: 0;
  border: none;
  border-radius: 50%;
  background: none;
  cursor: pointer;

  ${(props) =>
    props.active &&
    !props.disabled &&
    `
    ${Icon} {
      transform: scale(1.25); 
    }
  `}

  &:disabled {
    cursor: not-allowed;
  }
`;
