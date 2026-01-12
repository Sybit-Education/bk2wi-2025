<script setup lang="ts">
import TreeInfoList from '../components/treeinfo/TreeInfoList.vue'
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1>Baumarten</h1>
      <p class="mt-5 text-xl text-gray-600 max-w-fit">
        Entdecken Sie die Vielfalt unserer regionalen Bäume und erfahren Sie mehr über ihre Arten.
      </p>
    </div>

    <TreeInfoList />
    <div class="mt-4 flex flex-col w-fit">
      <RouterLink to="/map" class="text-green-700 hover:underline">Zur Kartenansicht</RouterLink>
    </div>
  </div>
</template>
