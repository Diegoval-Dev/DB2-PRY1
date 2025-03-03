import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "@pages/Home";
import AdminDashboard from "@pages/admin/dashboard";
import SuppliersPage from "@pages/admin/suppliers";
import UserHome from "@pages/client/search-restaurant";
import CreateOrder from "@pages/client/createOrder";
import SummaryOrder from "@pages/client/summary-order";
import Orders from "@pages/client/orders";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/suppliers" element={<SuppliersPage />} />
        <Route path="/user" element={<UserHome />} />
        <Route path="/user/create-order" element={<CreateOrder />} />
        <Route path="/user/summary-order" element={<SummaryOrder />} />
        <Route path="/user/orders" element={<Orders />} />
      </Routes>
    </div>
  );
}

export default App;
