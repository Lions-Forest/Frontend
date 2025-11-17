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
import { useState } from "react";

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
  const [showMessage, setShowMessage] = useState(false);

  const handleClick = (statusId: string, disabled: boolean) => {
    if (disabled) {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000); // 3초 후 사라짐
      return;
    }
    onChange(statusId as NonNullable<UserLocation["status"]>);
  };

  return (
    <Wrap>
      <Title>내 상태 설정</Title>
      <Description>내 상태를 나타내는 아이콘을 설정해주세요.</Description>

      <BtnContainer>
        {statuses.map((status) => {
          const isActive = selectedStatus === status.id;
          const isDisabled = !shareLocation;
          return (
            <StatusButton
              key={status.id}
              $active={isActive}
              $disabled={isDisabled}
              onClick={() => handleClick(status.id, isDisabled)}
            >
              <Icon
                src={
                  isDisabled
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
      <Message $show={showMessage}>레이더를 켜주세요</Message>
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
  // display: grid;
  // grid-template-columns: 1fr 1fr 1fr 1fr;
  // grid-template-rows: 1fr 1fr;
`;

const Icon = styled.img`
  width: 65.6px;
  height: 96px;
  transition: transform 0.2s ease-in-out;
`;

const StatusButton = styled.button<{ $active: boolean; $disabled: boolean }>`
  position: relative;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: none;
  cursor: pointer;

  ${(props) =>
    props.$active &&
    !props.$disabled &&
    `
    ${Icon} {
      transform: scale(1.25); 
    }
  `}

  ${(props) =>
    props.$disabled &&
    `
    cursor: not-allowed;

    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 65.6px;
      height: 65.6px;
      border-radius: 50%;
      background-color: rgba(0, 0, 0, 0.5);
    }
  `}
`;

const Message = styled.div<{ $show: boolean }>`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  bottom: 225px;
  left: 85%;
  transform: translateX(-50%);
  width: 104px;
  height: 23px;
  padding: 0 5px;
  background-color: #fbbc04;
  border: none;
  border-radius: 50px;
  font-family: dongleRegular;
  font-size: 16px;
  font-weight: 400;
  opacity: ${(props) => (props.$show ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;
  z-index: 100;
  pointer-events: none;
`;
