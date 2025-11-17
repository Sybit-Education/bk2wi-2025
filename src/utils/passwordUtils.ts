import bcrypt from 'bcryptjs'

/**
 * Verschlüsselt ein Passwort mit bcrypt
 * @param password Das zu verschlüsselnde Passwort
 * @returns Das verschlüsselte Passwort
 */
export async function hashPassword(password: string): Promise<string> {
  // Generiere einen Salt mit Faktor 12 (guter Kompromiss zwischen Sicherheit und Performance)
  const salt = await bcrypt.genSalt(12)
  // Verschlüssele das Passwort mit dem Salt
  return bcrypt.hash(password, salt)
}

/**
 * Überprüft, ob ein Passwort mit einem Hash übereinstimmt
 * @param password Das zu überprüfende Passwort
 * @param hash Der Hash, mit dem das Passwort verglichen werden soll
 * @returns true, wenn das Passwort mit dem Hash übereinstimmt, sonst false
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
