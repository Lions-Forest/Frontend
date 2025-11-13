import styled from "styled-components";

interface ShareLocationToggleProps {
  shareLocation: boolean;
  onToggle: () => void;
}

export default function ShareLocationToggle({
  shareLocation,
  onToggle,
}: ShareLocationToggleProps) {
  return (
    <Wrapper>
      <ToggleRow>
        <Title>사자 레이더</Title>
        {/* <ToggleContainer onClick={onToggle} $active={shareLocation}>
          <ToggleLabel $active={!shareLocation}>OFF</ToggleLabel>
          <ToggleLabel $active={shareLocation}>ON</ToggleLabel>
          <ToggleSwitch $active={shareLocation} />
        </ToggleContainer> */}
        <Button onClick={onToggle}>{shareLocation ? "ON" : "OFF"}</Button>
      </ToggleRow>
      <Description>모임원들과 위치와 상태를 공유할 수 있습니다.</Description>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
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

// const ToggleContainer = styled.div<{$active: boolean}`
//   position: relative;
//   width: 129px;
//   height: 26px;
//   border: none;
//   border-radius: 20px;
//   background-color: #848484;
//   cursor: pointer;
// `;

// const ToggleLabel = styled.span<{$active: boolean}`
// font-family: Pretendard;
// font-size: 20px;
// font-weight: 400;
// color: ${({$active}) =>($active ? "#000000" : "#FFFFFF"};
// `

const Button = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  background: #43d687;
  color: #fff;
  font-weight: 500;
  border: none;
  cursor: pointer;
`;
