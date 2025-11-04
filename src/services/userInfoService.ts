import { NocoDBService, type ListResponse } from './nocodbService'
import type { UserInfo } from '@/models/userInfo'
import type { Picture } from '@/models/picture'

/**
 * Service für den Zugriff auf die User Tabelle
 */
export class UserInfoService {
  readonly nocoDBService: NocoDBService
  private readonly tableName = 'user'

  constructor(nocoDBService?: NocoDBService) {
    this.nocoDBService = nocoDBService || new NocoDBService()
    this.nocoDBService.registerTable(this.tableName, 'mpmsr2rvjfa3t22')
  }

  /**
   * Gibt den Benutzer mit der angegebenen E-Mail zurück und Passwort, falls vorhanden
   * @param email E-Mail des Benutzers
   * @param password Passwort des Benutzers
   * @returns Den angemeldeten Benutzer oder null, wenn die Anmeldedaten ungültig sind
   */
  async loginUser(email: string, password: string): Promise<UserInfo | null> {
    const whereClause = `(Email,eq,${email})~and(Password,eq,${password})`
    const response = await this.nocoDBService.getRecords<UserInfo>(this.tableName, {
      where: whereClause,
      limit: 1,
    })

    return response.list[0] || null
  }

  /**
   * Ruft einen Benutzer anhand seiner ID ab
   * @param id ID des Benutzers
   * @returns Der angeforderte Benutzer oder null, wenn ein Fehler auftritt
   */
  async getUserById(id: string | number) {
    try {
      const user = await this.nocoDBService.getRecord<UserInfo>(this.tableName, id)
      return user as UserInfo
    }
    catch (error) {
      console.error('Fehler beim Abrufen des Benutzers:', error)
      return null
    }
  }
}
