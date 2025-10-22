<template>
  <div class="map rounded-lg shadow-lg overflow-hidden">
    <l-map
      ref="map"
      v-model:zoom="zoom"
      :center="center"
      class="map"
      crs="EPSG:4326"
      :min-zoom="11"
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

      <!-- Radolfzell Grenzen (zuerst laden, damit sie unter den Markern liegen) -->
      <l-geo-json
        v-if="radolfzellBoundary"
        :geojson="radolfzellBoundary"
        :options="radolfzellStyle"
      ></l-geo-json>

      <!-- Marker für jeden Standort (nach dem Polygon laden, damit sie darüber liegen) -->
      <l-marker
        v-for="location in locations"
        :key="location.id"
        :lat-lng="location.latLang"
        @click="selectLocation(location)"
      >
        <l-icon
          :icon-url="'/tree-marker.svg'"
          :icon-size="[24, 24]"
          :icon-anchor="[12, 24]"
        ></l-icon>
        <l-popup>
          <div>
            <h3 class="font-bold">{{ location.name }}</h3>
          </div>
        </l-popup>
      </l-marker>
    </l-map>

    <!-- Loading-Indikator für Standorte mit Flowbite -->
    <div v-if="isLoadingLocations" class="pins-loading-indicator">
      <FwbSpinner size="10" color="green" />
      <div class="mt-2">Lade Standorte...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeMount, shallowRef, onBeforeUnmount, onMounted } from 'vue'

import L, { latLngBounds, type PointTuple } from 'leaflet'
import {
  LMap,
  LControlLayers,
  LTileLayer,
  LMarker,
  LPopup,
  LIcon,
  LGeoJson,
} from '@vue-leaflet/vue-leaflet'
import { LocationService } from '@/services/locationService'
import type { Location } from '@/models/location'
import { FwbSpinner } from 'flowbite-vue'

const zoom = ref(12.5)
// Define a center point for the map (important to prevent the error)
const center = ref<PointTuple>([47.73980909820898, 8.970851784462777])

const bounds = shallowRef(
  latLngBounds([
    [47.732, 8.906],
    [47.814, 8.969],
  ]),
)
const maxBounds = shallowRef(
  latLngBounds([
    [47.71, 8.9],
    [47.87, 9.1],
  ]),
)

const mapInitialized = ref(false)
const radolfzellBoundary = ref<GeoJSON.FeatureCollection | null>(null)

const mapOptions = ref({
  zoomSnap: 0.5,
  scrollWheelZoom: true,
  touchZoom: true,
  wheelPxPerZoomLevel: 60,
  preferCanvas: true, // Verwende Canvas-Renderer für bessere Performance
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

// Style für das Radolfzell-Polygon
const radolfzellStyle = {
  // Invertierter Masken-Effekt für Bereiche außerhalb von Radolfzell
  onEachFeature: function (feature: any, layer: any) {
    // Erstelle eine invertierte Maske, die alles außerhalb des Polygons abdunkelt
    const bounds = layer.getBounds()
    const outerBounds = L.latLngBounds(
      L.latLng(bounds.getSouth() - 1, bounds.getWest() - 1),
      L.latLng(bounds.getNorth() + 1, bounds.getEast() + 1),
    )

    // Erstelle ein Rechteck, das die gesamte Karte abdeckt
    const outerRect = L.rectangle(outerBounds, {
      color: 'transparent',
      fillColor: '#000',
      weight: 0,
      fillOpacity: 0.2,
      interactive: false,
    })

    // Füge das Rechteck zur Karte hinzu
    if (map.value?.leafletObject) {
      outerRect.addTo(map.value.leafletObject)

      // Verwende das Polygon als "Loch" im Rechteck
      if (layer.toGeoJSON) {
        const geoJson = layer.toGeoJSON()
        if (geoJson.geometry && geoJson.geometry.coordinates) {
          outerRect.setStyle({
            color: '#ffcc00',
            weight: 2,
            fillColor: '#fff',
            fillOpacity: 0.1,
            fillRule: 'evenodd',
            clipPath: `polygon(100% 0, 0 0, 0 100%, 100% 100%)`,
          })
        }
      }
    }
  },
}

// Lade Radolfzell GeoJSON
const loadRadolfzellBoundary = async () => {
  try {
    const response = await fetch('/radolfzell.geojson')
    radolfzellBoundary.value = await response.json()
  } catch (error) {
    console.error('Fehler beim Laden der Radolfzell-Grenzen:', error)
  }
}

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
  // Ensure center is set before map initialization
  if (!center.value) {
    // Default center point if none is provided
    center.value = [-2.8245583, 8.6110247]
  }
})

// Lade Standorte, wenn die Komponente gemountet wird
onMounted(() => {
  loadLocations()
  loadRadolfzellBoundary()
})

// Verwende eine debounced Funktion für mapLoaded mit defineAsyncComponent für bessere Performance
const mapLoaded = () => {
  mapInitialized.value = true
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

        zoomTimeout = globalThis.window.setTimeout(() => {
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
    filter: drop-shadow(0px 0px 10px rgba(85, 43, 222, 0.852));
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

/* Stil für die Radolfzell-Grenzen */
.radolfzell-boundary {
  fill-rule: evenodd;
}

/* Stil für den abgedunkelten Bereich außerhalb von Radolfzell */
.outside-boundary {
  fill: #000;
  fill-opacity: 0.35;
  pointer-events: none;
}
</style>
