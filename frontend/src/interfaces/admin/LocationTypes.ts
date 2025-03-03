export interface LocationResponse {
  id: string
  nombre: string
  tipoUbicacion: string[]
}

export interface Location {
  ID: string
  name: string
  locationType: string[]
}

export interface LocationRequest {
  id: string
  nombre: string
  tipoUbicacion: string[]
}

export interface LocationFormData {
  ID: string
  name: string
  locationType: (string | undefined)[]
}
