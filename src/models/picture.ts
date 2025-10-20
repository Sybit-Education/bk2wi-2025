/**
 * Interface für Bilddaten in der NocoDB-Datenbank
 */
export interface Picture {
  id?: string | number
  url?: string
  title?: string
  description?: string
  mimetype?: string
  size?: number
  width?: number
  height?: number
  tree_id?: string | number
  upload_date?: string
  tags?: string
  photographer?: string
  location?: string
  [key: string]: unknown
}

export default Picture
