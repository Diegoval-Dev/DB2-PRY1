import React from "react"
import { Routes, Route } from "react-router-dom"
import Home from "@pages/Home"
import AdminLayout from "@layouts/AdminLayout"
import AdminDashboard from "@pages/admin/dashboard"
import SuppliersPage from "@pages/admin/suppliers"
import IngredientsPage from "@pages/admin/ingredients"
import OrdersPage from "@pages/admin/orders"
import InventoryPage from "@pages/admin/inventory"
import LocationsPage from "@pages/admin/locations"
import RoutesPage from "@pages/admin/routes"
import CategoriesPage from "@pages/admin/categories"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="suppliers" element={<SuppliersPage />} />
        <Route path="ingredients" element={<IngredientsPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="locations" element={<LocationsPage />} />
        <Route path="routes" element={<RoutesPage />} />
        <Route path="categories" element={<CategoriesPage />} />
      </Route>
    </Routes>
  )
}

export default App
