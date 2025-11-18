import styled from "styled-components";
import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";
import { useAllLocations } from "@/hooks/useAllLocations";
import { useMyLocation } from "@/hooks/useMyLocation";
import React, { useEffect, useState } from "react";
import LoadingPage from "@/pages/Map/LoadingPage";
import type { UserLocation } from "@/api/UserLocation";
import { getMarkerImage } from "@/constants/markerImages";
import defaultLion from "@/assets/lion/defaultLion.svg";
import nothingMarker from "@/assets/marker/nothingMarker.svg";
import moveToMyLocationBtn from "@/assets/icons/moveToMyLocation.png";
import Footer from "@/components/layout/Footer";
import BottomSheet from "./BottomSheet";
import StatusSelector from "./StatusSelector";
import MapNotification from "./MapNotification";
import StatusMessage from "./StatusMessage";
import { useLocationActions } from "@/hooks/useLocationActions";
import { useRecoilState } from "recoil";
import {
  shareLocationState,
  selectedStatusState,
  statusMessageState,
} from "@/store/mapState";
import UserTag from "./UserTag";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

export default function BaseMap({
  userId,
  name,
}: {
  userId: string;
  name: string;
}) {
  const [shareLocation, setShareLocation] = useRecoilState(shareLocationState);
  const [selectedStatus, setSelectedStatus] =
    useRecoilState(selectedStatusState);
  const [statusMessage, setStatusMessage] = useRecoilState(statusMessageState);

  const [mapLevel, setMapLevel] = useState(3);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [followMe, setFollowMe] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { likeUser } = useLocationActions();

  // GPS 기반 실시간 내 위치
  const { myPosition, geoError } = useMyLocation({
    userId,
    name,
    shareLocation,
    status: selectedStatus,
    message: statusMessage,
  });

  // Firestore에서 모든 사용자 구독
  const locations = useAllLocations(userId);
  const [center, setCenter] = useState({ lat: 37.504729, lng: 126.957631 });

  const handleToggle = (newValue: boolean) => {
    setShareLocation(newValue);
    if (!newValue) {
      setSelectedStatus("nothing");
      setStatusMessage("");
    } else {
      setSelectedStatus("nothing");
    }
  };

  useEffect(() => {
    if (!selectedUserId) return;

    const target =
      selectedUserId === userId
        ? { message: statusMessage, userId }
        : locations[selectedUserId];

    if (!target || !target.message || target.message.trim() === "") {
      setSelectedUserId(null); // 상태메세지 지우면 자동 닫힘

      (async () => {
        try {
          await setDoc(
            doc(db, "locations", target.userId),
            { likedBy: [] },
            { merge: true }
          );
        } catch (err) {
          console.error("좋아요 초기화 실패: ", err);
        }
      })();
    }
  }, [statusMessage, locations, selectedUserId]);

  // GPS 기반으로 내 화면 중심 계속 이동
  useEffect(() => {
    if (followMe && myPosition) {
      setCenter(myPosition);
    }
  }, [myPosition, followMe]);

  if (geoError) {
    return (
      <GeolocationErrorBanner>
        <span>위치를 불러올 수 없습니다.</span>
        <span>GPS 신호가 약하거나 권한을 확인해주세요.</span>
      </GeolocationErrorBanner>
    );
  }

  if (!myPosition) return <LoadingPage />;
  let selectedUser:
    | (UserLocation & { latitude: number; longitude: number })
    | null = null;

  if (selectedUserId) {
    if (selectedUserId === userId) {
      selectedUser = {
        userId: userId,
        name: name,
        latitude: myPosition.lat,
        longitude: myPosition.lng,
        status: selectedStatus,
        message: statusMessage,
        shareLocation: shareLocation,
        likedBy: locations[userId]?.likedBy || [],
      };
    } else {
      const target = locations[selectedUserId];
      if (target) {
        selectedUser = {
          ...target,
          latitude: target.latitude,
          longitude: target.longitude,
          likedBy: target.likedBy || [],
        };
      }
    }
  }

  const baseLevel = 3;
  const baseCircleSize = 427;
  // const step = 0.1;
  // const scale = Math.max(1 - (mapLevel - 3) * step, 0.2);
  const scale = 1 / Math.pow(2, mapLevel - baseLevel);
  const circleSize = baseCircleSize * scale;

  return (
    <MapContainer>
      <MapWrapper>
        <MapNotification
          myPosition={myPosition}
          userId={userId}
          locations={locations}
          shareLocation={shareLocation}
          selectedStatus={selectedStatus}
          radiusMeters={1500}
        />

        <Map
          center={center}
          level={mapLevel}
          onZoomChanged={(map) => setMapLevel(map.getLevel())}
          style={{ width: "100%", height: "100%" }}
          onDragStart={() => setFollowMe(false)}
          onCenterChanged={(map) => {
            if (!followMe) {
              const c = map.getCenter();
              setCenter({ lat: c.getLat(), lng: c.getLng() });
            }
          }}
        >
          {/* 내 마커 (GPS 기반, 항상 표시됨) */}
          <MapMarker
            position={myPosition}
            image={{
              src: shareLocation
                ? getMarkerImage(selectedStatus, true) || defaultLion
                : defaultLion,
              size: { width: 79, height: 145 },
              options: { offset: { x: 39, y: 145 } },
            }}
            title={`${name} (나)`}
            onClick={() => {
              if (!statusMessage || statusMessage.trim() === "") return;
              setSelectedUserId((prevId) =>
                prevId === userId ? null : userId
              );
            }}
          />
          {/* shareLocation 켜졌을 때만 그라데이션 원 표시 */}
          {shareLocation && (
            <CustomOverlayMap
              position={myPosition}
              xAnchor={0.5}
              yAnchor={0.5}
              zIndex={-1}
            >
              <Circle
                style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
              />
            </CustomOverlayMap>
          )}
          {/* 다른 사용자 마커 표시 (Firestore 기반) */}
          {Object.values(locations).map((user) => {
            if (user.userId === userId) return null; // 내 Firestore 기록은 내가 안 봄
            if (!shareLocation || !user.shareLocation) return null;

            const markerImg =
              getMarkerImage(user.status, false) || nothingMarker;

            const handleMarkerClick = () => {
              if (!user.message || user.message.trim() === "") return;

              setSelectedUserId((prevId) =>
                prevId === user.userId ? null : user.userId
              );
            };

            return (
              <React.Fragment key={user.userId}>
                <MapMarker
                  position={{ lat: user.latitude, lng: user.longitude }}
                  image={{
                    src: markerImg,
                    size: { width: 65, height: 87 },
                    options: { offset: { x: 32, y: 87 } }, // (마커 이미지의 핀포인트)
                  }}
                  onClick={handleMarkerClick}
                />

                <CustomOverlayMap
                  position={{ lat: user.latitude, lng: user.longitude }}
                  yAnchor={1}
                  xAnchor={0.5}
                >
                  <UserTag
                    name={user.name}
                    status={user.status}
                    onClick={handleMarkerClick}
                  />
                </CustomOverlayMap>
              </React.Fragment>
            );
          })}

          {/* 상태메세지 말풍선 */}
          {selectedUser && (
            <StatusMessage
              user={{
                ...selectedUser,
                message: selectedUser.message || "",
              }}
              likedBy={selectedUser.likedBy || []}
              currentUserId={userId}
              onLike={() => likeUser(selectedUser.userId, userId)}
              isMe={selectedUser.userId === userId}
            />
          )}
        </Map>

        <img
          src={moveToMyLocationBtn}
          onClick={() => {
            if (myPosition) {
              setFollowMe(true);
              setCenter(myPosition);
              setMapLevel(3);
            }
          }}
          style={{
            position: "absolute",
            bottom: 145,
            right: 15,
            width: 46,
            height: 46,
            cursor: "pointer",
            zIndex: 10,
          }}
        />
      </MapWrapper>

      <BottomSheet
        isOpen={isBottomSheetOpen}
        onOpen={() => setIsBottomSheetOpen(true)}
        onClose={() => setIsBottomSheetOpen(false)}
        shareLocation={shareLocation}
        onToggleShare={handleToggle}
        status={selectedStatus}
        setStatus={setSelectedStatus}
        message={statusMessage}
        setMessage={setStatusMessage}
      >
        <StatusSelector
          selectedStatus={selectedStatus}
          onChange={setSelectedStatus}
          shareLocation={shareLocation}
        />
      </BottomSheet>

      <FooterWrap>
        <Footer />
      </FooterWrap>
    </MapContainer>
  );
}

const MapContainer = styled.div`
  max-width: 600px;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MapWrapper = styled.div`
  flex: 1;
  position: relative;
`;

const FooterWrap = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 200;
  display: flex;
  justify-content: center;
`;

const Circle = styled.div`
  width: 427px; // baseCircleSize
  height: 427px;
  border-radius: 50%;
  pointer-events: none;

  background: radial-gradient(
    50% 50% at 50% 50%,
    rgba(255, 255, 255, 0.3) 28.85%,
    rgba(67, 214, 135, 0.3) 100%
  );

  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%); // 중심 고정
  transform-origin: center;

  transition: transform 0.25s ease-out; // 부드럽게
`;

const GeolocationErrorBanner = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  min-width: 280px;
  max-width: 500px;
  padding: 12px 10px;
  border-radius: 12px;
  background: rgba(255, 77, 79, 0.9);
  color: #ffffff;
  font-family: Pretendard;
  font-size: 15px;
  font-weight: 600;
  text-align: center;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.25);
  z-index: 10;
  white-space: pre-line;
`;
