# Codeanalyse und Refactoring

Stand: 20.10.2026. Ziel: Vue-Anfaenger sollen kleine Aufgaben bearbeiten koennen,
ohne zuerst Datenbanktechnik und Authentifizierung verstehen zu muessen.

## Umfang

Untersucht wurden Einstieg und Routing, die Baumartenliste mit ihren Karten,
der zugehoerige Datenzugriff, ein Partner-Listenbeispiel, Auth-Store und JWT-Service
sowie Projektkonfiguration und Dokumentation. Dies ist kein vollstaendiges Audit
der Kartenfunktion, aller Formulare oder der separaten Middleware.

Die bestehenden Seiten und Datenvertraege bleiben erhalten. Kein Wechsel der
Vue-API, kein neues State-Management und kein Austausch der UI-Bibliothek.

## Befunde nach Prioritaet

### 1. Authentifizierung nicht als Produktionsvorlage verwenden

[jwtService.ts](../src/services/jwtService.ts) erzeugt Tokens im Browser mit
einer simulierten Signatur. `verifyToken` dekodiert sie und prueft die Ablaufzeit,
aber keine kryptografische Signatur. Der [Auth-Store](../src/stores/authStore.ts)
speichert Access- und Refresh-Tokens im `localStorage`.

Ausserdem wird der NocoDB-API-Key aus einer `VITE_`-Variablen an den
[API-Client](../src/services/apiClient.ts) uebergeben und ist dadurch im Browser
sichtbar. Das ist keine geeignete Aufbewahrung fuer privilegierte Zugangsdaten.
Die technische Authentifizierung darf nicht mit serverseitiger Autorisierung
verwechselt werden.

**Entscheidung:** In diesem Refactoring nicht veraendert. Die README benennt die
Grenzen jetzt ausdruecklich. Vor einem Produktionseinsatz muessen echte Anmeldung,
Berechtigungspruefung und Geheimnisse serverseitig abgesichert werden.

### 2. Listenlogik und Darstellung waren vermischt

[TreeInfoList.vue](../src/components/treeinfo/TreeInfoList.vue) enthielt sowohl
HTTP-nahe Ablaufsteuerung als auch Ladeanzeige, Fehlerdarstellung, Liste und
Seitennavigation. Zum Gestalten der Liste musste man an dieser Logik vorbeilesen.
Die Seitenzahl wurde separat gespeichert, obwohl sie sich aus Anzahl und
Seitengroesse ergibt. Ein Klick auf die aktive Seite lud die Daten erneut.

**Umgesetzt:** [useTreeList.ts](../src/composables/useTreeList.ts) verwaltet den
lokalen Zustand und die Aktionen. Die Listenkomponente verwendet diese Werte im
unveraenderten Template. `totalPages` wird mit `computed` berechnet und der Klick
auf die aktive Seite startet keinen weiteren Abruf. Jede Listeninstanz hat ihren
eigenen Zustand; ein globaler Pinia-Store ist hier nicht erforderlich.

Die Komponente wurde nicht in weitere kleine Wrapper aufgeteilt. Der vorhandene
[Listeneintrag](../src/components/treeinfo/TreeInfoListItem.vue) trennt bereits die
einzelne Baumkarte ueber die typisierte Prop `tree` von der Liste.

### 3. Technische Konfiguration lag in der Fachlogik

Die Tabellen-ID stand direkt im Konstruktor von
[TreeInfoService](../src/services/treeInfoService.ts).

**Umgesetzt:** Die Baumarten-Tabelle wird in
[src/config/nocodb.ts](../src/config/nocodb.ts) konfiguriert. Die bisherige ID und
das Verhalten des Services bleiben gleich. Andere Tabellen sind in diesem ersten
Schritt noch nicht umgezogen. URL und API-Key kommen weiterhin aus der vorhandenen
Umgebungskonfiguration.

### 4. Es fehlte ein Lernpfad

