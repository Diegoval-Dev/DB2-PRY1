import React from "react"
import { Routes, Route } from "react-router-dom"
import Home from "@pages/Home"
import AdminLayout from "@layouts/AdminLayout"
import AdminDashboard from "@pages/admin/dashboard"
import SuppliersPage from "@pages/admin/suppliers"
import IngredientsPage from "@pages/admin/ingredients"
import OrdersPage from "@pages/admin/orders"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="suppliers" element={<SuppliersPage />} />
        <Route path="ingredients" element={<IngredientsPage />} />
        <Route path="orders" element={<OrdersPage />} />
      </Route>
    </Routes>
  )
}

export default App
