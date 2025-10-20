/**
 * Interface für die Daten in der TREE_INFO Tabelle
 */
export interface TreeInfo {
  id?: string | number
  name?: string
  species?: string
  height?: number
  diameter?: number
  age?: number
  health_status?: string
  location?: string
  planted_date?: string
  last_inspection?: string
  notes?: string
  description?: string
  [key: string]: unknown
}

export default TreeInfo
