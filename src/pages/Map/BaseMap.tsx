import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";
import { useAllLocations } from "@/hooks/useAllLocations";
import { useMyLocation } from "@/hooks/useMyLocation";
import React, { useEffect, useState } from "react";
import LoadingPage from "@/pages/Map/LoadingPage";
import MarkerImage from "@/assets/images/LoadingLion.svg"; // 임시로 다른 사진 지정
import type { UserLocation } from "@/api/UserLocation";
import { getMarkerImage } from "@/constants/markerImages";
import Layout from "@/components/layout/Layout";
import styled from "styled-components";

interface BaseMapProps {
  userId: string;
  name: string;
  shareLocation: boolean;
  userLocations: UserLocation[];
}

const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 }; // 서울 시청 좌표 (임시 기본값)

export default function BaseMap({
  userId,
  name,
  shareLocation,
  userLocations,
}: BaseMapProps) {
  useMyLocation({ userId, name, shareLocation }); // 내 위치 Firebase에 업로드
  const locations = useAllLocations(); // 모든 사용자 위치 구독
  const myLocation = locations?.[userId]; // 모든 사용자 위치 중 내 위치 찾아내기 (중심 좌표를 찾기 위해)
  console.log("locations state:", locations);
  console.log("myLocation:", myLocation);
  const safeUserLocations = Array.isArray(userLocations) ? userLocations : [];
  const initialCenter = React.useMemo(() => {
    if (myLocation?.latitude && myLocation?.longitude) {
      return { lat: myLocation.latitude, lng: myLocation.longitude };
    }
    const fallbackUser = safeUserLocations.find(
      (user) => user.latitude && user.longitude
    );
    if (fallbackUser) {
      return { lat: fallbackUser.latitude, lng: fallbackUser.longitude };
    }
    return DEFAULT_CENTER;
  }, [myLocation, safeUserLocations]);
  const [center, setCenter] = useState<{ lat: number; lng: number }>(
    initialCenter
  );

  useEffect(() => {
    if (myLocation) {
      setCenter({ lat: myLocation.latitude, lng: myLocation.longitude });
    }
  }, [myLocation]);

  useEffect(() => {
    if (!myLocation && center === DEFAULT_CENTER) {
      setCenter(initialCenter);
    }
  }, [center, initialCenter, myLocation]);

  // 아직 위치 데이터가 전혀 없다면 로딩 화면 표시
  const hasAnyLocation =
    myLocation ||
    safeUserLocations.some((user) => user.latitude && user.longitude);
  if (!hasAnyLocation && center === DEFAULT_CENTER) {
    return <LoadingPage />;
  }

  // const myLocation = { latitude: 37.504729, longitude: 126.957631 };

  const moveToMyLocation = () => {
    if (myLocation) {
      setCenter({ lat: myLocation.latitude, lng: myLocation.longitude });
    }
  };

  return (
    <Layout>
      <MapContainer>
        <Map
          center={center}
          style={{ width: "100%", height: "100%" }}
          level={4}
          onCenterChanged={(map) => {
            const newCenter = map.getCenter();
            setCenter({ lat: newCenter.getLat(), lng: newCenter.getLng() });
          }}
        >
          {safeUserLocations.map((user) => {
            if (!user.latitude || !user.longitude) return null;

            const markerImage = {
              src: getMarkerImage(user.status) || MarkerImage, // undfined면 기본 이미지
              size: { width: 50, height: 50 },
              options: { offset: { x: 25, y: 50 } },
            };

            if (user.userId === userId) {
              return (
                <React.Fragment key={`current-${user.userId}`}>
                  <MapMarker
                    key={`marker-${user.userId}`}
                    position={{ lat: user.latitude, lng: user.longitude }}
                    image={markerImage}
                    title={`${user.name} (나)`}
                  />

                  {/* 작은 빨간 점 */}
                  {/* <MapMarker
                  position={{ lat: user.latitude, lng: user.longitude }}
                  key={`${user.userId}-dot`}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: "#FF2370",
                      border: "2px solid white",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                </MapMarker> */}

                  {/* 레이더 같은 반투명한 원 */}
                  {/* <Circle
                  key={`${user.userId}-circle`}
                  center={{ lat: user.latitude, lng: user.longitude }} // 원의 중심 좌표
                  radius={150} // 반경(m)
                  strokeWeight={2} // 테두리 굵기
                  strokeColor={"#FF2370"} // 테두리 색
                  strokeOpacity={0.8} // 테두리 불투명도
                  fillColor={"#FF2370"} // 내부 채움 색
                  fillOpacity={0.2} // 내부 채움 색 불투명도
                /> */}

                  {/* 그라데이션 원 */}
                  <CustomOverlayMap
                    key={`radius-${user.userId}`}
                    position={{ lat: user.latitude, lng: user.longitude }}
                  >
                    <div
                      style={{
                        width: "250px",
                        height: "250px",
                        borderRadius: "50%",
                        background:
                          "radial-gradient(circle, rgba(0, 255, 0, 0.1) 0%, rgba(0, 128, 0, 0.7) 90%)",
                        transform: "translate(-50%, -50%)",
                        pointerEvents: "none",
                      }}
                    />
                  </CustomOverlayMap>

                  {/* 내 위치 (빨간 점) */}
                  <CustomOverlayMap
                    key={`dot-${user.userId}`}
                    position={{ lat: user.latitude, lng: user.longitude }}
                  >
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: "#00cc00",
                        border: "none",
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  </CustomOverlayMap>
                </React.Fragment>
              );
            }

            return (
              <MapMarker
                key={`marker-${user.userId}`}
                position={{ lat: user.latitude, lng: user.longitude }}
                image={markerImage}
                title={user.name}
              />
            );
          })}
        </Map>

        <LocateButton onClick={moveToMyLocation}>내 위치로 이동</LocateButton>
      </MapContainer>
    </Layout>
  );
}

const MapContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 100%;
`;

const LocateButton = styled.button`
  position: absolute;
  bottom: 20px;
  right: 20px;
  padding: 10px 20px;
  z-index: 10;
  border: none;
  border-radius: 8px;
  background: #222;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);

  &:hover {
    background: #333;
  }
`;
