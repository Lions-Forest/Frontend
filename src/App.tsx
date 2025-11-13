import "./App.css";
import BaseMap from "./pages/Map/BaseMap";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Landing";
import HomePage from "./pages/Home";
import MeetingDetailPage from "./pages/MeetingDetail/index";
import CreateMeetingPage from "./pages/CreateMeeting";
import MyPage from "./pages/Mypage";
import NotificationPage from "./pages/NotificationPage";
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
      {/* <BaseMap
        userId={myUserId}
        name={myName}
        shareLocation={true}
        userLocations={userLocations}
      /> */}
      <PlaceSearchTest />
      <div className="container">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/notification" element={<NotificationPage />} />
            {/* <Route path="/map" element={<TestMap />} /> */}
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/home/meeting-detail/:id" element={<MeetingDetailPage />} />
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
