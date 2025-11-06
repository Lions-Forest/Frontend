import "./App.css";
import KakaoMap from "./components/features/map";

function App() {
  return (
    <>
      <div>
        <h2>카카오맵 테스트</h2>
        <KakaoMap />

        <KakaoMap
          width="80vw"
          height="50vh"
          center={{ lat: 35.1796, lng: 129.0756 }}
          markerPosition={{ lat: 35.1796, lng: 129.0756 }}
          markerLabel="부산"
          level={4}
        />
      </div>
    </>
  );
}

export default App;
