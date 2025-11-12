// src/pages/Map/PlaceSearchTest.tsx
import { useState } from "react";
import { usePlaceSearch } from "@/hooks/usePlaceSearch";

export default function PlaceSearchTest() {
  const [keyword, setKeyword] = useState("");
  const { results, searchPlaces, loading, error } = usePlaceSearch();

  const handleSearch = () => {
    if (keyword.trim()) {
      searchPlaces(keyword);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="장소를 입력하세요"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button onClick={handleSearch}>검색</button>

      {loading && <p>검색 중...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {results.map((place, index) => (
          <li key={index}>
            {place.name} - {place.address} ({place.lat}, {place.lng})
          </li>
        ))}
      </ul>
    </div>
  );
}
