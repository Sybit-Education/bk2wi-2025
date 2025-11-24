import type { UserInfo } from "./userInfo"
import type { Location } from "./location"

export interface PlanetedTree {
  id: string | number
  message?: string
  users: UserInfo[]
  location: Location
  amount: number
  created_at: Date
}
