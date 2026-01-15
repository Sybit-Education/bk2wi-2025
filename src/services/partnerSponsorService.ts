import { NocoDBService, type ListResponse } from './nocodbService'
import type { PartnerSponsor, PartnerSponsorType } from '@/models/partnerSponsor'

/**
 * Service für den Zugriff auf die PARTNER_SPONSOR Tabelle
 */
export class PartnerSponsorService {
  readonly nocoDBService: NocoDBService
  private readonly tableName = 'PARTNER_SPONSOR'

  private extractFirstLogo(value: unknown): string | undefined {
    if (!value) return undefined
    if (Array.isArray(value)) return this.extractFirstLogo(value[0])
    if (typeof value === 'string') return value

    if (typeof value === 'object') {
      const obj = value as Record<string, unknown>

      const thumbnails = obj.thumbnails as Record<string, unknown> | undefined
      const cardCoverThumb = thumbnails?.card_cover as Record<string, unknown> | undefined
      if (cardCoverThumb) {
        if (typeof cardCoverThumb.signedUrl === 'string') return cardCoverThumb.signedUrl
        if (typeof cardCoverThumb.url === 'string') return cardCoverThumb.url
      }

      const cardCover = obj.card_cover as Record<string, unknown> | string | undefined
      if (typeof cardCover === 'string') return cardCover
      if (cardCover && typeof cardCover === 'object') {
        if (typeof cardCover.signedUrl === 'string') return cardCover.signedUrl
        if (typeof cardCover.url === 'string') return cardCover.url
      }

      if (typeof obj.signedUrl === 'string') return obj.signedUrl
      if (typeof obj.url === 'string') return obj.url
      if (typeof obj.path === 'string') return obj.path
    }

    return undefined
  }

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

    const response = await this.nocoDBService.getRecords<PartnerSponsor>(this.tableName, {
      where: whereClause,
      limit,
      offset,
    })

    response.list = (response.list ?? []).map((item) => ({
      ...item,
      displayUrl: this.extractFirstLogo(item.logo) ?? null,
    }))

    return response
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
   * Hilfsmethode, die aus einem Datensatz (oder via ID) das erste Logo extrahiert.
   * Bevorzugt die card_cover-Thumbnail-Variante.
   */
  async getLogo(recordOrId: PartnerSponsor | string | number): Promise<string | undefined> {
    try {
      if (typeof recordOrId === 'object') {
        return this.extractFirstLogo((recordOrId as PartnerSponsor).logo)
      }

      const record = await this.nocoDBService.getRecord<PartnerSponsor>(
        this.tableName,
        recordOrId,
        'logo',
      )
      return this.extractFirstLogo((record as PartnerSponsor | undefined)?.logo)
    } catch (error) {
      console.error(`Fehler beim Abrufen der Logos für Sponsor/Partner ${recordOrId}:`, error)
      return undefined
    }
  }
}
