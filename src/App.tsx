import "./App.css";
import BaseMap from "./components/features/map/BaseMap";
import LoadingPage from "./pages/LoadingPage";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Landing";
import HomePage from "./pages/Home";
import { GlobalStyle } from "./styles/global";
import "./App.css";

function App() {
  return (
    <>
      {/* <h2>카카오맵 테스트</h2>
        <BaseMap />

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
      <LoadingPage />
      <div className="container">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<HomePage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
