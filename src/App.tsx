import "./App.css";
import BaseMap from "./pages/Map/BaseMap";
import LoadingPage from "./pages/Map/LoadingPage";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Landing";
import HomePage from "./pages/Home";
import { GlobalStyle } from "./styles/global";
import "./App.css";
import { useAllLocations } from "./hooks/useAllLocations";
import PlaceSearchTest from "./pages/Map/PlaceSearchTest";

const myUserId = "testUser1";
const myName = "내 이름";

function App() {
  const locations = useAllLocations(); // Firestore에서 모든 공유 위치 구독
  const userLocations = Object.values(locations); // 객체 → 배열
  return (
    <>
      <h2>카카오맵 테스트</h2>
      {/* <BaseMap />

      <BaseMap
        width="80vw"
        height="50vh"
        center={{ lat: 35.1796, lng: 129.0756 }}
        markerPosition={{ lat: 35.1796, lng: 129.0756 }}
        markerLabel="부산"
        level={4}
      />

      <BaseMap
        useCurrentLocation={true}
        width="100%"
        height="80vh"
        markerLabel="내 위치"
      /> */}

      <GlobalStyle />
      {/* <LoadingPage /> */}
      <BaseMap
        userId={myUserId}
        name={myName}
        shareLocation={true}
        userLocations={userLocations}
      />
      <PlaceSearchTest />
      <div className="container">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<HomePage />} />
            {/* <Route path="/map" element={<TestMap />} /> */}
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
