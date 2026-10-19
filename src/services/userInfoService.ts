import { NocoDBService } from './nocodbService'
import type { UserInfo } from '@/models/userInfo'
import { hashPassword, verifyPassword } from '@/utils/passwordUtils'

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
   * Gibt den Benutzer mit der angegebenen E-Mail zurück und überprüft das Passwort
   * @param email E-Mail des Benutzers
   * @param password Passwort des Benutzers
   * @returns Den angemeldeten Benutzer oder null, wenn die Anmeldedaten ungültig sind
   */
  async loginUser(email: string, password: string): Promise<UserInfo | null> {
    // Suche nur nach der E-Mail, da das Passwort jetzt verschlüsselt ist
    const whereClause = `(Email,eq,${email})`
    const response = await this.nocoDBService.getRecords<UserInfo>(this.tableName, {
      where: whereClause,
      limit: 1,
    })

    const user = response.list[0]
    
    // Wenn kein Benutzer gefunden wurde oder das Passwort nicht gesetzt ist
    if (!user || !user.password) {
      return null
    }

    // Überprüfe das Passwort mit bcrypt
    const passwordValid = await verifyPassword(password, user.password)
    
    return passwordValid ? user : null
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

  /**
   * Erstellt einen neuen Benutzer mit verschlüsseltem Passwort
   * @param userInfo Die Benutzerdaten
   * @returns Der erstellte Benutzer oder null, wenn ein Fehler auftritt
   */
  async createUser(userInfo: UserInfo): Promise<UserInfo | null> {
    try {
      // Passwort verschlüsseln
      if (userInfo.password) {
        userInfo.password = await hashPassword(userInfo.password)
      }

      const [createdUser] = await this.nocoDBService.createRecords<UserInfo, UserInfo>(
        this.tableName,
        userInfo,
      )
      return createdUser || null
    } catch (error) {
      console.error('Fehler beim Erstellen des Benutzers:', error)
      return null
    }
  }

  /**
   * Aktualisiert einen Benutzer
   * @param userInfo Die aktualisierten Benutzerdaten
   * @returns Der aktualisierte Benutzer oder null, wenn ein Fehler auftritt
   */
  async updateUser(userInfo: UserInfo): Promise<UserInfo | null> {
    try {
      if (!userInfo.id) {
        throw new Error('ID ist erforderlich für die Aktualisierung')
      }

      // Für Passwort-Änderungen nur minimale Felder senden
      const sanitizedPayload = this.pickAllowedFields(userInfo, ['id', 'password'] as const)

      // Wenn ein neues Passwort gesetzt wird, verschlüsseln wir es
      if (typeof sanitizedPayload.password === 'string') {
        // Prüfen, ob das Passwort bereits verschlüsselt ist
        // Bcrypt-Hashes beginnen immer mit $2a$, $2b$ oder $2y$
        if (!sanitizedPayload.password.startsWith('$2')) {
          sanitizedPayload.password = await hashPassword(sanitizedPayload.password)
        }
      }

      const [updatedUser] = await this.nocoDBService.updateRecords<UserInfo, UserInfo>(
        this.tableName,
        sanitizedPayload as UserInfo,
      )
      return updatedUser || null
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Benutzers:', error)
      return null
    }
  }

  /**
   * Ändert das Passwort eines Benutzers
   * @param userId ID des Benutzers
   * @param currentPassword Aktuelles Passwort
   * @param newPassword Neues Passwort
   * @returns true, wenn das Passwort erfolgreich geändert wurde, sonst false
   */
  async changePassword(
    userId: string | number,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    try {
      // Benutzer abrufen
      const user = await this.getUserById(userId)
      if (!user || !user.password) {
        return false
      }

      // Aktuelles Passwort überprüfen
      const passwordValid = await verifyPassword(currentPassword, user.password)
      if (!passwordValid) {
        return false
      }

      // Neues Passwort setzen
      user.password = await hashPassword(newPassword)
      
      // Benutzer aktualisieren
      const updatedUser = await this.updateUser(user)
      return !!updatedUser
    } catch (error) {
      console.error('Fehler beim Ändern des Passworts:', error)
      return false
    }
  }

  /**
   * Aktualisiert nur Profilfelder ohne Passwort (Username, Email, Bild)
   */
  async updateUserProfile(
    userInfo: Pick<UserInfo, 'id'> & Partial<Omit<UserInfo, 'password'>>,
  ): Promise<UserInfo | null> {
    if (!userInfo.id) {
      throw new Error('ID ist erforderlich für die Profilaktualisierung')
    }

    // Nur erlaubte Profilfelder (keine Passwörter, keine Attachments solange nicht explizit unterstützt)
    const sanitized = this.pickAllowedFields(userInfo, [
      'id',
      'username',
      'email',
      'treesPlanted',
      'moneyDonated',
      'signUpDate',
      'logedInLast',
    ] as const)

    const [updatedUser] = await this.nocoDBService.updateRecords<UserInfo, UserInfo>(
      this.tableName,
      sanitized as UserInfo,
    )
    return updatedUser || null
  }

  private removeUndefined<T extends Record<string, unknown>>(data: T): T {
    const entries = Object.entries(data).filter(([, value]) => value !== undefined)
    return Object.fromEntries(entries) as T
  }

  private pickAllowedFields<T, K extends keyof T>(
    data: T,
    keys: readonly K[],
  ): Partial<Pick<T, K>> {
    const result: Partial<Pick<T, K>> = {}
    keys.forEach((key) => {
      const value = data[key]
      if (value !== undefined) {
        result[key] = value
      }
    })
    return result
  }
}
