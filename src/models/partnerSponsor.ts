export type PartnerSponsorType = 'Partner' | 'Sponsor'

/**
 * Datensatz der PARTNER_SPONSOR Tabelle
 */
export interface PartnerSponsor {
  id: string | number
 name: string
 type: PartnerSponsorType
 logo?: string | null
 website?: string | null
  description?: string | null
  /** Normalisierte Logo-URL (bevorzugt card_cover) */
  displayUrl?: string | null
}
