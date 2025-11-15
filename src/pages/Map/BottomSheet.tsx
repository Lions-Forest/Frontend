import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import styled from "styled-components";
import ShareLocationToggle from "./ShareLocationToggle";
import StatusSelector from "./StatusSelector";
import StatusMessageInput from "./StatusMessageInput";
import type { UserLocation } from "@/api/UserLocation";
import { useEffect, useMemo, useRef } from "react";

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
  // 렌더링 추적
  const renderCount = useRef(0);
  renderCount.current += 1;
  console.log(`[BottomSheet] 렌더링 #${renderCount.current}`, {
    isOpen,
    shareLocation,
    status,
    messageLength: message.length,
  });

  const { closedY, openY } = useMemo(() => {
    const height = window.innerHeight;
    const values = {
      closedY: height - footerHeight - peekHeight,
      openY: height - sheetHeight,
    };
    console.log(`[BottomSheet] useMemo 실행 - closedY, openY 계산:`, {
      height,
      closedY: values.closedY,
      openY: values.openY,
      windowInnerHeight: window.innerHeight,
    });
    return values;
  }, []); // 초기 렌더링 시에만 계산

  const springInitialY = isOpen ? openY : closedY;
  console.log(`[BottomSheet] useSpring 초기값 설정:`, {
    isOpen,
    springInitialY,
    openY,
    closedY,
  });

  const [{ y }, api] = useSpring(() => ({
    y: springInitialY,
    config: { tension: 250, friction: 30 },
  }));

  // 현재 y 값 주기적 추적 (디버깅용)
  useEffect(() => {
    const interval = setInterval(() => {
      const currentY = y.get();
      const targetY = isOpen ? openY : closedY;
      const difference = Math.abs(currentY - targetY);
      
      // 차이가 크면 로그 출력 (의도하지 않은 이동 감지)
      if (difference > 5) {
        console.log(`[BottomSheet] ⚠️ y 값이 목표와 다름:`, {
          currentY,
          targetY,
          difference,
          isOpen,
          timestamp: new Date().toISOString(),
        });
      }
    }, 100); // 100ms마다 체크

    return () => clearInterval(interval);
  }, [y, isOpen, openY, closedY]);

  const bindHandle = useDrag(
    ({ last, movement: [, my], memo = y.get() }) => {
      let newY = memo + my;
      if (newY < openY) newY = openY;
      if (newY > closedY) newY = closedY;

      if (last) {
        // 드래그 끝났을 때 위치 결정
        console.log(`[BottomSheet] 드래그 종료:`, {
          newY,
          threshold: (openY + closedY) / 2,
          willClose: newY > (openY + closedY) / 2,
        });
        
        if (newY > (openY + closedY) / 2) {
          // 닫기
          console.log(`[BottomSheet] 드래그로 닫기 실행`);
          api.start({ y: closedY });
          onClose();
        } else {
          // 열기
          console.log(`[BottomSheet] 드래그로 열기 실행`);
          api.start({ y: openY });
          onOpen();
        }
      } else {
        // 드래그 중
        api.start({ y: newY, immediate: true });
      }
      return memo;
    },
    { from: () => [0, y.get()], filterTaps: true }
  );

  useEffect(() => {
    const targetY = isOpen ? openY : closedY;
    const currentY = y.get();
    
    console.log(`[BottomSheet] useEffect 실행 (isOpen 변경 감지):`, {
      isOpen,
      targetY,
      currentY,
      difference: Math.abs(currentY - targetY),
      willMove: currentY !== targetY,
      timestamp: new Date().toISOString(),
    });

    if (isOpen) {
      console.log(`[BottomSheet] api.start 호출 - 열기:`, { y: openY });
      api.start({ y: openY });
    } else {
      console.log(`[BottomSheet] api.start 호출 - 닫기:`, { y: closedY });
      api.start({ y: closedY });
    }
  }, [isOpen, api, openY, closedY, y]); // 의존성 추가하여 추적

  return (
    <>
      <animated.div
        style={{
          transform: y.to((val) => `translateY(${val}px)`),
          position: "fixed",
          left: 0,
          right: 0,
          zIndex: 100,
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
