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

function BottomSheet({
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
  const { closedY, openY } = useMemo(() => {
    const height = window.innerHeight;
    return {
      closedY: height - footerHeight - peekHeight,
      openY: height - sheetHeight,
    };
  }, []);

  const [{ y }, api] = useSpring(() => ({
    y: isOpen ? openY : closedY,
    config: { tension: 250, friction: 30 },
  }));

  // 컨텐츠 영역 터치 여부 추적
  const isContentAreaTouched = useRef(false);
  const contentWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.start({ y: isOpen ? openY : closedY });
  }, [isOpen, api, openY, closedY]);

  // 컨텐츠 영역 터치 감지
  const handleContentTouchStart = () => {
    isContentAreaTouched.current = true;
    // 이벤트 전파는 막지 않음 (내부 컴포넌트 클릭은 정상 동작)
  };

  const handleContentTouchEnd = () => {
    // 약간의 지연 후 리셋 (드래그와 구분)
    setTimeout(() => {
      isContentAreaTouched.current = false;
    }, 100);
  };

  const bindHandle = useDrag(
    ({ last, movement: [, my], memo = y.get(), first }) => {
      // 컨텐츠 영역을 터치한 경우 드래그 무시
      if (isContentAreaTouched.current) {
        return memo;
      }

      // 첫 터치 시 컨텐츠 영역인지 확인
      if (first && event?.target) {
        const target = event.target as HTMLElement;
        if (contentWrapperRef.current?.contains(target)) {
          isContentAreaTouched.current = true;
          return memo;
        }
      }

      let newY = memo + my;
      if (newY < openY) newY = openY;
      if (newY > closedY) newY = closedY;

      if (last) {
        if (newY > (openY + closedY) / 2) {
          api.start({ y: closedY });
          onClose();
        } else {
          api.start({ y: openY });
          onOpen();
        }
        isContentAreaTouched.current = false;
      } else {
        api.start({ y: newY, immediate: true });
      }
      return memo;
    },
    { 
      from: () => [0, y.get()], 
      filterTaps: true,
      // 컨텐츠 영역에서는 드래그 필터링
      filter: ({ target }: { target: EventTarget | null }) => {
        if (target && contentWrapperRef.current?.contains(target as Node)) {
          return false; // 드래그 차단
        }
        return true; // 핸들바 영역은 드래그 허용
      }
    }
  );

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

          <ContentWrapper
            ref={contentWrapperRef}
            onPointerDown={handleContentTouchStart}
            onTouchStart={handleContentTouchStart}
            onPointerUp={handleContentTouchEnd}
            onTouchEnd={handleContentTouchEnd}
          >
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
          </ContentWrapper>
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

const ContentWrapper = styled.div`
  /* 내부 컨텐츠 영역: 드래그 이벤트가 전파되지 않도록 설정 */
  pointer-events: auto;
  touch-action: auto;
`;

export default BottomSheet;
