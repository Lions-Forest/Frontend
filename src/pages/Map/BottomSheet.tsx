import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import styled from "styled-components";
import ShareLocationToggle from "./ShareLocationToggle";
import StatusSelector from "./StatusSelector";
import StatusMessageInput from "./StatusMessageInput";
import type { UserLocation } from "@/api/UserLocation";
import { useEffect } from "react";

interface BottomSheetProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  shareLocation: boolean;
  onToggleShare: (newValue: boolean) => void;
  status: NonNullable<UserLocation["status"]>;
  setStatus: React.Dispatch<
    React.SetStateAction<NonNullable<UserLocation["status"]>>
  >;
  message: string;
  setMessage: (msg: string) => void;
  children?: React.ReactNode;
}

const footerHeight = 75;
const peekHeight = 59;
const sheetHeight = 580;

export default function BottomSheet({
  isOpen,
  onOpen,
  onClose,
  shareLocation,
  onToggleShare,
  status,
  setStatus,
  message,
  setMessage,
}: BottomSheetProps) {
  const closedY = window.innerHeight - footerHeight - peekHeight;
  const openY = window.innerHeight - sheetHeight;

  const [{ y }, api] = useSpring(() => ({
    y: isOpen ? openY : closedY,
    config: { tension: 250, friction: 30 },
  }));

  const bindHandle = useDrag(
    ({ last, movement: [, my], memo = y.get() }) => {
      let newY = memo + my;
      if (newY < openY) newY = openY;
      if (newY > closedY) newY = closedY;

      if (last) {
        // 드래그 끝났을 때 위치 결정
        if (newY > (openY + closedY) / 2) {
          // 닫기
          api.start({ y: closedY });
          onClose();
        } else {
          // 열기
          api.start({ y: openY });
          onOpen();
        }
      } else {
        api.start({ y: newY, immediate: true });
      }
      return memo;
    },
    { from: () => [0, y.get()], filterTaps: true }
  );

  // useEffect(() => {
  //   if (isOpen) {
  //     api.start({ y: openY });
  //   } else {
  //     api.start({ y: closedY });
  //   }
  // }, [isOpen, api, openY, closedY]);

  return (
    <>
      <animated.div
        style={{
          transform: y.to((val) => `translateY(${val}px)`),
          position: "fixed",
          left: 0,
          right: 0,
          zIndex: 100,
          //   touchAction: "none",
          willChange: "transform",
        }}
      >
        <SheetContainer>
          <HandleBarWrapper {...bindHandle()}>
            <HandleBar />
          </HandleBarWrapper>

          <ShareLocationToggle
            shareLocation={shareLocation}
            onToggle={onToggleShare}
          />

          <StatusSelector
            selectedStatus={status}
            onChange={setStatus}
            shareLocation={shareLocation}
          />

          <StatusMessageInput
            message={message}
            onChange={setMessage}
            shareLocation={shareLocation}
          />
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
  width: 100%;
  padding: 0 17px;
  background: #ffffff;
  border-radius: 4px 4px 0 0;
  z-index: 50;
  //   touch-action: none;
`;

const HandleBarWrapper = styled.div`
  display: flex;
  justify-content: center;
  touch-action: none;
  cursor: grab;
`;

const HandleBar = styled.div`
  width: 100px;
  height: 1.5px;
  background: #000000;
  border-radius: 3px;
  margin-top: 20px;
  margin-bottom: 38px;
`;
