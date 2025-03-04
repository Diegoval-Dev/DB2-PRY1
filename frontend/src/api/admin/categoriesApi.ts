import axios from "axios"
import { Category } from "@interfaces/admin/CategoryTypes"

const API_URL = import.meta.env.VITE_API_URL

export const fetchCategories = async (): Promise<Category[]> => {
    const response = await axios.get<Category[]>(`${API_URL}/categories`)
    return response.data
}

export const createCategory = async (category: Category): Promise<void> => {
    await axios.post(`${API_URL}/categories`, category)
}


export const updateCategory = async (id: string, data: Partial<Category>): Promise<void> => {
    await axios.patch(`${API_URL}/categories/${id}`, data)
}

export const deleteCategory = async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/categories/${id}`)
}