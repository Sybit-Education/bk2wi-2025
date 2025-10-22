<template>
  <div class="map rounded-lg shadow-lg overflow-hidden">
    <l-map
      ref="map"
      v-model:zoom="zoom"
      :center="center"
      class="map"
      crs="EPSG:4326"
      :min-zoom="12"
      :max-zoom="18"
      :bounds="bounds"
      :max-bounds="maxBounds"
      :use-global-leaflet="true"
      :options="mapOptions"
      @ready="mapLoaded"
    >
      <l-control-layers ref="control" position="bottomright"></l-control-layers>
      <l-tile-layer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        layer-type="base"
        name="Satellite"
        attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
      ></l-tile-layer>

      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      ></l-tile-layer>

      <!-- Marker für jeden Standort -->
      <l-marker
        v-for="location in locations"
        :key="location.id"
        :lat-lng="location.latLang"
        @click="selectLocation(location)"
      >
        <l-icon
          :icon-url="'/tree-marker.png'"
          :icon-size="[32, 32]"
          :icon-anchor="[16, 32]"
        ></l-icon>
        <l-popup>
          <div>
            <h3 class="font-bold">{{ location.name }}</h3>
            <p v-if="location.description">{{ location.description }}</p>
            <p v-if="location.address">{{ location.address }}</p>
          </div>
        </l-popup>
      </l-marker>
    </l-map>

    <!-- Loading-Indikator für Standorte -->
    <div v-if="isLoadingLocations" class="pins-loading-indicator">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Lade Standorte...</span>
      </div>
      <div class="mt-2">Lade Standorte...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeMount, shallowRef, onBeforeUnmount, onMounted } from 'vue'

import L, { latLngBounds, type LatLngExpression, type Marker } from 'leaflet'
import { LMap, LControlLayers, LTileLayer, LMarker, LPopup, LIcon } from '@vue-leaflet/vue-leaflet'
import { LocationService } from '@/services/locationService'
import type { Location } from '@/models/location'

const zoom = ref(12.5)
// Define a center point for the map (important to prevent the error)
const center = ref<LatLngExpression>([47.73980909820898, 8.970851784462777])

const bounds = shallowRef(
  latLngBounds([
    [47.797502793976825, 8.900488931092678],
    [47.7228286935113, 9.059525095436436],
  ]),
)
const maxBounds = shallowRef(
  latLngBounds([
    [47.8, 8.9],
    [47.7, 9.159],
  ]),
)
const isLoadingMap = ref(true)
const mapInitialized = ref(false)

const mapOptions = ref({
  zoomSnap: 0.5,
  scrollWheelZoom: true,
  touchZoom: true,
  wheelPxPerZoomLevel: 60,
  preferCanvas: true, // Verwende Canvas-Renderer für bessere Performance
  renderer: L.canvas({
    padding: 0.5,
    tolerance: 5, // Erhöhte Toleranz für bessere Performance
  }) as unknown,
  // Reduziere die Anzahl der Neuberechnungen während des Zoomens/Verschiebens
  zoomAnimation: false,
  markerZoomAnimation: false,
  // Deaktiviere Animationen auf mobilen Geräten für bessere Performance
  fadeAnimation: !('ontouchstart' in window),
  // Reduziere die Anzahl der Neuberechnungen während des Zoomens
  updateWhenZooming: false,
  updateWhenIdle: true,
})
// Definiere einen Typ für die Leaflet-Map mit leafletObject
interface LeafletMapRef {
  leafletObject?: {
    options: {
      trackResize: boolean
      renderer: unknown
      zoomSnap: number
      wheelPxPerZoomLevel: number
    }
    _container?: {
      style: {
        transform: string
        willChange: string
        backfaceVisibility: string
      }
    }
    on: (event: string, callback: () => void) => void
    getZoom: () => number
  }
}

const map = ref<LeafletMapRef>({})

// Standorte
const locationService = new LocationService()
const locations = ref<Location[]>([])
const isLoadingLocations = ref(false)
const selectedLocation = ref<Location | null>(null)

// Lade Standorte
const loadLocations = async () => {
  isLoadingLocations.value = true
  try {
    const response = await locationService.getAllLocations(100, 0)
    locations.value = response.list
  } catch (error) {
    console.error('Fehler beim Laden der Standorte:', error)
  } finally {
    isLoadingLocations.value = false
  }
}

// Wähle einen Standort aus
const selectLocation = (location: Location) => {
  selectedLocation.value = location
  // Hier könnten weitere Aktionen ausgeführt werden, z.B. Emits an übergeordnete Komponenten
}

// Sofort mit dem Laden der Karte beginnen
onBeforeMount(() => {
  // Karte ist sofort bereit (mapReady ist bereits true)
  isLoadingMap.value = false

  // Ensure center is set before map initialization
  if (!center.value) {
    // Default center point if none is provided
    center.value = [-2.8245583, 8.6110247]
  }
})

// Lade Standorte, wenn die Komponente gemountet wird
onMounted(() => {
  loadLocations()
})

