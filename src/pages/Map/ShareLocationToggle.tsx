import styled from "styled-components";

interface ShareLocationToggleProps {
  shareLocation: boolean;
  onToggle?: (newValue: boolean) => void;
}

export default function ShareLocationToggle({
  shareLocation,
  onToggle,
}: ShareLocationToggleProps) {
  return (
    <Wrapper>
      <ToggleRow>
        <Title>사자 레이더</Title>

        <ToggleContainer onClick={() => onToggle?.(!shareLocation)}>
          <ToggleLabel>OFF</ToggleLabel>
          <ToggleLabel>ON</ToggleLabel>
          <ToggleSwitch $active={shareLocation}>
            <SwitchLabel>{shareLocation ? "ON" : "OFF"}</SwitchLabel>
          </ToggleSwitch>
        </ToggleContainer>
      </ToggleRow>

      <Description>모임원들과 위치와 상태를 공유할 수 있습니다.</Description>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 32px;
`;

const ToggleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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

const ToggleContainer = styled.div`
  position: relative;
  width: 129px;
  height: 26px;
  border-radius: 20px;
  background-color: #848484;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-sizing: border-box;
`;

const ToggleLabel = styled.p`
  font-family: Dongle;
  font-size: 20px;
  font-weight: 400;
  color: #ffffff;
  user-select: none;
  z-index: 1;
  padding-top: 3px;
`;

const ToggleSwitch = styled.div<{ $active: boolean }>`
  position: absolute;
  left: ${({ $active }) => ($active ? "calc(100% - 75px)" : 0)};
  width: 75px;
  height: 26px;
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: left 0.22s cubic-bezier(0.2, 0.9, 0.3, 1);
  z-index: 2;
  padding-top: 3px;
`;

const SwitchLabel = styled.p`
  font-family: Dongle;
  font-size: 20px;
  font-weight: 400;
  color: #000000;
  user-select: none;
  line-height: 26px;
`;
