import { NocoDBService, type ListResponse } from './nocodbService'
import type { PartnerSponsor, PartnerSponsorType } from '@/models/partnerSponsor'

/**
 * Service für den Zugriff auf die PARTNER_SPONSOR Tabelle
 */
export class PartnerSponsorService {
  readonly nocoDBService: NocoDBService
  private readonly tableName = 'PARTNER_SPONSOR'

  constructor(nocoDBService?: NocoDBService) {
    this.nocoDBService = nocoDBService || new NocoDBService()
    this.nocoDBService.registerTable(this.tableName, 'm0syxl6tq6ufvgi')
  }

  /**
   * Liefert alle Einträge eines Typs (Partner oder Sponsor)
   * @param type Tabellenwert des Feldes Typ
   * @param limit Maximale Anzahl der Datensätze
   * @param offset Offset für Paging
   */
  async getByType(
    type: PartnerSponsorType,
    limit?: number,
    offset?: number,
  ): Promise<ListResponse<PartnerSponsor>> {
    const whereClause = `(type,eq,${type})`

    return this.nocoDBService.getRecords<PartnerSponsor>(this.tableName, {
      where: whereClause,
      limit,
      offset,
    })
  }

  /**
   * Liefert alle Partner
   */
  async getPartners(limit?: number, offset?: number): Promise<ListResponse<PartnerSponsor>> {
    return this.getByType('Partner', limit, offset)
  }

  /**
   * Liefert alle Sponsoren
   */
  async getSponsors(limit?: number, offset?: number): Promise<ListResponse<PartnerSponsor>> {
    return this.getByType('Sponsor', limit, offset)
  }

  /**
   * Hilfsmethode, um Logos eines Sponsors/Partners abzurufen.
   * Nutzt das Logo-Feld direkt und normalisiert den Rückgabewert zu einer String-Liste.
   * @param id ID des Sponsors/Partners
   * @returns Liste der Logo-URLs
   */
  async getLogos(id: string | number): Promise<string[]> {
    try {
      const record = await this.nocoDBService.getRecord<PartnerSponsor>(this.tableName, id, 'logo')
      const raw = (record as PartnerSponsor | undefined)?.logo

      if (!raw) return []
      if (Array.isArray(raw)) {
        return raw
          .map((item) => {
            if (typeof item === 'string') return item
            if (item && typeof item === 'object' && 'url' in item && typeof item.url === 'string')
              return item.url
            return null
          })
          .filter((url): url is string => Boolean(url))
      }

      if (typeof raw === 'string') return [raw]
      if (raw && typeof raw === 'object' && 'url' in raw && typeof (raw as { url?: string }).url === 'string') {
        return [(raw as { url: string }).url]
      }

      return []
    } catch (error) {
      console.error(`Fehler beim Abrufen der Logos für Sponsor/Partner ${id}:`, error)
      return []
    }
  }
}
