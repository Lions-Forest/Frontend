import { useQuery } from "@tanstack/react-query";
import { fetchCurrentLocation } from "@/api/services/locationApi";
import { Map, MapMarker } from "react-kakao-maps-sdk";

export type BaseMapProps = {
  width?: string; // 지도 너비
  height?: string; // 지도 높이
  center?: { lat: number; lng: number }; // 지도 중심 위치
  markerPosition?: { lat: number; lng: number }; // 마커 위치
  markerLabel?: string; // 마커 텍스트
  level?: number; // 지도 확대 레벨
  useCurrentLocation?: boolean; // 현재 위치 사용 여부
};

const BaseMap = ({
  width = "80vw", // 지도 기본 너비
  height = "80vh", // 지도 기본 높이
  center = { lat: 37.5665, lng: 126.978 },
  markerPosition,
  markerLabel = "서울시청",
  level = 3, // 지도 기본 확대 레벨
  useCurrentLocation = false,
}: BaseMapProps) => {
  // React Query로 현재 위치 가져오기
  const {
    data: currentPos,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["currentLocation"],
    queryFn: fetchCurrentLocation,
    enabled: useCurrentLocation, // useCurrentLocation이 true일 때만 실행
    refetchInterval: 5000, // 5초마다 업데이트
  });

  // 현재 위치 모드 + 위치 데이터가 있으면 -> 현재 위치, 그 외에는 props로 받은 기본 center 사용
  const finalCenter = useCurrentLocation && currentPos ? currentPos : center;
  // markerPosition prop이 있으면 사용, 없으면 finalCenter 사용
  const finalMarker = markerPosition || finalCenter;

  if (useCurrentLocation && isLoading) return <div>위치 가져오는 중...</div>;
  if (useCurrentLocation && error) return <div>위치를 가져올 수 없습니다.</div>;

  return (
    <div style={{ width, height }}>
      <Map
        center={finalCenter}
        style={{ width: "100%", height: "100%" }}
        level={level}
      >
        <MapMarker position={finalMarker}>
          <div>{markerLabel}</div>
        </MapMarker>
      </Map>
    </div>
  );
};

export default BaseMap;
