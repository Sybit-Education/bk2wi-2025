import { jwtDecode } from 'jwt-decode'
import type { UserInfo } from '@/models/userInfo'

// Konfiguration für Token-Lebensdauer
const ACCESS_TOKEN_EXPIRES_IN = 15 * 60 * 1000 // 15 Minuten in Millisekunden
const REFRESH_TOKEN_EXPIRES_IN = 7 * 24 * 60 * 60 * 1000 // 7 Tage in Millisekunden

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
 * Service für die Verwaltung von JWT-Tokens (Browser-kompatible Version)
 * 
 * Hinweis: Da wir im Browser sind, können wir keine echten JWT-Tokens signieren.
 * Diese Implementierung simuliert die Token-Generierung für Demonstrationszwecke.
 * In einer Produktionsumgebung sollte die Token-Generierung auf dem Server erfolgen.
 */
export class JwtService {
  /**
   * Generiert ein simuliertes JWT-Token für einen Benutzer
   * @param user Der Benutzer, für den das Token generiert werden soll
   * @returns Das generierte Token und Refresh-Token
   */
  generateTokens(user: UserInfo): TokenResponse {
    if (!user.id) {
      throw new Error('Benutzer-ID ist erforderlich für die Token-Generierung')
    }

    const now = Date.now()
    const accessTokenExpiry = now + ACCESS_TOKEN_EXPIRES_IN
    const refreshTokenExpiry = now + REFRESH_TOKEN_EXPIRES_IN

    // Payload für Access Token
    const accessPayload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      iat: Math.floor(now / 1000),
      exp: Math.floor(accessTokenExpiry / 1000)
    }

    // Payload für Refresh Token
    const refreshPayload = {
      userId: user.id,
      iat: Math.floor(now / 1000),
      exp: Math.floor(refreshTokenExpiry / 1000)
    }

    // Token als Base64-kodierte JSON-Strings (simuliert)
    const accessToken = this.encodeToken(accessPayload)
    const refreshToken = this.encodeToken(refreshPayload)

    return {
      accessToken,
      refreshToken,
      expiresIn: Math.floor((accessTokenExpiry - now) / 1000)
    }
  }

  /**
   * Verifiziert ein JWT-Token
   * @param token Das zu verifizierende Token
   * @returns Die dekodierten Token-Daten oder null, wenn das Token ungültig ist
   */
  verifyToken(token: string): JwtPayload | null {
    try {
      const decoded = jwtDecode<JwtPayload>(token)
      
      // Prüfen, ob das Token abgelaufen ist
      const now = Math.floor(Date.now() / 1000)
      if (decoded.exp && decoded.exp < now) {
        console.warn('Token ist abgelaufen')
        return null
      }
      
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
      const decoded = this.verifyToken(refreshToken)
      
      if (!decoded || !decoded.userId) {
        return null
      }

      const now = Date.now()
      const accessTokenExpiry = now + ACCESS_TOKEN_EXPIRES_IN

      // Neues Access-Token generieren
      const accessPayload = {
        userId: decoded.userId,
        iat: Math.floor(now / 1000),
        exp: Math.floor(accessTokenExpiry / 1000)
      }

      const accessToken = this.encodeToken(accessPayload)

      return {
        accessToken,
        expiresIn: Math.floor(ACCESS_TOKEN_EXPIRES_IN / 1000)
      }
    } catch (error) {
      console.error('Token-Refresh-Fehler:', error)
      return null
    }
  }

  /**
   * Dekodiert ein Token ohne Validierung
   * @param token Das zu dekodierende Token
   * @returns Die dekodierten Token-Daten
   */
  decodeToken<T>(token: string): T {
    return jwtDecode<T>(token)
  }

  /**
   * Kodiert ein Objekt als simuliertes JWT-Token
   * @param payload Die zu kodierende Payload
   * @returns Das kodierte Token
   */
  private encodeToken(payload: Record<string, any>): string {
    // Simuliert ein JWT-Token durch Base64-Kodierung der Payload
    // In einer echten Implementierung würde hier eine Signatur hinzugefügt
    const header = { alg: 'HS256', typ: 'JWT' }
    const encodedHeader = btoa(JSON.stringify(header))
    const encodedPayload = btoa(JSON.stringify(payload))
    
    // Simulierte Signatur (in einer echten Implementierung würde hier eine kryptografische Signatur stehen)
    const signature = btoa('simulated-signature')
    
    return `${encodedHeader}.${encodedPayload}.${signature}`
  }
}
