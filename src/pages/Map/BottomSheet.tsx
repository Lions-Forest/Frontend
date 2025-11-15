import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import styled from "styled-components";
import ShareLocationToggle from "./ShareLocationToggle";
import StatusSelector from "./StatusSelector";
import StatusMessageInput from "./StatusMessageInput";
import type { UserLocation } from "@/api/UserLocation";
import { useEffect, useMemo, useRef, memo } from "react";

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

  // 현재 y 위치를 추적하는 ref (리렌더링 시에도 유지)
  const currentYRef = useRef<number | null>(null);
  const isInitializedRef = useRef(false);
  
  // 초기값: 첫 렌더링이면 isOpen에 따라, 아니면 현재 위치 유지
  const springInitialY = useMemo(() => {
    if (!isInitializedRef.current) {
      const initialY = isOpen ? openY : closedY;
      currentYRef.current = initialY;
      isInitializedRef.current = true;
      console.log(`[BottomSheet] useSpring 초기값 설정 (첫 렌더링):`, {
        isOpen,
        springInitialY: initialY,
        openY,
        closedY,
      });
      return initialY;
    }
    // 재생성 시에도 현재 위치 유지
    const preservedY = currentYRef.current ?? (isOpen ? openY : closedY);
    console.log(`[BottomSheet] useSpring 재생성 - 현재 위치 유지:`, {
      isOpen,
      preservedY,
      currentYRef: currentYRef.current,
    });
    return preservedY;
  }, []); // 빈 의존성 배열 - 한 번만 계산

  const [{ y }, api] = useSpring(() => ({
    y: springInitialY,
    config: { tension: 250, friction: 30 },
  }));

  // y 값이 변경될 때마다 ref 업데이트
  useEffect(() => {
    const updateRef = () => {
      const currentY = y.get();
      if (currentYRef.current !== currentY) {
        currentYRef.current = currentY;
      }
    };
    
    // 즉시 한 번 업데이트
    updateRef();
    
    // 애니메이션 중에도 주기적으로 업데이트
    const interval = setInterval(updateRef, 16); // ~60fps
    return () => clearInterval(interval);
  }, [y]);

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
      currentYRef: currentYRef.current,
      difference: Math.abs(currentY - targetY),
      willMove: currentY !== targetY,
      timestamp: new Date().toISOString(),
    });

    if (isOpen) {
      console.log(`[BottomSheet] api.start 호출 - 열기:`, { y: openY });
      currentYRef.current = openY;
      api.start({ y: openY });
    } else {
      console.log(`[BottomSheet] api.start 호출 - 닫기:`, { y: closedY });
      currentYRef.current = closedY;
      api.start({ y: closedY });
    }
  }, [isOpen]); // isOpen만 의존성으로 사용

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

// React.memo로 메모이제이션하여 불필요한 리렌더링 방지
// shareLocation, status, message 변경 시에도 isOpen이 같으면 리렌더링 방지
export default memo(BottomSheet, (prevProps, nextProps) => {
  // isOpen이 변경되지 않으면 리렌더링 방지
  return prevProps.isOpen === nextProps.isOpen;
});
