import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SolarSystem from "./components/SolarSystem";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SolarSystem />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;