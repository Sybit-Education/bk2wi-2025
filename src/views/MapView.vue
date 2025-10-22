<script setup lang="ts">
import LocationMap from '../components/map/LocationMap.vue'
</script>

<template>
  <div class="map-view container mx-auto px-4 py-8">
    <h1>Kartenansicht</h1>
    <LocationMap />
  </div>
</template>

<style scoped>
.map-view {
  height: 100vh;
  width: 100%;
}
</style>