// Verwende eine debounced Funktion für mapLoaded mit defineAsyncComponent für bessere Performance
const mapLoaded = () => {
  mapInitialized.value = true

  // Karte sofort als geladen markieren
  isLoadingMap.value = false

  // Optimiere die Leaflet-Karte für bessere Performance
  if (map.value?.leafletObject) {
    // Set the center and zoom explicitly to ensure the map is properly initialized
    const leafletMap = map.value.leafletObject
    if (!leafletMap._loaded) {
      leafletMap.setView(center.value, zoom.value)
    }
    // Deaktiviere automatisches Zoomen während des Ladens
    map.value.leafletObject.options.trackResize = false

    // Reduziere die Anzahl der Neuberechnungen
    map.value.leafletObject.options.renderer = L.canvas({
      padding: 0.5,
      tolerance: 5, // Erhöhte Toleranz für bessere Performance
    }) as unknown

    // Aktiviere Hardwarebeschleunigung, wenn verfügbar
    if (map.value.leafletObject._container) {
      map.value.leafletObject._container.style.transform = 'translateZ(0)'

      // Optimiere DOM-Rendering
      map.value.leafletObject._container.style.willChange = 'transform'
      map.value.leafletObject._container.style.backfaceVisibility = 'hidden'
    }

    // Optimiere Leaflet-Events
    map.value.leafletObject.options.zoomSnap = 0.5
    map.value.leafletObject.options.wheelPxPerZoomLevel = 60
  }
}

// Computed-Wert für den aktuellen Zoom-Level
const currentZoom = ref(5)

// Überwache Zoom-Änderungen für bedingte Rendering-Optimierungen
// Verwende ein debounced Zoom-Event für bessere Performance
let zoomTimeout: number | null = null

watch(
  () => map.value?.leafletObject,
  (newMap) => {
    if (newMap) {
      newMap.on('zoomend', () => {
        // Debounce Zoom-Events
        if (zoomTimeout) {
          clearTimeout(zoomTimeout)
        }

        zoomTimeout = window.setTimeout(() => {
          currentZoom.value = newMap.getZoom()
        }, 100)
      })
    }
  },
  { immediate: true },
)

// Bereinige Timeouts beim Unmount
onBeforeUnmount(() => {
  if (zoomTimeout) {
    clearTimeout(zoomTimeout)
  }

  if (updateMaxBoundsTimeout.value) {
    clearTimeout(updateMaxBoundsTimeout.value)
  }
})

// Optimierte Funktion zum Aktualisieren der Kartengrenzen mit Debouncing
const updateMaxBoundsTimeout = ref<number | null>(null)
</script>

<style lang="scss">
@import 'leaflet/dist/leaflet.css';

.leaflet-top {
  top: calc(5rem + env(safe-area-inset-top));
}
.leaflet-left {
  left: env(safe-area-inset-left);
}
.leaflet-right {
  right: env(safe-area-inset-right);
}
.leaflet-bottom {
  bottom: env(safe-area-inset-bottom);
}
.leaflet-control-attribution {
  max-width: calc(100vw - 8.5rem);
  font-size: 0.75rem;
}

/* Optimierte CSS-Transformationen für bessere Performance */
.leaflet-marker-icon {
  will-change: transform; /* Hinweis für den Browser, dass sich diese Eigenschaft ändern wird */
  transform: translate3d(0, 0, 0); /* Aktiviere Hardware-Beschleunigung */
  backface-visibility: hidden; /* Verhindere Rendering-Probleme */
  perspective: 1000; /* Verbessere 3D-Rendering */

  &:hover {
    transform: scale(1.5) translate3d(0, 0, 0);
    filter: drop-shadow(0px 0px 10px rgba(210, 28, 28, 0.75));
  }
}

.marker-selected {
  transform: scale(1.25) translate3d(0, 0, 0);
  filter: drop-shadow(0px 0px 4px rgb(178, 14, 14));
}

.marker-selected:hover {
  transform: scale(1.5) translate3d(0, 0, 0);
  filter: drop-shadow(0px 0px 10px rgba(210, 28, 28, 0.75));
}

.marker-state-planned {
  filter: grayscale(90%) opacity(0.5);
}
.marker-state-under-construction {
  filter: grayscale(80%) opacity(0.9);
}
.marker-state-finished {
  filter: opacity(1);
}

.map {
  width: 100%;
  height: 100%;
  /* Aktiviere Hardware-Beschleunigung für die Karte */
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
}

.map-skeleton {
  width: 100%;
  height: 100vh;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-skeleton-content {
  text-align: center;
}

.map-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.pins-loading-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 255, 255, 0.8);
  padding: 15px;
  border-radius: 8px;
  z-index: 1000;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Optimiere Leaflet-Container für bessere Performance */
.leaflet-container {
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
}

/* Reduziere Animationskosten */
.leaflet-fade-anim .leaflet-tile,
.leaflet-fade-anim .leaflet-popup {
  will-change: opacity;
}
.leaflet-zoom-anim .leaflet-zoom-animated {
  will-change: transform;
}
</style>
