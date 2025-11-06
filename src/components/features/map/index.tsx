import { Map, MapMarker } from "react-kakao-maps-sdk";

export type KakaoMapProps = {
  width?: string; // 지도 너비
  height?: string; // 지도 높이
  center?: { lat: number; lng: number }; // 지도 중심 위치
  markerPosition?: { lat: number; lng: number }; // 마커 위치
  markerLabel?: string; // 마커 텍스트
  level?: number; // 지도 확대 레벨
};

const KakaoMap = ({
  width = "80vw", // 지도 기본 너비
  height = "80vh", // 지도 기본 높이
  center = { lat: 37.5665, lng: 126.978 },
  markerPosition,
  markerLabel = "서울시청",
  level = 3, // 지도 기본 확대 레벨
}: KakaoMapProps) => {
  const marker = markerPosition || center; // 마커 위치가 없으면 중심 위치 사용

  return (
    <div style={{ width, height }}>
      <Map
        center={center}
        style={{ width: "100%", height: "100%" }}
        level={level}
      >
        <MapMarker position={marker}>
          <div>{markerLabel}</div>
        </MapMarker>
      </Map>
    </div>
  );
};

export default KakaoMap;
