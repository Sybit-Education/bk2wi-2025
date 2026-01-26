<template>
  <div style="height: 600px; width: 100%">
    <div v-if="errorMessage" class="text-red-500">{{ errorMessage }}</div>
    <l-map
      ref="map"
      v-model:zoom="zoom"
      :center="centerPoint"
      :use-global-leaflet="false"
      @click="onMapClick"
    >
      <l-tile-layer
        :url="tileProvider.url"
        :attribution="tileProvider.attribution"
      />

      <l-marker
        v-if="position.lat !== undefined && position.lng !== undefined"
        draggable
        :lat-lng="{ lat: position.lat, lng: position.lng }"
        @dragstart="dragging = true"
        @dragend="onDragEnd"
      >
        <l-tooltip :options="{ permanent: true }">
          <div v-html="tooltipContent"></div>
        </l-tooltip>
      </l-marker>
    </l-map>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LTooltip } from "@vue-leaflet/vue-leaflet";
import L from "leaflet";

// --- Types ---
interface LatLng {
  lat: number;
  lng: number;
}

// Simplified emit to only send the position
const props = defineProps<{
  modelValue: LatLng;
  defaultLocation?: LatLng;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: LatLng): void;
}>();

// --- State ---
const zoom = ref(14);
const dragging = ref(false);
const userLocation = ref<Partial<LatLng>>({});
const errorMessage = ref<string | null>(null);

// Initialize position from props
const position = ref<Partial<LatLng>>(props.modelValue || {});

const tileProvider = {
  attribution: '&copy; OpenStreetMap contributors',
  url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
};

// --- Computed ---
const centerPoint = computed(() => {
  return [
    position.value.lat || userLocation.value.lat || props.defaultLocation?.lat || 47.744364,
    position.value.lng || userLocation.value.lng || props.defaultLocation?.lng || 8.966348
  ] as [number, number];
});

const tooltipContent = computed(() => {
  if (dragging.value) return "Release to set";
  return `<strong>Lat:</strong> ${position.value.lat?.toFixed(6)}<br/>
          <strong>Lng:</strong> ${position.value.lng?.toFixed(6)}`;
});

// --- Methods ---

// Changed to single click
const onMapClick = (event: L.LeafletMouseEvent) => {
  if (zoom.value < 15) {
    errorMessage.value = "Please zoom in closer to select a location.";
    return;
  } else {
    errorMessage.value = null;
    position.value = {
      lat: event.latlng.lat,
      lng: event.latlng.lng
    };
  }
};

const onDragEnd = (event: L.DragEndEvent) => {
  dragging.value = false;
  const newPos = (event.target as L.Marker).getLatLng();
  position.value = { lat: newPos.lat, lng: newPos.lng };
};

const getUserPosition = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      userLocation.value = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      };
    });
  }
};

// --- Watchers ---
watch(position, (newPos) => {
  if (newPos.lat !== undefined && newPos.lng !== undefined) {
    emit('update:modelValue', newPos as LatLng);
  }
}, { deep: true });

onMounted(() => {
  getUserPosition();

  // Leaflet Marker Icon Fix
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
});
</script>
