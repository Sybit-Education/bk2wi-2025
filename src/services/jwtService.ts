import jwt from 'jsonwebtoken'
import type { UserInfo } from '@/models/userInfo'

// Sicherheitsrelevante Konfiguration
const JWT_SECRET = import.meta.env.VITE_JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = '15m' // Token läuft nach 15 Minuten ab
const REFRESH_TOKEN_EXPIRES_IN = '7d' // Refresh-Token läuft nach 7 Tagen ab

export interface JwtPayload {
  userId: string | number
  username: string
  email: string
  exp?: number
  iat?: number
}

export interface TokenResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

/**
 * Service für die Verwaltung von JWT-Tokens
 */
export class JwtService {
  /**
   * Generiert ein JWT-Token für einen Benutzer
   * @param user Der Benutzer, für den das Token generiert werden soll
   * @returns Das generierte Token und Refresh-Token
   */
  generateTokens(user: UserInfo): TokenResponse {
    if (!user.id) {
      throw new Error('Benutzer-ID ist erforderlich für die Token-Generierung')
    }

    const payload: JwtPayload = {
      userId: user.id,
      username: user.username,
      email: user.email,
    }

    // Access Token generieren
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
    
    // Refresh Token generieren
    const refreshToken = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
    )

    // Ablaufzeit berechnen (in Sekunden)
    const expiresIn = this.getExpirationTime(accessToken)

    return {
      accessToken,
      refreshToken,
      expiresIn,
    }
  }

  /**
   * Verifiziert ein JWT-Token
   * @param token Das zu verifizierende Token
   * @returns Die dekodierten Token-Daten oder null, wenn das Token ungültig ist
   */
  verifyToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
      return decoded
    } catch (error) {
      console.error('Token-Verifizierungsfehler:', error)
      return null
    }
  }

  /**
   * Generiert ein neues Access-Token mit einem Refresh-Token
   * @param refreshToken Das Refresh-Token
   * @returns Ein neues Access-Token oder null, wenn das Refresh-Token ungültig ist
   */
  refreshAccessToken(refreshToken: string): { accessToken: string; expiresIn: number } | null {
    try {
      const decoded = jwt.verify(refreshToken, JWT_SECRET) as { userId: string | number }
      
      if (!decoded || !decoded.userId) {
        return null
      }

      // Neues Access-Token generieren
      const payload: Partial<JwtPayload> = {
        userId: decoded.userId,
      }

      const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
      const expiresIn = this.getExpirationTime(accessToken)

      return {
        accessToken,
        expiresIn,
      }
    } catch (error) {
      console.error('Token-Refresh-Fehler:', error)
      return null
    }
  }

  /**
   * Berechnet die Ablaufzeit eines Tokens in Sekunden
   * @param token Das Token
   * @returns Die Ablaufzeit in Sekunden
   */
  private getExpirationTime(token: string): number {
    const decoded = jwt.decode(token) as { exp?: number }
    if (!decoded || !decoded.exp) {
      return 0
    }
    
    // Ablaufzeit in Sekunden (ab jetzt)
    return decoded.exp - Math.floor(Date.now() / 1000)
  }
}