Die README war ueberwiegend eine englische Projektvorlage mit pauschalen
Sicherheitsversprechen. Sie erklaerte weder die konkrete Anwendung noch eine erste
Aenderung oder die Trennung zwischen Fachlogik und technischer Infrastruktur.

**Umgesetzt:** Die [README](../README.md) erklaert Start, Konfiguration, Datenfluss,
Vue-Grundbegriffe, eine erste Uebung und Pruefbefehle auf Deutsch. Das Muster fuer
die ersten Aufgaben lautet: Seite, Liste, Baumkarte, Composable, Datenmodell.

### 5. Refactoring war nicht durch automatisierte Tests abgesichert

Es gab kein Testskript und keinen ausfuehrbaren Vue-Testaufbau.

**Umgesetzt:** Vitest, Vue Test Utils und jsdom pruefen die echte Listenkomponente
einschliesslich der Baumkarten. Nur `TreeInfoService.getAllTrees` wird durch
kontrollierte Antworten ersetzt, damit kein Backend benoetigt wird.
Die Testdateien werden auch von `npm run type-check` erfasst.

Die [Tests](../src/components/treeinfo/__tests__/TreeInfoList.spec.ts) decken ab:

- Ladeanzeige bis zur Antwort und anschliessende Darstellung des Baums.
- Leere Ergebnisse ohne Seitennavigation.
- Verstaendliche Fehlermeldung bei gescheitertem Abruf.
- Genau eine Seite ohne unnoetige Seitennavigation.
- Folgeseite mit korrektem Offset und deaktiviertem Weiter-Button am Ende.
- Rueckkehr zur ersten Seite.
- Kein erneuter Abruf beim Klick auf die aktive Seite.

Der letzte Test schlug vor der Aenderung fehl: zwei Abrufe statt einem.
Nach dem Refactoring bestanden alle sieben Tests.

## Bewusst nicht umgebaut

Die vorhandene Folge `TreeInfoService -> NocoDBService -> ApiClient` bleibt
bestehen. Sie kapselt tatsaechliche Aufgaben: Fachzugriffe, Feldnamenumwandlung
und HTTP-Kommunikation. Eine weitere generische Repository- oder
Dependency-Injection-Schicht wuerde den Lernaufwand derzeit vergroessern.

Der API-Client importiert beim Token-Refresh den Auth-Store dynamisch, um einen
Abhaengigkeitskreis zu umgehen. Das sollte zusammen mit echter serverseitiger
Authentifizierung ueberarbeitet werden, nicht nebenbei beim Umbau der Baumliste.

## Pruefung und verbleibende Grenzen

Die Aenderung wird mit `npm test`, `npm run type-check`, `npm run build`,
ESLint fuer die geaenderten Code-Dateien und Prettier fuer die geaenderten Dateien
geprueft. Ein Komponententest ersetzt keinen End-to-End-Test gegen ein echtes
Backend. Authentifizierung, echte Zugangsdaten und Datenbankberechtigungen sind
nicht durch diese Tests verifiziert.

Bei der Installation der Testwerkzeuge meldete npm 36 Sicherheitsluecken im
gesamten Abhaengigkeitsbaum. Die zunaechst auftretenden Engine-Warnungen zu `nopt`
und `abbrev` wurden durch Fixieren von Vue Test Utils auf Version `2.4.6` vermieden.
Tests und Projekt bleiben mit der vorhandenen Node.js-Vorgabe kompatibel.
Ein pauschales `npm audit fix --force` wurde nicht ausgefuehrt;
Abhaengigkeitsupdates benoetigen einen getrennten Durchgang.

## Sinnvolle naechste Schritte

1. Die erste Uebung mit Schuelern durchgehen und unklare Begriffe sammeln.
2. Das Listenmuster bei Bedarf auf Partner und Sponsoren uebertragen, ohne einen
   universellen Listenbaukasten einzufuehren.
3. Authentifizierung und privilegierte Datenzugriffe zusammen mit der Middleware
   gesondert absichern, bevor reale Nutzerdaten verwendet werden.
4. Danach Karte und Pflanzformular jeweils als eigenes Lern- und Testthema angehen.
