import { ApiClient } from 'apiClient'

// Singleton-Instanz für den NocoDBService
let instance: NocoDBService | null = null

/**
 * Optionen für Abfragen an die NocoDB-API
 */
export interface QueryOptions {
  /** Felder, die zurückgegeben werden sollen (kommagetrennt) */
  fields?: string;
  /** Sortierung (z.B. "field1,-field2" für aufsteigend nach field1, absteigend nach field2) */
  sort?: string;
  /** Filterbedingungen (z.B. "(field1,eq,value1)~and(field2,eq,value2)") */
  where?: string;
  /** Anzahl zu überspringender Datensätze (für Paginierung) */
  offset?: number;
  /** Maximale Anzahl zurückzugebender Datensätze */
  limit?: number;
  /** View-ID, falls eine bestimmte Ansicht verwendet werden soll */
  viewId?: string;
}

/**
 * Paginierungsinformationen in der API-Antwort
 */
export interface PageInfo {
  totalRows: number;
  page: number;
  pageSize: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

/**
 * Generische Antwort mit Paginierung
 */
export interface ListResponse<T> {
  list: T[];
  pageInfo: PageInfo;
}

/**
 * Service für die Kommunikation mit der NocoDB-API v2
 * Ermöglicht CRUD-Operationen auf beliebige Tabellen
 */
export class NocoDBService {
  private apiClient: ApiClient
  private tableIds: Record<string, string> = {}

