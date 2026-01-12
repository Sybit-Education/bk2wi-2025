import type { LatLng } from 'leaflet'
import type { UserInfo } from './userInfo'

export interface Location {
  id?: string | number
  name: string
  geoLocation: string
  info: string
  offeredByUser: UserInfo
  latLang?: LatLng
}
