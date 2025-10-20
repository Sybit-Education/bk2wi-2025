import type { Picture } from './picture'

/**
 * Interface für die Daten in der TREE_INFO Tabelle
 */
export interface TreeInfo {
  id?: string | number
  name: string
  description?: string
  picture: Picture[]
}
