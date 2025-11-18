import styled from "styled-components";
import ShareLocationToggle from "./ShareLocationToggle";
import StatusSelector from "./StatusSelector";
import StatusMessageInput from "./StatusMessageInput";
import type { UserLocation } from "@/api/UserLocation";
import { useEffect, useMemo, useRef, useCallback, useState } from "react";

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const footerHeight = 75;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const peekHeight = 59;
const sheetHeight = 580;

// 플링 제스처 인식 기준값 (px/s)
const FLING_VELOCITY_THRESHOLD = 1000;

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
  const { closedTop, openTop } = useMemo(() => {
    const height = window.innerHeight;
    return {
      closedTop: height - footerHeight - peekHeight,
      openTop: height - sheetHeight,
    };
  }, []);

  // top 상태값: 바텀시트 상단 위치 (px, 화면 최상단 기준)
  // 초기값을 closedTop으로 설정하여 항상 바텀시트가 보이도록 함
  const [top, setTop] = useState<number>(closedTop);

  // 바텀시트 컨테이너 ref
  const bottomSheetRef = useRef<HTMLDivElement>(null);
  const handleBarRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);

  // 바텀시트 열림/닫힘 상태에 따라 top 값 업데이트
  useEffect(() => {
    if (isOpen) {
      setTop(openTop);
    } else {
      setTop(closedTop); // 닫힌 상태일 때도 closedTop 위치에 표시
      // 바텀시트가 닫힐 때 가상키보드 자동 닫기
      if (bottomSheetRef.current) {
        const inputElements = Array.from(
          bottomSheetRef.current.querySelectorAll("input, textarea")
        ) as (HTMLInputElement | HTMLTextAreaElement)[];
        inputElements.forEach((element) => {
          element.blur();
        });
      }
    }
  }, [isOpen, openTop, closedTop]);

  // 터치 이벤트 상태 관리
  const startYRef = useRef(0);
  const initialTopRef = useRef<number>(0);
  const currentYRef = useRef(0);
  const lastXRef = useRef(0);
  const lastYRef = useRef(0);
  const lastTimestampRef = useRef(0);
  const lastVelocityRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  // requestAnimationFrame을 통한 DOM 업데이트 최적화
  const draw = useCallback((newTopPosition: number) => {
    if (rafIdRef.current !== null) {
      return; // 이미 예약된 프레임이 있으면 건너뛰기
    }

    rafIdRef.current = window.requestAnimationFrame(() => {
      if (bottomSheetRef.current) {
        const translateY = -(window.innerHeight - newTopPosition);
        bottomSheetRef.current.style.setProperty(
          "transform",
          `translateY(${translateY}px)`
        );
      }
      rafIdRef.current = null;
    });
  }, []);

  // 컨텐츠 영역에서 이벤트 전파 완전 차단
  const handleContentPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  const handleContentTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  const handleContentPointerMove = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  const handleContentTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  // 드래그 시작 핸들러 (터치/마우스 공통)
  const handleDragStart = useCallback(
    (clientY: number, clientX: number) => {
      if (!top || !bottomSheetRef.current) return;

      // 실제 DOM의 현재 위치를 읽어서 initialTopRef 설정
      // 이렇게 하면 상태 업데이트가 완료되지 않았어도 실제 위치를 정확히 반영
      const rect = bottomSheetRef.current.getBoundingClientRect();
      const currentActualTop = rect.top;

      startYRef.current = clientY;
      initialTopRef.current = currentActualTop; // 실제 DOM 위치 사용
      currentYRef.current = clientY;
      lastXRef.current = clientX;
      lastYRef.current = clientY;
      lastTimestampRef.current = performance.now();
      lastVelocityRef.current = 0;
    },
    [top]
  );

  // 터치 시작 핸들러
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      const { clientX, clientY } = touch;
      handleDragStart(clientY, clientX);
    },
    [handleDragStart]
  );

  // 드래그 이동 핸들러 (터치/마우스 공통)
  const handleDragMove = useCallback(
    (clientY: number, clientX: number) => {
      if (!top || !bottomSheetRef.current) return;

      // offset 계산: 드래그 시작점과 바텀시트 초기 top 값의 차이
      const offset = initialTopRef.current - startYRef.current;

      // 현재 Y 좌표에 offset을 더해 바텀시트의 새로운 top 위치 계산
      let newTopPosition = clientY + offset;

      // 최대/최소 높이 제한만 적용 (드래그 중에는 자유롭게 이동)
      if (newTopPosition < openTop) {
        newTopPosition = openTop;
      }
      if (newTopPosition > closedTop) {
        newTopPosition = closedTop;
      }

      // 드래그 중에는 자유롭게 이동하도록 함 (끌어올리고 끌어내리는 느낌)

      // velocity 계산 (플링 제스처 판단용)
      const now = performance.now();
      const timeDelta = now - lastTimestampRef.current;

      if (timeDelta > 0) {
        const xDelta = Math.abs(clientX - lastXRef.current);
        const yDelta = clientY - lastYRef.current;

        // y축보다 x축으로 많이 이동한 경우 속도는 0
        const velocity =
          xDelta > Math.abs(yDelta) ? 0 : (yDelta / timeDelta) * 1000; // px/s

        lastVelocityRef.current = velocity;
      }

      // 다음 move 이벤트를 위해 현재 값 저장
      lastXRef.current = clientX;
      lastYRef.current = clientY;
      lastTimestampRef.current = now;
      currentYRef.current = clientY;

      // 스와이프 중에는 transition-duration을 0초로 설정
      bottomSheetRef.current.style.setProperty("transition-duration", "0s");

      // requestAnimationFrame을 통한 DOM 업데이트
      draw(newTopPosition);
    },
    [top, openTop, closedTop, draw]
  );

  // 터치 이동 핸들러
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      const { clientX, clientY } = touch;
      handleDragMove(clientY, clientX);
    },
    [handleDragMove]
  );

  // 드래그 종료 핸들러 (터치/마우스 공통)
  const handleDragEnd = useCallback(() => {
      if (!top || !bottomSheetRef.current) return;

      const { lastVelocity, currentY, initialTop } = {
        lastVelocity: lastVelocityRef.current,
        currentY: currentYRef.current,
        initialTop: initialTopRef.current,
      };

      // offset 계산
      const offset = initialTop - startYRef.current;
      const newTopPosition = currentY + offset;

      // transition-duration 다시 0.4초로 복구
      bottomSheetRef.current.style.setProperty("transition-duration", "0.4s");

      // 플링 제스처 판단 (아래로 빠르게 스와이프)
      if (lastVelocity > FLING_VELOCITY_THRESHOLD) {
        // 플링으로 바텀시트가 닫히는 경우 transition-duration을 0.15s로
        bottomSheetRef.current.style.setProperty(
          "transition-duration",
          "0.15s"
        );
        setTop(closedTop);
        onClose();
        return;
      }

      // 플링 제스처 판단 (위로 빠르게 스와이프)
      if (lastVelocity < -FLING_VELOCITY_THRESHOLD) {
        bottomSheetRef.current.style.setProperty(
          "transition-duration",
          "0.15s"
        );
        setTop(openTop);
        onOpen();
        return;
      }

      // 드래그 종료 시점의 최종 바텀시트 높이를 기준으로 판단
      // 바텀시트 높이 = window.innerHeight - newTopPosition
      const finalVisibleHeight = window.innerHeight - newTopPosition;
      const halfSheetHeight = sheetHeight / 2;

      if (finalVisibleHeight < halfSheetHeight) {
        // 바텀시트 높이가 전체 높이의 절반보다 낮으면 closedTop으로 (닫힘)
        setTop(closedTop);
        onClose();
      } else {
        // 바텀시트 높이가 전체 높이의 절반보다 높으면 openTop으로 (열림)
        setTop(openTop);
        onOpen();
      }
    },
    [top, openTop, closedTop, sheetHeight, onClose, onOpen]
  );

  // 터치 종료 핸들러
  const handleTouchEnd = useCallback(
    (_e: React.TouchEvent) => {
      handleDragEnd();
    },
    [handleDragEnd]
  );

  // 핸들바 터치 이벤트 핸들러
  const handleHandleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      // 핀치 제스처 감지 (두 손가락 이상) - 지도 줌
      if (e.touches.length > 1) {
        return;
      }

      // 핸들바 영역이 아니면 무시
      if (
        !handleBarRef.current ||
        !handleBarRef.current.contains(e.target as HTMLElement)
      ) {
        return;
      }

      e.stopPropagation();
      handleTouchStart(e);

      const handleTouchMoveGlobal = (moveEvent: TouchEvent) => {
        if (moveEvent.touches.length > 1) {
          // 핀치 제스처 감지 시 취소
          document.removeEventListener("touchmove", handleTouchMoveGlobal);
          document.removeEventListener("touchend", handleTouchEndGlobal);
          document.removeEventListener("touchcancel", handleTouchEndGlobal);
          return;
        }

        if (moveEvent.touches.length === 1) {
          moveEvent.preventDefault();
          // React 터치 이벤트로 변환하여 핸들러 호출
          const syntheticEvent = {
            ...moveEvent,
            touches: moveEvent.touches,
          } as unknown as React.TouchEvent;
          handleTouchMove(syntheticEvent);
        }
      };

      const handleTouchEndGlobal = (endEvent: TouchEvent) => {
        const syntheticEvent = {
          ...endEvent,
          touches: endEvent.touches,
        } as unknown as React.TouchEvent;
        handleTouchEnd(syntheticEvent);
        document.removeEventListener("touchmove", handleTouchMoveGlobal);
        document.removeEventListener("touchend", handleTouchEndGlobal);
        document.removeEventListener("touchcancel", handleTouchEndGlobal);
      };

      document.addEventListener("touchmove", handleTouchMoveGlobal, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEndGlobal);
      document.addEventListener("touchcancel", handleTouchEndGlobal);
    },
    [handleTouchStart, handleTouchMove, handleTouchEnd]
  );

  // 핸들바 마우스 이벤트 핸들러
  const handleHandleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // 핸들바 영역이 아니면 무시
      if (
        !handleBarRef.current ||
        !handleBarRef.current.contains(e.target as HTMLElement)
      ) {
        return;
      }

      e.stopPropagation();
      e.preventDefault();
      const { clientX, clientY } = e;
      handleDragStart(clientY, clientX);

      const handleMouseMoveGlobal = (moveEvent: MouseEvent) => {
        moveEvent.preventDefault();
        handleDragMove(moveEvent.clientY, moveEvent.clientX);
      };

      const handleMouseUpGlobal = (_upEvent: MouseEvent) => {
        handleDragEnd();
        document.removeEventListener("mousemove", handleMouseMoveGlobal);
        document.removeEventListener("mouseup", handleMouseUpGlobal);
      };

      document.addEventListener("mousemove", handleMouseMoveGlobal);
      document.addEventListener("mouseup", handleMouseUpGlobal);
    },
    [handleDragStart, handleDragMove, handleDragEnd]
  );

  // top 값이 변경될 때 transform 업데이트 (애니메이션용)
  useEffect(() => {
    if (bottomSheetRef.current && top) {
      const translateY = -(window.innerHeight - top);
      bottomSheetRef.current.style.setProperty(
        "transform",
        `translateY(${translateY}px)`
      );
    }
  }, [top]);

  return (
    <>
      <BottomSheetContainer
        ref={bottomSheetRef}
        style={{
          // position: "fixed",
          // top: "100%",
          // left: 0,
          // right: 0,
          zIndex: 100,
          willChange: "transform",
          transition: "transform 0.4s ease-in-out",
        }}
      >
        <SheetContainer
          data-sheet-container
          onTouchStart={(e) => {
            // 핀치 제스처 감지 (지도 줌)
            if (e.touches.length > 1) {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              e.preventDefault();
              return;
            }
            // HandleBarWrapper 내부가 아니면 모든 이벤트 완전 차단
            const target = e.target as HTMLElement;
            if (
              !handleBarRef.current ||
              !handleBarRef.current.contains(target)
            ) {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              e.preventDefault();
            }
          }}
          onTouchMove={(e) => {
            // 핀치 제스처 감지 (지도 줌)
            if (e.touches.length > 1) {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              e.preventDefault();
              return;
            }
            // HandleBarWrapper 내부가 아니면 모든 이벤트 완전 차단
            const target = e.target as HTMLElement;
            if (
              !handleBarRef.current ||
              !handleBarRef.current.contains(target)
            ) {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              e.preventDefault();
            }
          }}
        >
          <HandleBarWrapper
            ref={handleBarRef}
            data-handle-bar
            onTouchStart={handleHandleTouchStart}
            onMouseDown={handleHandleMouseDown}
          >
            <HandleBar />
          </HandleBarWrapper>

          <ContentWrapper
            ref={contentWrapperRef}
            data-content-wrapper
            onPointerDown={handleContentPointerDown}
            onTouchStart={handleContentTouchStart}
            onPointerMove={handleContentPointerMove}
            onTouchMove={handleContentTouchMove}
            onClick={handleContentClick}
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
      </BottomSheetContainer>
    </>
  );
}

