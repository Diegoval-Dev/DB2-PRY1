import axios from "axios";
import { RouteResponse, RouteRequest, Route, RouteFormData, CreateRouteRequest } from "@interfaces/admin/RoutesTypes";

const API_URL = "http://localhost:4000/api/routes";

export const getAllRoutes = async (): Promise<RouteResponse[]> => {
    const response = await axios.get<RouteResponse[]>(API_URL);
    return response.data;
};

export const createRoute = async (route: RouteRequest): Promise<void> => {
    await axios.post(API_URL, route);
};

export const updateRoute = async (id: string, data: Partial<CreateRouteRequest>): Promise<void> => {
  await axios.patch(`${API_URL}/routes/${id}`, data)
}

export const deleteRoute = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/routes/${id}`)
}


export const adaptRouteFromResponse = (response: RouteResponse): Route => ({
  ID: response.id,
  origin: response.origen,
  destination: response.destino,
  distance: response.distancia,
  transportType: response.tipoTransporte
});

export const adaptRouteToRequest = (form: RouteFormData): RouteRequest => ({
  id: form.ID,
  origen: form.origin,
  destino: form.destination,
  distancia: form.distance,
  tipoTransporte: form.transportType
});