  constructor(apiClient?: ApiClient) {
    // Wenn kein apiClient übergeben wird, erstellen wir einen Standard-Client
    this.apiClient = apiClient || new ApiClient({
      baseURL: import.meta.env.VITE_NOCODB_URL || 'http://localhost:8080',
      apiKey: import.meta.env.VITE_NOCODB_API_KEY || ''
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

    if (options.fields) queryParams.push(`fields=${options.fields}`)
    if (options.sort) queryParams.push(`sort=${options.sort}`)
    if (options.where) queryParams.push(`where=${options.where}`)
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
      throw new Error(`Datensätze konnten nicht abgerufen werden: ${error}`)
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
      url += `?fields=${fields}`
    }

    try {
      const response = await this.apiClient.get<T>(url)
      return response
    } catch (error) {
      console.error(`Fehler beim Abrufen des Datensatzes ${recordId} aus ${tableName}:`, error)
      throw new Error(`Datensatz konnte nicht abgerufen werden: ${error}`)
    }
  }

  /**
   * Erstellt einen oder mehrere neue Datensätze in einer Tabelle
   * @param tableName Name oder ID der Tabelle
   * @param data Daten für den neuen Datensatz oder Array von Datensätzen
   * @returns Die erstellten Datensätze mit ihren IDs
   */
  async createRecords<T, R = any>(tableName: string, data: T | T[]): Promise<R[]> {
    const tableId = this.getTableId(tableName)
    const url = `/api/v2/tables/${tableId}/records`

    // Stelle sicher, dass die Daten als Array vorliegen
    const dataArray = Array.isArray(data) ? data : [data]

    try {
      const response = await this.apiClient.post<R[]>(url, dataArray)
      return response
    } catch (error) {
      console.error(`Fehler beim Erstellen von Datensätzen in ${tableName}:`, error)
      throw new Error(`Datensätze konnten nicht erstellt werden: ${error}`)
    }
  }

  /**
   * Aktualisiert einen oder mehrere Datensätze in einer Tabelle
   * @param tableName Name oder ID der Tabelle
   * @param data Daten für die Aktualisierung (muss ID-Feld enthalten)
   * @returns Die aktualisierten Datensätze mit ihren IDs
   */
  async updateRecords<T, R = any>(tableName: string, data: T | T[]): Promise<R[]> {
    const tableId = this.getTableId(tableName)
    const url = `/api/v2/tables/${tableId}/records`

    // Stelle sicher, dass die Daten als Array vorliegen
    const dataArray = Array.isArray(data) ? data : [data]

    try {
      const response = await this.apiClient.patch<R[]>(url, dataArray)
      return response
    } catch (error) {
      console.error(`Fehler beim Aktualisieren von Datensätzen in ${tableName}:`, error)
      throw new Error(`Datensätze konnten nicht aktualisiert werden: ${error}`)
    }
  }

  /**
   * Löscht einen oder mehrere Datensätze aus einer Tabelle
   * @param tableName Name oder ID der Tabelle
   * @param recordIds ID oder Array von IDs der zu löschenden Datensätze
   * @returns Die gelöschten Datensatz-IDs
   */
  async deleteRecords<R = any>(tableName: string, recordIds: string | number | Array<{id: string | number}>): Promise<R[]> {
    const tableId = this.getTableId(tableName)
    const url = `/api/v2/tables/${tableId}/records`

    // Formatiere die IDs in das erwartete Format
    let dataArray: Array<{id: string | number}>;

    if (Array.isArray(recordIds)) {
      // Prüfe, ob es bereits ein Array von Objekten mit ID ist
      if (typeof recordIds[0] === 'object' && recordIds[0] !== null && 'id' in recordIds[0]) {
        dataArray = recordIds as Array<{id: string | number}>
      } else {
        // Konvertiere Array von IDs zu Array von Objekten mit ID
        dataArray = (recordIds as Array<string | number>).map(id => ({ id }))
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
      throw new Error(`Datensätze konnten nicht gelöscht werden: ${error}`)
    }
  }

  /**
   * Zählt die Anzahl der Datensätze in einer Tabelle
   * @param tableName Name oder ID der Tabelle
   * @param options Optionale Filter und View-ID
   * @returns Die Anzahl der Datensätze
   */
  async countRecords(tableName: string, options: Pick<QueryOptions, 'where' | 'viewId'> = {}): Promise<number> {
    const tableId = this.getTableId(tableName)

    let url = `/api/v2/tables/${tableId}/records/count`
    const queryParams: string[] = []

    if (options.where) queryParams.push(`where=${options.where}`)
    if (options.viewId) queryParams.push(`viewId=${options.viewId}`)

    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`
    }

    try {
      const response = await this.apiClient.get<{count: number}>(url)
      return response.count
    } catch (error) {
      console.error(`Fehler beim Zählen der Datensätze in ${tableName}:`, error)
      throw new Error(`Datensätze konnten nicht gezählt werden: ${error}`)
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
    options: QueryOptions = {}
  ): Promise<ListResponse<T>> {
    const tableId = this.getTableId(tableName)

    let url = `/api/v2/tables/${tableId}/links/${linkFieldId}/records/${recordId}`
    const queryParams: string[] = []

    if (options.fields) queryParams.push(`fields=${options.fields}`)
    if (options.sort) queryParams.push(`sort=${options.sort}`)
    if (options.where) queryParams.push(`where=${options.where}`)
    if (options.offset !== undefined) queryParams.push(`offset=${options.offset}`)
    if (options.limit !== undefined) queryParams.push(`limit=${options.limit}`)

    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`
    }

    try {
      const response = await this.apiClient.get<ListResponse<T>>(url)
      return response
    } catch (error) {
      console.error(`Fehler beim Abrufen verknüpfter Datensätze für ${recordId} in ${tableName}:`, error)
      throw new Error(`Verknüpfte Datensätze konnten nicht abgerufen werden: ${error}`)
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
    linkedRecordIds: Array<{id: string | number}>
  ): Promise<boolean> {
    const tableId = this.getTableId(tableName)
    const url = `/api/v2/tables/${tableId}/links/${linkFieldId}/records/${recordId}`

    try {
      const response = await this.apiClient.post<boolean>(url, linkedRecordIds)
      return response
    } catch (error) {
      console.error(`Fehler beim Verknüpfen von Datensätzen mit ${recordId} in ${tableName}:`, error)
      throw new Error(`Datensätze konnten nicht verknüpft werden: ${error}`)
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
    linkedRecordIds: Array<{id: string | number}>
  ): Promise<boolean> {
    const tableId = this.getTableId(tableName)
    const url = `/api/v2/tables/${tableId}/links/${linkFieldId}/records/${recordId}`

    try {
      const response = await this.apiClient.delete<boolean>(url, { data: linkedRecordIds })
      return response
    } catch (error) {
      console.error(`Fehler beim Aufheben der Verknüpfung von Datensätzen mit ${recordId} in ${tableName}:`, error)
      throw new Error(`Verknüpfung konnte nicht aufgehoben werden: ${error}`)
    }
  }

  // --- Spezifische Methoden für die bestehende Funktionalität ---

  /**
   * Abrufen der Projekteinstellungen
   */
  async getSettings(): Promise<Settings> {
    try {
      const response = await this.getRecords<Settings>('settings', { limit: 1 })

      if (response.list && response.list.length > 0) {
        // Sicherstellen, dass goal_eur eine Zahl ist
        const result = response.list[0];
        if (typeof result.goal_eur !== 'number') {
          result.goal_eur = parseFloat(result.goal_eur as any) || 0;
        }
        return result;
      }

      throw new Error('Keine Einstellungen gefunden')
    } catch (error) {
      console.error('Fehler beim Abrufen der Einstellungen:', error)
      throw new Error(`Einstellungen konnten nicht abgerufen werden: ${error}`)
    }
  }

  /**
   * Abrufen aller Spenden
   */
  async getDonations(): Promise<Donation[]> {
    try {
      const response = await this.getRecords<Donation>('donations', { limit: 1000 })

      console.log(`Anzahl geladener Spenden: ${response.list ? response.list.length : 0}`)

      // Sicherstellen, dass alle Spenden gültige Zahlen für amount_eur haben
      return response.list ? response.list.map(donation => {
        if (typeof donation.amount_eur !== 'number') {
          donation.amount_eur = parseFloat(donation.amount_eur as any) || 0;
        }
        return donation;
      }) : [];
    } catch (error) {
      console.error('Fehler beim Abrufen der Spenden:', error)
      throw new Error(`Spenden konnten nicht abgerufen werden: ${error}`)
    }
  }

  /**
   * Hinzufügen einer neuen Spende
   */
  async addDonation(
    amount: number,
    channel = 'kiosk',
    projectName?: string,
    paymentMethod?: 'bar' | 'paypal',
  ): Promise<DonationResponse> {
    try {
      const timestamp = new Date().toISOString()

      // Bereite die Daten vor
      const donationData = {
        timestamp,
        amount_eur: amount,
        channel,
        projectName,
        payment_method: paymentMethod,
      }

      console.log('Sende Donation-Daten:', donationData);

      const [donation] = await this.createRecords<typeof donationData, Donation>('donations', donationData)

      return {
        success: true,
        donation,
      }
    } catch (error) {
      console.error('Fehler beim Hinzufügen der Spende:', error)
      return {
        success: false,
        error: 'Spende konnte nicht gespeichert werden',
      }
    }
  }

  /**
   * Abrufen der aktuellen Spendenstatistik
   */
  async getStats(): Promise<Stats> {
    try {
      // Einstellungen abrufen
      const settings = await this.getSettings()
      console.log('Geladene Einstellungen:', settings)

      // Alle Spenden abrufen
      const donations = await this.getDonations()
      console.log('Geladene Spenden:', donations)

      // Gesamtbetrag berechnen
      const total = donations.reduce((sum, donation) => {
        // Sicherstellen, dass amount_eur eine Zahl ist
        const amount = typeof donation.amount_eur === 'number'
          ? donation.amount_eur
          : parseFloat(donation.amount_eur as any) || 0
        return sum + amount
      }, 0)

      console.log('Berechneter Gesamtbetrag:', total)

      // Fortschritt berechnen (0-1)
      const goal = settings.goal_eur || 0;
      const progress = goal > 0 ? Math.min(total / goal, 1) : 0;
      console.log('Berechneter Fortschritt:', progress, `(${total}/${goal})`);

      // Letzte Spende ermitteln
      let lastDonation = null;
      if (donations.length > 0) {
        // Sortieren nach Zeitstempel (neueste zuerst)
        const sortedDonations = [...donations].sort((a, b) => {
          const dateA = new Date(a.timestamp).getTime();
          const dateB = new Date(b.timestamp).getTime();
          return dateB - dateA;
        });
        lastDonation = sortedDonations[0];
      }

      // Stats-Objekt mit ID erstellen
      const statsObj: Stats = {
        id: settings.id, // ID aus den Einstellungen verwenden
        projectName: settings.projectName || 'Projekt',
        goal_eur: goal,
        total_eur: Number(total.toFixed(2)),
        progress: Number(progress.toFixed(4)),
        last_donation: lastDonation,
      }

      console.log('Erstelltes Stats-Objekt:', statsObj);

      return statsObj
    } catch (error) {
      console.error('Fehler beim Abrufen der Statistik:', error)
      throw new Error('Statistik konnte nicht abgerufen werden')
    }
  }
}

export default NocoDBService

// Hook für einfachen Zugriff auf den NocoDBService
export function useNocoDBService(): NocoDBService {
  return NocoDBService.getInstance()
}
