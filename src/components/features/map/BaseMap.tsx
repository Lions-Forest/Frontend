import { Map, MapMarker } from "react-kakao-maps-sdk";
import { useAllLocations } from "@/hooks/useAllLocations";
import { useMyLocation } from "@/hooks/useMyLocation";
import { useEffect, useState } from "react";
import LoadingPage from "@/pages/LoadingPage";
import MarkerImage from "@/assets/images/LoadingLion.svg"; // 임시로 다른 사진 지정
import type { UserLocation } from "@/api/UserLocation";
import { getMarkerImage } from "@/constants/markerImages";

interface BaseMapProps {
  userId: string;
  name: string;
  shareLocation: boolean;
  userLocations: UserLocation[];
}

export default function BaseMap({
  userId,
  name,
  shareLocation,
  userLocations,
}: BaseMapProps) {
  useMyLocation({ userId, name, shareLocation }); // 내 위치 Firebase에 업로드
  const locations = useAllLocations(); // 모든 사용자 위치 구독
  const myLocation = locations?.[userId]; // 모든 사용자 위치 중 내 위치 찾아내기 (중심 좌표를 찾기 위해)
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(
    myLocation ? { lat: myLocation.latitude, lng: myLocation.longitude } : null
  );

  useEffect(() => {
    if (myLocation) {
      setCenter({ lat: myLocation.latitude, lng: myLocation.longitude });
    }
  }, [myLocation]);

  // 아직 위치 데이터가 들어오지 않았다면 로딩 화면 표시
  const isLoading = !locations || !myLocation;
  if (isLoading) return <LoadingPage />;

  // const myLocation = { latitude: 37.504729, longitude: 126.957631 };

  const moveToMyLocation = () => {
    if (myLocation) {
      setCenter({ lat: myLocation.latitude, lng: myLocation.longitude });
    }
  };

  return (
    <>
      <Map
        center={center!}
        style={{ width: "100%", height: "100%" }}
        level={4}
        onCenterChanged={(map) => {
          const newCenter = map.getCenter();
          setCenter({ lat: newCenter.getLat(), lng: newCenter.getLng() });
        }}
      >
        {userLocations.map((user) => {
          if (!user.latitude || !user.longitude) return null;

          const markerImage = {
            src: getMarkerImage(user.status) || MarkerImage, // undfined면 기본 이미지
            size: { width: 50, height: 50 },
            options: { offset: { x: 25, y: 50 } },
          };

          return (
            <MapMarker
              key={user.userId}
              position={{ lat: user.latitude, lng: user.longitude }}
              image={markerImage}
              title={user.name}
            />
          );
        })}
      </Map>

      <button
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          padding: "10px 20px",
          zIndex: 10,
        }}
        onClick={moveToMyLocation}
      >
        내 위치로 이동
      </button>
    </>
  );
}
