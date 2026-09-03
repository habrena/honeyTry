import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MenadzmentPanel from "./MenadzmentPanel";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<MenadzmentPanel />} />
    </Routes>
  </BrowserRouter>
);