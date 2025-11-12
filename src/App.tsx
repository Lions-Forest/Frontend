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
            <Route path="/home/create-meeting/step1" element={<CreateMeetingPage />} />
            <Route path="/home/create-meeting/step2" element={<CreateMeetingPage />} />
            <Route path="/home/create-meeting/step3" element={<CreateMeetingPage />} />
            <Route path="/home/create-meeting/step4" element={<CreateMeetingPage />} />
            <Route path="/home/create-meeting/step5" element={<CreateMeetingPage />} />
            <Route path="/home/create-meeting/step6" element={<CreateMeetingPage />} />
            <Route path="/home/create-meeting/result" element={<CreateMeetingPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