const BottomSheetContainer = styled.div`
  position: absolute; 
  // position: fixed;
  top: 100%;
  // left: 0;
  width: 100%;
  background-color: white;
  max-width: 600px;
  display: flex;
  justify-content: center;
`;

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
  justify-content: center;
//  max-height: ${sheetHeight}px;
  min-height: 75px;
  box-sizing: border-box;
`;

const HandleBarWrapper = styled.div`
  display: flex;
  justify-content: center;
  touch-action: none;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
  
  &:active {
    cursor: grabbing;
  }
`;

const HandleBar = styled.div`
  width: 100px;
  height: 2px;
  background: #000000;
  border-radius: 3px;
  margin-top: 20px;
  margin-bottom: 38px;
`;

const ContentWrapper = styled.div`
  /* 내부 컨텐츠 영역: 드래그 이벤트가 전파되지 않도록 설정 */
  pointer-events: auto;
  touch-action: manipulation; /* 더블탭 줌 방지, 스크롤은 허용 */
  /* 드래그 이벤트 전파를 막기 위해 이벤트 핸들러에서 stopPropagation 사용 */
  position: relative;
  z-index: 1;
  /* 드래그 이벤트가 전파되지 않도록 */
  user-select: none;
  -webkit-user-select: none;
`;

export default BottomSheet;
