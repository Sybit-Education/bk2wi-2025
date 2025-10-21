<script setup lang="ts">
import LocationMap from '../components/map/LocationMap.vue'
</script>

<template>
  <div class="map-view">
    <h1 class="sr-only">Kartenansicht</h1>
    <LocationMap />
  </div>
</template>

<style scoped>
.map-view {
  height: 100vh;
  width: 100%;
}
</style>
