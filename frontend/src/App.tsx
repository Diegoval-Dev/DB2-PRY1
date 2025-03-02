import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "@pages/Home";
import AdminDashboard from "@pages/admin/dashboard";
import SuppliersPage from "@pages/admin/suppliers";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/suppliers" element={<SuppliersPage />} />
      </Routes>
    </div>
  );
}

export default App;
