import { Map, MapMarker } from "react-kakao-maps-sdk";
import { useAllLocations } from "@/hooks/useAllLocations";
import { useMyLocation } from "@/hooks/useMyLocation";
import { useEffect, useState } from "react";
import LoadingPage from "@/pages/LoadingPage";
import MarkerImage from "@/assets/images/LoadingLion.svg"; // 임시로 다른 사진 지정

export default function BaseMap({ userId }: { userId: string }) {
  useMyLocation(userId); // 내 위치 Firebase에 업로드
  const locations = useAllLocations(); // 모든 사용자 위치 구독
  const myLocation = locations?.[userId]; // 모든 사용자 위치 중 내 위치 찾아내기 (중심 좌표를 찾기 위해)
  const [center, setCenter] = useState<{ lat: Number; lng: number } | null>(
    null
  );
  const markerImage = {
    src: MarkerImage,
    size: { width: 50, height: 50},
    options: { offset: { x: 25, y: 50 }}, // 마커 중심 조정
  };

  useEffect(() => {
    if (myLocation) {
      setCenter({ lat: myLocation.latitude, lng: myLocation.longitude });
    }
  }, [myLocation]);

  // 아직 위치 데이터가 들어오지 않았다면 로딩 화면 표시
  const isLoading = !locations || !myLocation;
  if (isLoading) return <LoadingPage />;

  // const myLocation = { latitude: 37.5665, longitude: 126.978 };

  return (
    <Map
      center={{ lat: myLocation.latitude, lng: myLocation.longitude }}
      style={{ width: "100%", height: "100%" }}
      level={4}
    >
      모든 사용자 위치에 마커 표시 -> locatioins의 각 키(userId)와 값(loc)을 순회
      {Object.entries(locations).map(([id, loc]) =>
        loc?.latitude && loc?.longitude ? (
          <MapMarker
            key={id} // React 리스트용 키
            position={{ lat: loc.latitude, lng: loc.longitude }}
            title={id === userId ? "내 위치" : `사용자 ${id}`} // 마커에 마우스 올렸을 때 보일 텍스트
          />
        ) : null
      )}
      <MapMarker
        position={{ lat: myLocation.latitude, lng: myLocation.longitude }}
        image={markerImage}
        title="내 위치"
      />
    </Map>
  );
}
