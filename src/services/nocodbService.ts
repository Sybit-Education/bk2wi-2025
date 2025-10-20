import { ApiClient } from '../api/apiClient'

// Singleton-Instanz für den NocoDBService
let instance: NocoDBService | null = null

/**
 * Hilfsfunktion zum Umwandeln des ersten Buchstabens eines Strings in Großbuchstaben
 * @param str Der zu konvertierende String
 * @returns String mit großem Anfangsbuchstaben
 */
function capitalizeFirstLetter(str: string): string {
  if (!str || typeof str !== 'string' || str.length === 0) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Konvertiert alle Schlüssel eines Objekts, sodass der erste Buchstabe groß ist
 * @param obj Das zu konvertierende Objekt
 * @returns Ein neues Objekt mit konvertierten Schlüsseln
 */
function capitalizeObjectKeys<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  if (!obj || typeof obj !== 'object' || obj === null) return obj
  
  return Object.entries(obj).reduce((result, [key, value]) => {
    // Arrays und verschachtelte Objekte rekursiv verarbeiten
    if (Array.isArray(value)) {
      result[capitalizeFirstLetter(key)] = value.map(item => 
        typeof item === 'object' && item !== null ? capitalizeObjectKeys(item as Record<string, unknown>) : item
      )
    } else if (typeof value === 'object' && value !== null) {
      result[capitalizeFirstLetter(key)] = capitalizeObjectKeys(value as Record<string, unknown>)
    } else {
      result[capitalizeFirstLetter(key)] = value
    }
    return result
  }, {} as Record<string, unknown>)
}

/**
 * Optionen für Abfragen an die NocoDB-API
 */
export interface QueryOptions {
  /** Felder, die zurückgegeben werden sollen (kommagetrennt) */
  fields?: string
  /** Sortierung (z.B. "field1,-field2" für aufsteigend nach field1, absteigend nach field2) */
  sort?: string
  /** Filterbedingungen (z.B. "(field1,eq,value1)~and(field2,eq,value2)") */
  where?: string
  /** Anzahl zu überspringender Datensätze (für Paginierung) */
  offset?: number
  /** Maximale Anzahl zurückzugebender Datensätze */
  limit?: number
  /** View-ID, falls eine bestimmte Ansicht verwendet werden soll */
  viewId?: string
}

/**
 * Paginierungsinformationen in der API-Antwort
 */
export interface PageInfo {
  totalRows: number
  page: number
  pageSize: number
  isFirstPage: boolean
  isLastPage: boolean
}

/**
 * Generische Antwort mit Paginierung
 */
export interface ListResponse<T> {
  list: T[]
  pageInfo: PageInfo
}

/**
 * Service für die Kommunikation mit der NocoDB-API v2
 * Ermöglicht CRUD-Operationen auf beliebige Tabellen
 */
export class NocoDBService {
  private readonly apiClient: ApiClient
  private tableIds: Record<string, string> = {
    treeInfo: 'msiujkp7wh01rvt'
  }

  constructor(apiClient?: ApiClient) {
    // Wenn kein apiClient übergeben wird, erstellen wir einen Standard-Client
    this.apiClient =
      apiClient ||
      new ApiClient({
        baseURL: import.meta.env.VITE_NOCODB_API_URL || 'http://localhost:8080',
        apiKey: import.meta.env.VITE_NOCODB_API_KEY || '',
      })
  }

  // Factory-Methode für Singleton-Zugriff
  static getInstance(): NocoDBService {
    if (!instance) {
      instance = new NocoDBService()
    }
    return instance
  }

  /**
   * Registriert eine Tabellen-ID für einfacheren Zugriff
   * @param name Logischer Name der Tabelle
   * @param tableId NocoDB Tabellen-ID
   */
  registerTable(name: string, tableId: string): void {
    this.tableIds[name] = tableId
  }

  /**
   * Gibt die Tabellen-ID für einen logischen Namen zurück
   * @param name Logischer Name der Tabelle
   * @returns Die Tabellen-ID oder den Namen selbst, falls keine ID registriert ist
   */
  getTableId(name: string): string {
    return this.tableIds[name] || name
  }

