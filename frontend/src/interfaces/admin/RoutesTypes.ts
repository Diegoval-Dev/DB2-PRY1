export interface Route {
  ID: string
  origin: string
  destination: string
  distance: number
  transportType: string
}

export interface RouteResponse {
  id: string
  origen: string
  destino: string
  distancia: number
  tipoTransporte: string
}

export interface RouteRequest {
  id: string
  origen: string
  destino: string
  distancia: number
  tipoTransporte: string
}

export interface RouteFormData {
  ID: string
  origin: string
  destination: string
  distance: number
  transportType: string
}
