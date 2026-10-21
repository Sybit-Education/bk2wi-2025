# Wurzelpartner

Eine Vue-Anwendung rund um Baumarten, Pflanzungen und regionale Partner.
Wir verwenden Vue 3 mit Composition API, TypeScript und Vite.

## Lokal starten

Voraussetzungen: Node.js 22 (Projektvorgabe in [.nvmrc](.nvmrc)), npm und VS Code
mit der Erweiterung **Vue (Official)**.
Alle Befehle werden im Projektordner `wurzelpartner` ausgeführt.

```sh
npm ci
cp .env.local.example .env.local
npm run dev
```

Die Lehrkraft stellt die Werte für `VITE_NOCODB_API_URL` und `VITE_NOCODB_API_KEY` bereit.
Diese gehören in `.env.local` im Projektordner, nicht in `src`.
Nach einer Änderung der Konfiguration muss der Entwicklungsserver neu gestartet werden.
Die Browser-Adresse steht im Terminal, normalerweise `http://localhost:5173`.
Ohne erreichbares Backend kann die Oberfläche starten, aber keine Baumdaten laden.

**Wichtig:** Werte mit dem Präfix `VITE_` sind im Browser sichtbar. Keine administrativen
API-Schlüssel oder echten Geheimnisse verwenden und lokale Konfiguration nicht committen.
Der vorhandene Login ist kein geprüfter Sicherheitsbaustein für den Produktionseinsatz.

## Hier anfangen

Für die ersten Aufgaben reicht dieser Weg durch die Anwendung:

1. [src/views/TreeOverviewView.vue](src/views/TreeOverviewView.vue): Überschrift und Aufbau einer Seite.
2. [src/components/treeinfo/TreeInfoList.vue](src/components/treeinfo/TreeInfoList.vue): Liste,
   Ladeanzeige, Fehler und Seitennavigation.
3. [src/components/treeinfo/TreeInfoListItem.vue](src/components/treeinfo/TreeInfoListItem.vue):
   Darstellung eines einzelnen Baums. Die Daten kommen über die Prop `tree`.
4. [src/composables/useTreeList.ts](src/composables/useTreeList.ts): Daten laden und Seiten wechseln.
5. [src/models/treeInfo.ts](src/models/treeInfo.ts): Welche Eigenschaften hat ein Baum?

Eine Vue-Datei besteht aus `<script setup lang="ts">` für die Logik, `<template>` für
die Darstellung und bei Bedarf `<style scoped>` für lokale CSS-Regeln.
Vorhandene CSS-Klassen verwenden überwiegend Tailwind; die Karten stammen aus Flowbite Vue.

## Datenfluss verstehen

```text
TreeOverviewView / HomeView
  -> TreeInfoList             zeigt den aktuellen Zustand an
    -> useTreeList           lädt Daten und verwaltet die Seite
      -> TreeInfoService    kennt die fachlichen Datenzugriffe
        -> NocoDBService   übersetzt die NocoDB-Anfragen und Feldnamen
          -> ApiClient   sendet die HTTP-Anfrage
    -> TreeInfoListItem      zeigt einen Baum über die Prop "tree" an
```

`useTreeList()` ist eine normale Funktion, die Vue-Zustand und passende Aktionen bündelt.
Jede Listeninstanz erhält ihren eigenen Zustand. Zum Anzeigen eines weiteren Baumfelds
muss man die technischen Services nicht verändern.

- `ref(...)`: ein veränderlicher Wert. Im Script benutzt man `.value`, im Template nicht.
- `computed(...)`: ein berechneter Wert, zum Beispiel die Seitenzahl. Nicht zusätzlich speichern.
- `onMounted(...)`: startet das erste Laden, sobald die Komponente eingebunden ist.
- `v-for`: wiederholt eine Darstellung für die Einträge einer Liste.
- `v-if` / `v-else-if`: zeigen je nach Zustand unterschiedliche Inhalte.
- `:tree="tree"`: gibt Daten als Prop an die Kindkomponente weiter.
- `@click="goToPage(...)"`: ruft beim Klicken eine Aktion auf.

## Erste Übung

1. Ändere die Überschrift in [src/views/TreeOverviewView.vue](src/views/TreeOverviewView.vue)
   und öffne `/trees` im Browser.
2. Ergänze in [src/components/treeinfo/TreeInfoListItem.vue](src/components/treeinfo/TreeInfoListItem.vue)
   unter dem Baumnamen `<p>Baum-ID: {{ tree.id }}</p>`.
3. Erkläre, warum dafür keine Änderung am Datenzugriff nötig ist.
4. Führe `npm test` und `npm run type-check` aus.

## Wo ändere ich was?

| Aufgabe                            | Ort                                                                                          |
| ---------------------------------- | -------------------------------------------------------------------------------------------- |
| Neue Seite verknüpfen              | [src/router/index.ts](src/router/index.ts)                                                   |
| Inhalt einer Seite ändern          | [src/views](src/views)                                                                       |
| Eine Baumkarte gestalten           | [src/components/treeinfo/TreeInfoListItem.vue](src/components/treeinfo/TreeInfoListItem.vue) |
| Anzahl der Bäume pro Seite ändern  | `PAGE_SIZE` in [src/composables/useTreeList.ts](src/composables/useTreeList.ts)              |
| Baumarten-Tabelle konfigurieren    | [src/config/nocodb.ts](src/config/nocodb.ts), mit der Lehrkraft                              |
| Globale Farben und Theme verstehen | [docs/THEMING.md](docs/THEMING.md)                                                           |

## Änderungen prüfen

```sh
npm test               # Tests einmal ausführen, ohne echtes Backend
npm run test:watch     # Tests bei Änderungen erneut ausführen
npm run type-check     # TypeScript und Vue-Templates prüfen, einschließlich Tests
npm run build          # Typprüfung und Produktionsbuild
```

Die [Tests der Baumliste](src/components/treeinfo/__tests__/TreeInfoList.spec.ts) zeigen Beispiele
für Laden, leere Ergebnisse, Fehler und Blättern. Nur der Datenabruf wird ersetzt;
die Listenkomponente und ihre Baumkarten werden tatsächlich gerendert.
`npm run lint` und `npm run format` verändern Dateien automatisch und sollten bewusst benutzt werden.

Die [Codeanalyse](docs/CODEANALYSE.md) hält die Entscheidungen dieses Refactorings und offene Themen fest.
