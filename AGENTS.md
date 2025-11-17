# Anweisungen zur Erstellung einer modernen Vue 3 Anwendung

## Technologie-Stack

Erstelle eine moderne Single-Page-Application mit folgenden Technologien:

- **Vue 3** (Version 3.4+) mit Composition API
- **TypeScript** (Version 5.3+)
- **Vite** als Build-Tool
- **Vue Router** (Version 4.2+) für das Routing
- **Pinia** (Version 2.1+) für State Management
- **Glowbite-vue** für das Styling und Komponenten
- **NocoDB** als Backend-Persistenzlösung
- **Vitest** für Unit-Tests
- **Cypress** für E2E-Tests
- **ESLint** und **Prettier** für Code-Qualität

## Projektstruktur

Folge dem Feature-basierten Ansatz mit klarer Trennung der Verantwortlichkeiten:

```
src/
├── assets/              # Statische Assets (Bilder, Fonts, etc.)
├── components/          # Wiederverwendbare UI-Komponenten
│   ├── common/          # Allgemeine Komponenten (Button, Input, etc.)
│   └── features/        # Feature-spezifische Komponenten
├── composables/         # Wiederverwendbare Composition Functions
├── config/              # Konfigurationsdateien
├── models/              # Datenmodelle
├── router/              # Router-Konfiguration
├── services/            # Service-Layer für API-Kommunikation
├── stores/              # Pinia Stores
├── types/               # Globale TypeScript-Typdefinitionen
├── utils/               # Hilfsfunktionen
└── views/               # Haupt-Views der Anwendung
```

## Service-Layer

Implementiere eine klare Trennung zwischen UI und Datenquellen durch eine dedizierte Service-Schicht:

1. **API-Service**: Zentrale Konfiguration für HTTP-Requests mit Axios oder Fetch API
2. **NocoDB-Service**: Spezifische Implementierung für die NocoDB-Integration
3. **Domain-Services**: Fachliche Services, die die Business-Logik kapseln
4. **Repository-Pattern**: Implementiere ein Repository-Pattern für den Datenzugriff

## Sicherheitsrichtlinien

- Implementiere JWT-basierte Authentifizierung
- Nutze HTTPS für alle API-Kommunikation
- Validiere alle Benutzereingaben sowohl im Frontend als auch im Backend
- Implementiere CSRF-Schutz
- Setze sichere HTTP-Header (Content-Security-Policy, X-XSS-Protection, etc.)
- Vermeide die Speicherung sensibler Daten im localStorage/sessionStorage
- Nutze Umgebungsvariablen für sensible Konfigurationen

## Architekturprinzipien

1. **Composition API**: Nutze die Composition API für alle Komponenten
2. **TypeScript**: Verwende strikte Typisierung für alle Komponenten und Services
3. **Dependency Injection**: Implementiere ein einfaches DI-System für Services
4. **Single Responsibility**: Jede Komponente und jeder Service hat eine klare, einzelne Verantwortung
5. **Testbarkeit**: Schreibe Code, der leicht zu testen ist
6. **Lazy Loading**: Implementiere Lazy Loading für Routes und Komponenten
7. **Atomic Design**: Folge dem Atomic Design-Prinzip für UI-Komponenten

## NocoDB-Integration

1. Erstelle einen dedizierten NocoDB-Service, der die API-Kommunikation kapselt
2. Implementiere Modelle, die den Tabellen in NocoDB entsprechen
3. Nutze TypeScript-Interfaces für die Typsicherheit
4. Implementiere Caching-Strategien für häufig abgefragte Daten
5. Behandle Offline-Szenarien durch lokale Speicherung und Synchronisierung

## Routing

1. Implementiere verschachtelte Routes mit Vue Router 4
2. Nutze Route Guards für geschützte Bereiche
3. Implementiere Meta-Informationen für Routes (Titel, Berechtigungen, etc.)
4. Nutze dynamische Route-Imports für Code-Splitting

## State Management

1. Nutze Pinia für globalen State
2. Strukturiere Stores nach Features
3. Implementiere Persistenz für ausgewählte Stores
4. Nutze TypeScript für typsichere Stores

## UI/UX-Richtlinien

1. Implementiere ein responsives Design mit TailwindCSS 4
2. Erstelle wiederverwendbare UI-Komponenten
3. Nutze CSS-Variablen für ein konsistentes Theming
4. Implementiere Barrierefreiheit nach WCAG 2.1 AA-Standard
5. Optimiere für Performance (Code-Splitting, Lazy Loading, etc.)

## Testing-Strategie

1. Schreibe Unit-Tests für Services und Composables mit Vitest
2. Implementiere Komponententests für kritische UI-Komponenten
3. Erstelle E2E-Tests für kritische Benutzerflows mit Cypress
4. Nutze Mock-Services für Tests, die externe Abhängigkeiten haben

## Deployment und CI/CD

1. Konfiguriere GitHub Actions oder GitLab CI für automatisierte Tests und Deployments
2. Implementiere verschiedene Umgebungen (Development, Staging, Production)
3. Nutze Docker für konsistente Entwicklungs- und Produktionsumgebungen
4. Implementiere automatische Versionierung

## Best Practices

1. Folge dem Vue Style Guide (Priority A und B)
2. Nutze ESLint und Prettier für konsistenten Code-Stil
3. Dokumentiere komplexe Komponenten und Services
4. Implementiere Error Boundaries für robuste Fehlerbehandlung
5. Nutze Performance-Optimierungen wie `v-once`, `v-memo` und `shallowRef` wo sinnvoll
6. Implementiere Internationalisierung von Anfang an
7. Nutze moderne JavaScript-Features (Optional Chaining, Nullish Coalescing, etc.)

## Initiale Setup-Schritte

1. Erstelle ein neues Projekt mit Vue CLI oder Vite
2. Konfiguriere TypeScript mit strikten Optionen
3. Installiere und konfiguriere flowbite-vue
4. Richte Vue Router und Pinia ein
5. Konfiguriere ESLint und Prettier
6. Erstelle die grundlegende Projektstruktur
7. Implementiere die Service-Layer für NocoDB
8. Erstelle Basis-Komponenten und Layouts
9. Implementiere die Authentifizierung
10. Richte das Testing-Framework ein
