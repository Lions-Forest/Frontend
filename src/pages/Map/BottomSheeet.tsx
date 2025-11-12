import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { useEffect } from "react";
import styled from "styled-components";
import PencilIcon from "@/assets/icons/statusMessage.svg";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  shareLocation: boolean;
  onToggleShare: () => void;
}

const footerHeight = 75;
const peekHeight = 59;
const sheetHeight = 497;

export default function BottomSheet({
  isOpen,
  onClose,
  shareLocation,
  onToggleShare,
}: BottomSheetProps) {
  const closedY = window.innerHeight - footerHeight - peekHeight;
  const openY = window.innerHeight - sheetHeight;

  const [{ y }, api] = useSpring(() => ({
    y: closedY,
  }));

  const bind = useDrag(
    ({ last, movement: [, my], memo = y.get() }) => {
      let newY = memo + my;
      if (newY < openY) newY = openY;
      if (newY > closedY) newY = closedY;

      if (last) {
        // 드래그 끝났을 때 위치 결정
        if (newY > (openY + closedY) / 2) {
          api.start({ y: closedY });
          onClose();
        } else {
          api.start({ y: openY });
        }
      } else {
        api.start({ y: newY });
      }
      return memo;
    },
    { from: () => [0, y.get()] }
  );

  // isOpen 상태가 변하면 시트 위치 조정
  useEffect(() => {
    if (isOpen) api.start({ y: openY });
    else api.start({ y: closedY });
  }, [isOpen]);

  return (
    <>
      <animated.div
        {...bind()}
        style={{
          transform: y.to((val) => `translateY(${val}px)`),
          position: "fixed",
          left: 0,
          right: 0,
          zIndex: 100,
          touchAction: "none",
          willChange: "transform",
        }}
      >
        <SheetContainer>
          <HandleBarWrapper>
            <HandleBar />
          </HandleBarWrapper>

          {/* 위치 공유 토글 */}
          <ShareLocationRow>
            <ToggleRow>
              <Title>사자 레이더</Title>
              <button onClick={onToggleShare}>
                {shareLocation ? "ON" : "OFF"}
              </button>
            </ToggleRow>
            <Description>
              모임원들과 위치와 상태를 공유할 수 있습니다.
            </Description>
          </ShareLocationRow>

          {/* 상태 입력 */}
          <StatusRow>
            <Content>
              <Title>내 상태 설정</Title>
              <Description>
                내 상태를 나타내는 아이콘을 설정해주세요.
              </Description>
            </Content>

            <SelectRow>상태 선택</SelectRow>
          </StatusRow>

          {/* 상태 메시지 */}
          <MessageRow>
            <Title>상태 메시지(선택)</Title>
            <InputWrapper>
              <Input type="text" placeholder="메시지 입력" />
              <PencilIconWrapper src={PencilIcon} />
            </InputWrapper>
          </MessageRow>
        </SheetContainer>
      </animated.div>
    </>
  );
}

const SheetContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  left: 0;
  right: 0;
  weight: 100%;
  height: 497px;
  padding: 0 17px;
  background: #ffffff;
  border-radius: 4px 4px 0 0;
  z-index: 50;
  touch-action: none;
`;

const HandleBarWrapper = styled.div`
  display: flex;
  justify-content: center;
`;
const HandleBar = styled.div`
  width: 100px;
  height: 1.5px;
  background: #000000;
  border-radius: 3px;
  margin-top: 15px;
  margin-bottom: 30px;
`;

const Title = styled.p`
  font-family: Pretandard;
  font-size: 16px;
  font-weight: 500;
  color: #000000;
`;

const Description = styled.p`
  font-family: Pretandard;
  font-size: 12px;
  font-weight: 400;
  color: #000000;
`;

const ShareLocationRow = styled.div`
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

const StatusRow = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 14px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SelectRow = styled.div`
  display: flex;
  gap: 20px;
`;

const MessageRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  height: 39px;
  font-size: 16px;
  font-weight: 600;
  background-color: #ffffff;
  border: 0.1px solid #000000;
  border-radius: 4px;
  color: #595959;
  cursor: pointer;
  padding: 10px 36px 10px 12px;

  &:focus {
    outline: none;
  }

  &::placeholder {
    font-family: Pretendard;
    color: #b8b8b8;
    font-size: 16px;
    font-weight: 500;
  }
`;

const PencilIconWrapper = styled.img`
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  pointer-events: none;
`;
