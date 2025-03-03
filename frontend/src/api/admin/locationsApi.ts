import axios from "axios"
import { LocationFormData, LocationRequest, LocationResponse, Location } from "@interfaces/admin/LocationTypes"

const API_URL = "http://localhost:4000/api/locations"

export const getAllLocations = async (): Promise<LocationResponse[]> => {
    const response = await axios.get<LocationResponse[]>(API_URL)
    return response.data
}

export const createLocation = async (location: LocationRequest): Promise<void> => {
    await axios.post(API_URL, location)
}

export const adaptLocationFromResponse = (response: LocationResponse): Location => {
  return {
      ID: response.id,
      name: response.nombre,
      locationType: response.tipoUbicacion
  }
}

export const adaptLocationToRequest = (formData: LocationFormData): LocationRequest => {
  return {
      id: formData.ID,
      nombre: formData.name,
      tipoUbicacion: formData.locationType.filter((t): t is string => !!t)
  }
}
