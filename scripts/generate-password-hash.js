import bcrypt from 'bcryptjs';

/**
 * Generiert einen Hash für ein Passwort mit bcrypt
 */
async function generatePasswordHash() {
  // Prüfen, ob ein Passwort als Argument übergeben wurde
  const password = process.argv[2];
  
  if (!password) {
    console.error('Bitte geben Sie ein Passwort als Argument an.');
    console.error('Beispiel: node generate-password-hash.js MeinPasswort123');
    process.exit(1);
  }

  try {
    // Salt generieren (Faktor 12 wie in der Anwendung)
    const salt = await bcrypt.genSalt(12);
    
    // Hash generieren
    const hash = await bcrypt.hash(password, salt);
    
    console.log('\nPasswort:', password);
    console.log('Hash:', hash);
    
    // Zur Überprüfung
    const isValid = await bcrypt.compare(password, hash);
    console.log('Validierung:', isValid ? 'Erfolgreich' : 'Fehlgeschlagen');
  } catch (error) {
    console.error('Fehler bei der Hash-Generierung:', error);
  }
}

generatePasswordHash();
