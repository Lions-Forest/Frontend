// BaseMap.tsx
import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";
import { useAllLocations } from "@/hooks/useAllLocations";
import { useMyLocation } from "@/hooks/useMyLocation";
import { useEffect, useState } from "react";
import LoadingPage from "@/pages/Map/LoadingPage";
import type { UserLocation } from "@/api/UserLocation";
import { getMarkerImage } from "@/constants/markerImages";
import defaultLion from "@/assets/lion/defaultLion.svg";
import moveToMyLocationBtn from "@/assets/icons/moveToMyLocation.svg";
import styled from "styled-components";
import Footer from "@/components/layout/Footer";
import BottomSheet from "./BottomSheeet";
import StatusSelector from "./StatusSelector";

export default function BaseMap({
  userId,
  name,
}: {
  userId: string;
  name: string;
}) {
  const [shareLocation, setShareLocation] = useState(false);
  const [selectedStatus, setSelectedStatus] =
    useState<NonNullable<UserLocation["status"]>>("nothing");
  const [statusMessage, setStatusMessage] = useState("");
  const [mapLevel, setMapLevel] = useState(3);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [followMe, setFollowMe] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserLocation | null>(null);

  // GPS 기반 실시간 내 위치
  const myPosition = useMyLocation({
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
    }
  };

  // 🔥 GPS 기반으로 내 화면 중심 계속 이동
  useEffect(() => {
    if (followMe && myPosition) {
      setCenter(myPosition);
    }
  }, [myPosition, followMe]);

  if (!myPosition) return <LoadingPage />;

  return (
    <MapContainer>
      <MapWrapper>
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
          {/** ---------------------------
              🔹 내 마커 (GPS 기반, 항상 표시됨)
            ---------------------------- */}
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
          />

          {/** 🔥 shareLocation 켜졌을 때만 오라라 효과 */}
          {shareLocation && (
            <CustomOverlayMap
              position={myPosition}
              zIndex={-1}
              xAnchor={0.5}
              yAnchor={1}
            >
              <div
                style={{
                  width: 427,
                  height: 427,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(50% 50% at 50% 50%, rgba(255,255,255,0.3) 28.85%, rgba(67,214,135,0.3) 100%)",
                  transform: "translateY(30%)",
                  pointerEvents: "none",
                }}
              />
            </CustomOverlayMap>
          )}

          {/** ---------------------------
              🔹 다른 사용자 마커 표시 (Firestore 기반)
            ---------------------------- */}
          {Object.values(locations).map((user) => {
            if (user.userId === userId) return null; // 내 Firestore 기록은 내가 안 봄
            if (!user.shareLocation) return null;

            const markerImg = getMarkerImage(user.status, false);
            if (!markerImg) return null;

            return (
              <MapMarker
                key={user.userId}
                position={{ lat: user.latitude, lng: user.longitude }}
                image={{
                  src: markerImg,
                  size: { width: 93, height: 102 },
                  options: { offset: { x: 25, y: 50 } },
                }}
                onClick={() => {
                  setSelectedUser((prev) => {
                    if (prev?.userId === user.userId) return null;
                    return user;
                  });
                }}
              />
            );
          })}

          {/** 🔹 말풍선 */}
          {selectedUser && (
            <CustomOverlayMap
              position={{
                lat: selectedUser.latitude,
                lng: selectedUser.longitude,
              }}
              yAnchor={1.2}
            >
              <div
                style={{
                  background: "white",
                  padding: "8px 12px",
                  borderRadius: 12,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                  maxWidth: 200,
                  whiteSpace: "pre-wrap",
                  textAlign: "center",
                }}
              >
                {selectedUser.message}
              </div>
            </CustomOverlayMap>
          )}
        </Map>

        <img
          src={moveToMyLocationBtn}
          onClick={() => {
            if (myPosition) {
              setCenter(myPosition);
              setFollowMe(true);
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

// 스타일
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
`;
