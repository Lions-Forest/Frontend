import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";
import { useAllLocations } from "@/hooks/useAllLocations";
import { useMyLocation } from "@/hooks/useMyLocation";
import React, { useEffect, useState } from "react";
import LoadingPage from "@/pages/Map/LoadingPage";
import type { UserLocation } from "@/api/UserLocation";
import { getMarkerImage } from "@/constants/markerImages";
import defaultLion from "@/assets/lion/defaultLion.svg";
import moveToMyLocationBtn from "@/assets/icons/moveToMyLocation.svg";
import styled from "styled-components";
import Footer from "@/components/layout/Footer";
import BottomSheet from "./BottomSheeet";
import StatusSelector from "./StatusSelector";

interface BaseMapProps {
  userId: string;
  name: string;
}

const defaultCenter = { lat: 37.504729, lng: 126.957631 };

export default function BaseMap({ userId, name }: BaseMapProps) {
  const [shareLocation, setShareLocation] = useState(false);
  const [selectedStatus, setSelectedStatus] =
    useState<NonNullable<UserLocation["status"]>>("nothing");
  const [statusMessage, setStatusMessage] = useState("");
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  useMyLocation({ userId, name, shareLocation, status: selectedStatus }); // 내 위치 Firebase에 업로드
  const locations = useAllLocations(userId); // 모든 사용자 위치 구독
  const myLocation = locations[userId]; // 모든 사용자 위치 중 내 위치 찾아내기 (중심 좌표를 찾기 위해)

  console.log("📍 locations:", locations);
  console.log("📍 myLocation:", myLocation);

  const [center, setCenter] = useState<{ lat: number; lng: number }>(
    myLocation
      ? { lat: myLocation.latitude, lng: myLocation.longitude }
      : defaultCenter
  );

  useEffect(() => {
    if (myLocation?.latitude && myLocation?.longitude) {
      setCenter({ lat: myLocation.latitude, lng: myLocation.longitude });
    }
  }, [myLocation]);

  const handleStatusChange = (
    newStatus: NonNullable<UserLocation["status"]>
  ) => {
    setSelectedStatus(newStatus);
  };

  const handleShareToggle = (newValue: boolean) => {
    setShareLocation(newValue);
  };

  const moveToMyLocation = () => {
    if (myLocation?.latitude && myLocation?.longitude) {
      setCenter({ lat: myLocation.latitude, lng: myLocation.longitude });
    }
  };

  console.log("🕵️‍♀️ [DEBUG 1] locations:", locations);
  console.log("🕵️‍♀️ [DEBUG 2] myLocation:", myLocation);

  // ✅ 디버깅 로그
  useEffect(() => {
    console.log("📍 BaseMap 렌더링 상태 =====================");
    console.log("shareLocation:", shareLocation);
    console.log("selectedStatus:", selectedStatus);
    console.log("locations:", locations);
    console.log("myLocation:", myLocation);
    console.log("center:", center);
    console.log("============================================");
  }, [locations, myLocation, shareLocation, selectedStatus]);

  // 아직 위치 데이터가 들어오지 않았다면 로딩 화면 표시
  if (!myLocation) return <LoadingPage />;

  return (
    <MapContainer>
      <MapWrapper>
        <Map
          center={center}
          style={{ width: "100%", height: "100%" }}
          level={3}
          onCenterChanged={(map) => {
            const newCenter = map.getCenter();
            setCenter({ lat: newCenter.getLat(), lng: newCenter.getLng() });
          }}
        >
          {locations &&
            Object.values(locations).map((user) => {
              if (!user.latitude || !user.longitude) return null;

              const isMe = user.userId === userId;
              if (!isMe && !shareLocation) return null;
              if (!isMe && !user.shareLocation) return null;

              let markerSrc: string | undefined;

              if (isMe) {
                markerSrc = shareLocation
                  ? getMarkerImage(user.status, true) || defaultLion
                  : defaultLion;
              } else {
                markerSrc = getMarkerImage(user.status, false) || defaultLion;
              }

              const markerImage = {
                src: markerSrc,
                size: isMe
                  ? { width: 79, height: 145 }
                  : { width: 93, height: 102 },
                options: { offset: { x: 25, y: 50 } },
              };

              if (isMe) {
                return (
                  <React.Fragment key={`current-${user.userId}`}>
                    <MapMarker
                      key={user.userId}
                      position={{ lat: user.latitude, lng: user.longitude }}
                      image={markerImage}
                      title={`${user.name} (나)`}
                    />

                    {shareLocation && (
                      <CustomOverlayMap
                        position={{ lat: user.latitude, lng: user.longitude }}
                        zIndex={-1} // 마커보다 뒤에 뜨게
                      >
                        <div
                          style={{
                            width: "427px",
                            height: "427px",
                            borderRadius: "50%",
                            background:
                              "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.30) 28.85%, rgba(67, 214, 135, 0.30) 100%)",
                            transform: "translate(-18%, -18%)",
                            pointerEvents: "none",
                          }}
                        />
                      </CustomOverlayMap>
                    )}
                  </React.Fragment>
                );
              }

              return (
                <MapMarker
                  key={`marker=${user.userId}`}
                  position={{ lat: user.latitude, lng: user.longitude }}
                  image={markerImage}
                  title={user.name}
                />
              );
            })}
        </Map>

        <img
          src={moveToMyLocationBtn}
          alt="내 위치로 이동"
          style={{
            position: "absolute",
            bottom: 145,
            right: 15,
            width: 46,
            height: 46,
            cursor: "pointer",
            zIndex: 10,
          }}
          onClick={moveToMyLocation}
        />
      </MapWrapper>

      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        shareLocation={shareLocation}
        onToggleShare={handleShareToggle}
        status={selectedStatus}
        setStatus={setSelectedStatus}
        message={statusMessage}
        setMessage={setStatusMessage}
      >
        <StatusSelector
          selectedStatus={selectedStatus}
          onChange={handleStatusChange}
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
`;
