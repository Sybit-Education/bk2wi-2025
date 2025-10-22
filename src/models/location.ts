import type { LatLng } from 'leaflet'

export interface Location {
  id?: string | number
  name: string
  geoLocation: string
  latLang: LatLng
}
