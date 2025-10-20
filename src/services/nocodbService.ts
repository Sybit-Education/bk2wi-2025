import { ApiClient } from '../api/apiClient'
import type { Settings, Donation, Stats, DonationResponse } from '../models/types'

// Singleton-Instanz für den NocoDBService
let instance: NocoDBService | null = null

/**
 * Service für die Kommunikation mit der NocoDB-API v2
 */
export class NocoDBService {
  private apiClient: ApiClient

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
   * Abrufen der Projekteinstellungen
   */
  async getSettings(): Promise<Settings> {
    // In v2 API verwenden wir /api/v2/tables/{tableId}/records
    const url = `/api/v2/tables/${this.settingsTable}/records`
    const settings = await this.apiClient.get<Settings[]>(url)

    console.log('Rohe Einstellungsdaten:', settings)

    // Wir nehmen den ersten Eintrag aus der Liste
    if (Array.isArray(settings) && settings.length > 0) {
      // Sicherstellen, dass goal_eur eine Zahl ist
      const result = settings[0];
      if (typeof result.goal_eur !== 'number') {
        result.goal_eur = parseFloat(result.goal_eur as any) || 0;
      }
      return result;
    }

    throw new Error('Keine Einstellungen gefunden')
  }

  /**
   * Abrufen aller Spenden
   */
  async getDonations(): Promise<Donation[]> {
    // In v2 API verwenden wir /api/v2/tables/{tableId}/records
    // Limit auf 1000 setzen, um sicherzustellen, dass alle Spenden geladen werden
    const url = `/api/v2/tables/${this.donationsTable}/records?limit=1000`
    const donations = await this.apiClient.get<Donation[]>(url)

    console.log(`Anzahl geladener Spenden: ${Array.isArray(donations) ? donations.length : 0}`)

    // Sicherstellen, dass alle Spenden gültige Zahlen für amount_eur haben
    return Array.isArray(donations) ? donations.map(donation => {
      if (typeof donation.amount_eur !== 'number') {
        donation.amount_eur = parseFloat(donation.amount_eur as any) || 0;
      }
      return donation;
    }) : [];
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
      // In v2 API verwenden wir /api/v2/tables/{tableId}/records
      const url = `/api/v2/tables/${this.donationsTable}/records`
      const timestamp = new Date().toISOString()

      // Bereite die Daten vor
      const donationData: unknown = {
        timestamp,
        amount_eur: amount,
        channel,
        projectName,
        payment_method: paymentMethod,
      }

      console.log('Sende Donation-Daten:', donationData);

      const donation = await this.apiClient.post<Donation>(url, donationData)

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
