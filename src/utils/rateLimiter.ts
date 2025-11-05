/**
 * Einfacher Rate Limiter für Login-Versuche
 * Begrenzt die Anzahl der Login-Versuche pro IP-Adresse/Benutzer
 */

interface RateLimitEntry {
  count: number;
  timestamp: number;
}

export class RateLimiter {
  private static attempts: Map<string, RateLimitEntry> = new Map();
  private static readonly MAX_ATTEMPTS = 5; // Maximale Anzahl von Versuchen
  private static readonly WINDOW_MS = 15 * 60 * 1000; // 15 Minuten Zeitfenster

  /**
   * Prüft, ob ein weiterer Versuch erlaubt ist
   * @param key Eindeutiger Schlüssel (z.B. E-Mail oder IP)
   * @returns true, wenn der Versuch erlaubt ist, sonst false
   */
  static isAllowed(key: string): boolean {
    const now = Date.now();
    const entry = this.attempts.get(key);

    // Wenn kein Eintrag existiert oder das Zeitfenster abgelaufen ist
    if (!entry || now - entry.timestamp > this.WINDOW_MS) {
      this.attempts.set(key, { count: 1, timestamp: now });
      return true;
    }

    // Wenn die maximale Anzahl von Versuchen erreicht ist
    if (entry.count >= this.MAX_ATTEMPTS) {
      return false;
    }

    // Inkrementiere den Zähler
    entry.count++;
    this.attempts.set(key, entry);
    return true;
  }

  /**
   * Gibt die verbleibende Zeit bis zum Reset des Rate Limiters zurück
   * @param key Eindeutiger Schlüssel
   * @returns Verbleibende Zeit in Millisekunden oder 0, wenn kein Rate Limit aktiv ist
   */
  static getTimeRemaining(key: string): number {
    const entry = this.attempts.get(key);
    if (!entry || entry.count < this.MAX_ATTEMPTS) {
      return 0;
    }

    const now = Date.now();
    const timeElapsed = now - entry.timestamp;
    const timeRemaining = Math.max(0, this.WINDOW_MS - timeElapsed);
    return timeRemaining;
  }

  /**
   * Setzt den Rate Limiter für einen Schlüssel zurück
   * @param key Eindeutiger Schlüssel
   */
  static reset(key: string): void {
    this.attempts.delete(key);
  }
}
