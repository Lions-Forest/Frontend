import { useState } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

interface PlaceResult {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export const usePlaceSearch = () => {
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchPlaces = (keyword: string) => {
    if (!window.kakao || !window.kakao.maps) {
      setError("Kakao 지도 SDK가 로드되지 않았습니다.");
      return;
    }

    if (!keyword.trim()) {
      setError("검색어를 입력하세요.");
      return;
    }

    setLoading(true);
    setError(null);

    const ps = new window.kakao.maps.services.Places();

    ps.keywordSearch(keyword, (data: any, status: string) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const parsed: PlaceResult[] = data.map((item: any) => ({
          name: item.place_name,
          address: item.road_address_name || item.address_name,
          lat: parseFloat(item.y),
          lng: parseFloat(item.x),
        }));
        setResults(parsed);
      } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
        setError("검색 결과가 없습니다.");
      } else {
        setError("검색 중 오류가 발생했습니다.");
      }
      setLoading(false);
    });
  };
  return { results, loading, error, searchPlaces };
};
