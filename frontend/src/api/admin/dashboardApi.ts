import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

export interface DashboardMetrics {
    totalSuppliers: number
    totalIngredients: number
    totalInventories: number
    totalLocations: number
    totalRoutes: number
    totalCategories: number
}

export const fetchDashboardMetrics = async (): Promise<DashboardMetrics> => {
    const response = await axios.get<DashboardMetrics>(`${API_URL}/dashboard`)
    return response.data
}
