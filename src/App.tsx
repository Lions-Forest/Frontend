import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Landing";
import HomePage from "./pages/Home";
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
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
