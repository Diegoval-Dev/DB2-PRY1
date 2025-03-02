import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

export const fetchDashboardSummary = async (): Promise<{ title: string; value: number }[]> => {
  const response = await axios.get<{ title: string; value: number }[]>(`${API_URL}/dashboard-summary`)
  return response.data
}