  /**
   * Ruft eine Liste von Datensätzen aus einer Tabelle ab
   * @param tableName Name oder ID der Tabelle
   * @param options Abfrageoptionen (Felder, Sortierung, Filter, etc.)
   * @returns Liste von Datensätzen mit Paginierungsinformationen
   */
  async getRecords<T>(tableName: string, options: QueryOptions = {}): Promise<ListResponse<T>> {
    const tableId = this.getTableId(tableName)

    // Erstelle die URL mit Query-Parametern
    let url = `/api/v2/tables/${tableId}/records`
    const queryParams: string[] = []

    // Konvertiere Feldnamen in den Optionen
    if (options.fields) {
      const capitalizedFields = options.fields.split(',')
        .map(field => capitalizeFirstLetter(field.trim()))
        .join(',')
      queryParams.push(`fields=${capitalizedFields}`)
    }
    
    if (options.sort) {
      const capitalizedSort = options.sort.split(',')
        .map(sortField => {
          if (sortField.startsWith('-')) {
            return `-${capitalizeFirstLetter(sortField.substring(1).trim())}`
          }
          return capitalizeFirstLetter(sortField.trim())
        })
        .join(',')
      queryParams.push(`sort=${capitalizedSort}`)
    }
    
    if (options.where) {
      // Ersetze Feldnamen in where-Bedingungen
      // Format: (field,operator,value)~and(field2,operator2,value2)
      let whereClause = options.where
      
      // Regex zum Finden von Feldnamen in where-Bedingungen
      const fieldRegex = /\(([a-zA-Z0-9_]+),/g
      whereClause = whereClause.replace(fieldRegex, (match, fieldName) => {
        return `(${capitalizeFirstLetter(fieldName)},`
      })
      
      queryParams.push(`where=${whereClause}`)
    }
    
    if (options.offset !== undefined) queryParams.push(`offset=${options.offset}`)
    if (options.limit !== undefined) queryParams.push(`limit=${options.limit}`)
    if (options.viewId) queryParams.push(`viewId=${options.viewId}`)

    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`
    }

    try {
      const response = await this.apiClient.get<ListResponse<T>>(url)
      return response
    } catch (error) {
      console.error(`Fehler beim Abrufen der Datensätze aus ${tableName}:`, error)
      throw error
    }
  }

  /**
   * Ruft einen einzelnen Datensatz anhand seiner ID ab
   * @param tableName Name oder ID der Tabelle
   * @param recordId ID des Datensatzes
   * @param fields Optionale Liste von Feldern, die zurückgegeben werden sollen
   * @returns Der angeforderte Datensatz
   */
  async getRecord<T>(tableName: string, recordId: string | number, fields?: string): Promise<T> {
    const tableId = this.getTableId(tableName)

    let url = `/api/v2/tables/${tableId}/records/${recordId}`
    if (fields) {
      const capitalizedFields = fields.split(',')
        .map(field => capitalizeFirstLetter(field.trim()))
        .join(',')
      url += `?fields=${capitalizedFields}`
    }

    try {
      const response = await this.apiClient.get<T>(url)
      return response
    } catch (error) {
      console.error(`Fehler beim Abrufen des Datensatzes ${recordId} aus ${tableName}:`, error)
      throw error
    }
  }

  /**
   * Erstellt einen oder mehrere neue Datensätze in einer Tabelle
   * @param tableName Name oder ID der Tabelle
   * @param data Daten für den neuen Datensatz oder Array von Datensätzen
   * @returns Die erstellten Datensätze mit ihren IDs
   */
  async createRecords<T, R = unknown>(tableName: string, data: T | T[]): Promise<R[]> {
    const tableId = this.getTableId(tableName)
    const url = `/api/v2/tables/${tableId}/records`

    // Stelle sicher, dass die Daten als Array vorliegen
    const dataArray = Array.isArray(data) ? data : [data]
    
    // Konvertiere alle Schlüssel, sodass der erste Buchstabe groß ist
    const capitalizedDataArray = dataArray.map(item => 
      capitalizeObjectKeys(item as Record<string, unknown>)
    )

    try {
      const response = await this.apiClient.post<R[]>(url, capitalizedDataArray)
      return response
    } catch (error) {
      console.error(`Fehler beim Erstellen von Datensätzen in ${tableName}:`, error)
      throw error
    }
  }

  /**
   * Aktualisiert einen oder mehrere Datensätze in einer Tabelle
   * @param tableName Name oder ID der Tabelle
   * @param data Daten für die Aktualisierung (muss ID-Feld enthalten)
   * @returns Die aktualisierten Datensätze mit ihren IDs
   */
  async updateRecords<T, R = unknown>(tableName: string, data: T | T[]): Promise<R[]> {
    const tableId = this.getTableId(tableName)
    const url = `/api/v2/tables/${tableId}/records`

    // Stelle sicher, dass die Daten als Array vorliegen
    const dataArray = Array.isArray(data) ? data : [data]
    
    // Konvertiere alle Schlüssel, sodass der erste Buchstabe groß ist
    const capitalizedDataArray = dataArray.map(item => 
      capitalizeObjectKeys(item as Record<string, unknown>)
    )

    try {
      const response = await this.apiClient.patch<R[]>(url, capitalizedDataArray)
      return response
    } catch (error) {
      console.error(`Fehler beim Aktualisieren von Datensätzen in ${tableName}:`, error)
      throw error
    }
  }

  /**
   * Löscht einen oder mehrere Datensätze aus einer Tabelle
   * @param tableName Name oder ID der Tabelle
   * @param recordIds ID oder Array von IDs der zu löschenden Datensätze
   * @returns Die gelöschten Datensatz-IDs
   */
  async deleteRecords<R = unknown>(
    tableName: string,
    recordIds: string | number | Array<{ id: string | number }> | Array<string | number>,
  ): Promise<R[]> {
    const tableId = this.getTableId(tableName)
    const url = `/api/v2/tables/${tableId}/records`

    // Formatiere die IDs in das erwartete Format
    let dataArray: Array<{ id: string | number }>

    if (Array.isArray(recordIds)) {
      // Prüfe, ob es bereits ein Array von Objekten mit ID ist
      if (recordIds.length > 0 && typeof recordIds[0] === 'object' && recordIds[0] !== null && 'id' in recordIds[0]) {
        dataArray = recordIds as Array<{ id: string | number }>
      } else {
        // Konvertiere Array von IDs zu Array von Objekten mit ID
        dataArray = (recordIds as Array<string | number>).map((id) => ({ id }))
      }
    } else {
      // Konvertiere einzelne ID zu Array mit einem Objekt
      dataArray = [{ id: recordIds }]
    }

    try {
      const response = await this.apiClient.delete<R[]>(url, { data: dataArray })
      return response
    } catch (error) {
      console.error(`Fehler beim Löschen von Datensätzen aus ${tableName}:`, error)
      throw error
    }
  }

  /**
   * Zählt die Anzahl der Datensätze in einer Tabelle
   * @param tableName Name oder ID der Tabelle
   * @param options Optionale Filter und View-ID
   * @returns Die Anzahl der Datensätze
   */
  async countRecords(
    tableName: string,
    options: Pick<QueryOptions, 'where' | 'viewId'> = {},
  ): Promise<number> {
    const tableId = this.getTableId(tableName)

    let url = `/api/v2/tables/${tableId}/records/count`
    const queryParams: string[] = []

    if (options.where) {
      // Ersetze Feldnamen in where-Bedingungen
      let whereClause = options.where
      
      // Regex zum Finden von Feldnamen in where-Bedingungen
      const fieldRegex = /\(([a-zA-Z0-9_]+),/g
      whereClause = whereClause.replace(fieldRegex, (match, fieldName) => {
        return `(${capitalizeFirstLetter(fieldName)},`
      })
      
      queryParams.push(`where=${whereClause}`)
    }
    
    if (options.viewId) queryParams.push(`viewId=${options.viewId}`)

    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`
    }

    try {
      const response = await this.apiClient.get<{ count: number }>(url)
      return response.count
    } catch (error) {
      console.error(`Fehler beim Zählen der Datensätze in ${tableName}:`, error)
      throw error
    }
  }

  /**
   * Ruft verknüpfte Datensätze für einen bestimmten Datensatz ab
   * @param tableName Name oder ID der Tabelle
   * @param linkFieldId ID des Verknüpfungsfeldes
   * @param recordId ID des Datensatzes
   * @param options Abfrageoptionen (Felder, Sortierung, Filter, etc.)
   * @returns Liste der verknüpften Datensätze
   */
  async getLinkedRecords<T>(
    tableName: string,
    linkFieldId: string,
    recordId: string | number,
    options: QueryOptions = {},
  ): Promise<ListResponse<T>> {
    const tableId = this.getTableId(tableName)

    let url = `/api/v2/tables/${tableId}/links/${linkFieldId}/records/${recordId}`
    const queryParams: string[] = []

    // Konvertiere Feldnamen in den Optionen
    if (options.fields) {
      const capitalizedFields = options.fields.split(',')
        .map(field => capitalizeFirstLetter(field.trim()))
        .join(',')
      queryParams.push(`fields=${capitalizedFields}`)
    }
    
    if (options.sort) {
      const capitalizedSort = options.sort.split(',')
        .map(sortField => {
          if (sortField.startsWith('-')) {
            return `-${capitalizeFirstLetter(sortField.substring(1).trim())}`
          }
          return capitalizeFirstLetter(sortField.trim())
        })
        .join(',')
      queryParams.push(`sort=${capitalizedSort}`)
    }
    
    if (options.where) {
      // Ersetze Feldnamen in where-Bedingungen
      let whereClause = options.where
      
      // Regex zum Finden von Feldnamen in where-Bedingungen
      const fieldRegex = /\(([a-zA-Z0-9_]+),/g
      whereClause = whereClause.replace(fieldRegex, (match, fieldName) => {
        return `(${capitalizeFirstLetter(fieldName)},`
      })
      
      queryParams.push(`where=${whereClause}`)
    }
    
    if (options.offset !== undefined) queryParams.push(`offset=${options.offset}`)
    if (options.limit !== undefined) queryParams.push(`limit=${options.limit}`)

    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`
    }

    try {
      const response = await this.apiClient.get<ListResponse<T>>(url)
      return response
    } catch (error) {
      console.error(
        `Fehler beim Abrufen verknüpfter Datensätze für ${recordId} in ${tableName}:`,
        error,
      )
      throw error
    }
  }

  /**
   * Verknüpft Datensätze miteinander
   * @param tableName Name oder ID der Tabelle
   * @param linkFieldId ID des Verknüpfungsfeldes
   * @param recordId ID des Datensatzes
   * @param linkedRecordIds IDs der zu verknüpfenden Datensätze
   * @returns true bei Erfolg
   */
  async linkRecords(
    tableName: string,
    linkFieldId: string,
    recordId: string | number,
    linkedRecordIds: Array<{ id: string | number }>,
  ): Promise<boolean> {
    const tableId = this.getTableId(tableName)
    const url = `/api/v2/tables/${tableId}/links/${linkFieldId}/records/${recordId}`

    try {
      const response = await this.apiClient.post<boolean>(url, linkedRecordIds)
      return response
    } catch (error) {
      console.error(
        `Fehler beim Verknüpfen von Datensätzen mit ${recordId} in ${tableName}:`,
        error,
      )
      throw error
    }
  }

  /**
   * Hebt die Verknüpfung zwischen Datensätzen auf
   * @param tableName Name oder ID der Tabelle
   * @param linkFieldId ID des Verknüpfungsfeldes
   * @param recordId ID des Datensatzes
   * @param linkedRecordIds IDs der zu entknüpfenden Datensätze
   * @returns true bei Erfolg
   */
  async unlinkRecords(
    tableName: string,
    linkFieldId: string,
    recordId: string | number,
    linkedRecordIds: Array<{ id: string | number }>,
  ): Promise<boolean> {
    const tableId = this.getTableId(tableName)
    const url = `/api/v2/tables/${tableId}/links/${linkFieldId}/records/${recordId}`

    try {
      const response = await this.apiClient.delete<boolean>(url, { data: linkedRecordIds })
      return response
    } catch (error) {
      console.error(
        `Fehler beim Aufheben der Verknüpfung von Datensätzen mit ${recordId} in ${tableName}:`,
        error,
      )
      throw error
    }
  }
}

export default NocoDBService

// Hook für einfachen Zugriff auf den NocoDBService
export function useNocoDBService(): NocoDBService {
  return NocoDBService.getInstance()
}
