import type { UserInfo } from "./userInfo"
import type { Location } from "./location"

export interface PlantedTree {
  id: string | number
  message?: string
  users: UserInfo[]
  location: Location
  amount: number
  created_at: Date
}
