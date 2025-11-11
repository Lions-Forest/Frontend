import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Landing";
import HomePage from "./pages/Home";
import MeetingDetailPage from "./pages/MeetingDetail/index";
import CreateMeetingPage from "./pages/CreateMeeting";
import { GlobalStyle } from "./styles/global";
import './App.css';

function App() {
  return (
    <>
      <GlobalStyle />
      <div className="container">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/home/meeting-detail" element={<MeetingDetailPage />} />
            <Route path="/home/create-meeting" element={<CreateMeetingPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
