# Theming & Dark Mode Dokumentation

Diese Dokumentation beschreibt, wie das Theme-System in diesem Projekt funktioniert und wie Sie es anpassen können.

## Übersicht

Das Projekt verwendet **Tailwind CSS 4** mit **Flowbite** für ein flexibles Theme-System, das folgende Features bietet:

- **Light Mode** (Standard)
- **Dark Mode** (manuell oder automatisch basierend auf System-Einstellung)
- **Anpassbare Farbpaletten** über CSS-Variablen
- **Persistente Benutzer-Präferenzen** via localStorage

## Dark Mode verwenden

### In Komponenten

Der Dark Mode wird durch die CSS-Klasse `dark` auf dem `<html>`-Element gesteuert. Verwenden Sie Tailwind's `dark:`-Präfix für Dark Mode-spezifische Styles:

```html
<div class="bg-white dark:bg-gray-800">
  <h1 class="text-gray-900 dark:text-white">Überschrift</h1>
  <p class="text-gray-600 dark:text-gray-300">Text</p>
</div>
```

### Theme Toggle verwenden

Die `ThemeToggle`-Komponente kann überall eingebunden werden:

```vue
<script setup>
import ThemeToggle from '@/components/common/ThemeToggle.vue'
</script>

<template>
  <!-- Einfacher Toggle-Button -->
  <ThemeToggle />

  <!-- Mit Dropdown für alle Modi (Light, Dark, System) -->
  <ThemeToggle show-dropdown />
</template>
```

### useTheme Composable

Für programmatische Kontrolle über das Theme:

```vue
<script setup>
import { useTheme } from '@/composables/useTheme'

const { isDark, mode, toggle, setMode } = useTheme()

// Theme wechseln
toggle()

// Spezifisches Theme setzen
setMode('dark') // Immer dunkel
setMode('light') // Immer hell
setMode('system') // System-Präferenz folgen
</script>
```

## Farben anpassen

Die Farbpaletten sind in `src/assets/main.css` als CSS-Variablen definiert:

```css
@theme {
  /* Primary Color Palette */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  /* ... weitere Abstufungen ... */

  /* Success, Warning, Danger Paletten ebenfalls anpassbar */
}
```

### Eigene Markenfarben verwenden

Um Ihre Markenfarben zu verwenden, ersetzen Sie die `--color-primary-*` Werte:

```css
@theme {
  /* Beispiel: Grüne Markenfarbe */
  --color-primary-50: #f0fdf4;
  --color-primary-100: #dcfce7;
  --color-primary-200: #bbf7d0;
  --color-primary-300: #86efac;
  --color-primary-400: #4ade80;
  --color-primary-500: #22c55e;
  --color-primary-600: #16a34a;
  --color-primary-700: #15803d;
  --color-primary-800: #166534;
  --color-primary-900: #14532d;
  --color-primary-950: #052e16;
}
```

### Farbpalette generieren

Verwenden Sie Tools wie:

- [Tailwind CSS Color Generator](https://uicolors.app/create)
- [Flowbite Color Generator](https://flowbite.com/tools/tailwind-color-generator/)

## Schriftarten anpassen

Die Schriftarten sind ebenfalls als Variablen definiert:

```css
@theme {
  --font-sans: 'Inter', 'ui-sans-serif', /* ... */;
  --font-body: 'Inter', 'ui-sans-serif', /* ... */;
  --font-mono: 'ui-monospace', 'SFMono-Regular', /* ... */;
}
```

## Flowbite-Vue Komponenten mit Theme

Flowbite-Vue Komponenten unterstützen Dark Mode automatisch. Sie können auch explizite Themes setzen:

```vue
<template>
  <fwb-tooltip theme="light">...</fwb-tooltip>
  <fwb-tooltip theme="dark">...</fwb-tooltip>
</template>
```

Für ein konsistentes Theming mehrerer Komponenten:

```vue
<template>
  <flowbite-themable :theme="'blue'">
    <fwb-button>Blauer Button</fwb-button>
    <fwb-dropdown>...</fwb-dropdown>
  </flowbite-themable>
</template>

<script setup>
import { FlowbiteThemable, FwbButton, FwbDropdown } from 'flowbite-vue'
</script>
```

## Dateistruktur

```
src/
├── assets/
│   └── main.scss          # Theme-Variablen & CSS
├── components/
│   └── common/
│       └── ThemeToggle.vue # Toggle-Komponente
├── composables/
│   └── useTheme.ts        # Theme Composable
└── stores/
    └── themeStore.ts      # Pinia Store für Theme
```

## Theme Modi

| Mode     | Beschreibung                               |
| -------- | ------------------------------------------ |
| `light`  | Immer heller Modus                         |
| `dark`   | Immer dunkler Modus                        |
| `system` | Folgt der System-Einstellung des Benutzers |

## Best Practices

1. **Konsistenz**: Verwenden Sie immer `dark:`-Varianten, wenn Sie Light Mode-Styles definieren
2. **Kontrast**: Stellen Sie sicher, dass Text im Dark Mode gut lesbar ist (WCAG 2.1 AA)
3. **Bilder**: Verwenden Sie `dark:invert` für Icons oder bieten Sie alternative Bilder an
4. **Formulare**: Flowbite-Komponenten sind bereits für Dark Mode optimiert
5. **Testing**: Testen Sie beide Modi während der Entwicklung

## Troubleshooting

### Styles werden nicht aktualisiert

- Stellen Sie sicher, dass die `dark`-Klasse auf `<html>` ist (nicht auf `<body>`)
- Leeren Sie den Browser-Cache

### Flash of Unstyled Content (FOUC)

Das Inline-Script in `index.html` sollte dies verhindern. Falls nicht, prüfen Sie:

```html
<script>
  if (
    localStorage.getItem('theme-mode') === 'dark' ||
    (!('theme-mode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add('dark')
  }
</script>
```

### VSCode zeigt CSS-Fehler

Die `@plugin`, `@source`, `@theme`, und `@custom-variant` Direktiven sind Tailwind CSS 4-spezifisch. Der Vite-Build verarbeitet diese korrekt, auch wenn der Editor sie als Fehler markiert.
