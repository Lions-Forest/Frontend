// 많은 마커를 지도에 표시할 때 근접한 마커를 하나로 묶어 관리해주는 기능
export const createClusterer = (
  map: kakao.maps.Map,
  markers: kakao.maps.Marker[]
) => {
  const clusterer = new kakao.maps.MarkerClusterer({
    map,
    averageCenter: true,
    minLevel: 3,
  });
  clusterer.addMarkers(markers);
  return clusterer;
};

// 지도에 커스텀 한 마커 띄우기
export const drawMarker = (
  map: kakao.maps.Map,
  position: { lat: number; lng: number },
  imageUrl: string
) => {
  const markerImage = new kakao.maps.MarkerImage(
    imageUrl,
    new kakao.maps.Size(64, 69) // 마커 이미지 크기
  );

  const latLng = new kakao.maps.LatLng(position.lat, position.lng);

  return new kakao.maps.Marker({
    map,
    position: latLng,
    image: markerImage,
  });
};

// 여러 좌표를 이어서 면(다각형)을 만드는 기능 (구역이나 영역 표시)
export const drawPolygon = (map: kakao.maps.Map, path: kakao.maps.LatLng[]) => {
  return new kakao.maps.Polygon({
    map,
    path,
    strokeWeight: 3,
    fillColor: "#FF0000",
    fillOpacity: 0.5,
  });
};

// 주소 검색, 장소 검색, 길찾기, 로컬 서비스 등을 지도와 함께 사용할 때
export const searchPlaces = (
  keyword: string,
  callback: (data: any) => void
) => {
  const ps = new kakao.maps.services.Places();
  ps.keywordSearch(keyword, (data, status) => {
    if (status === kakao.maps.services.Status.OK) {
      callback(data);
    }
  });
};
