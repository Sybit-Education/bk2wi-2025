<script setup lang="ts">
import TreeInfoList from '../components/TreeInfoList.vue'
</script>

<template>
  <main>
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Baumbestand</h1>
        <p class="mt-2 text-gray-600">
          Übersicht aller registrierten Bäume mit Informationen zu Art, Standort und Gesundheitszustand.
        </p>
      </div>
      
      <TreeInfoList />
    </div>
  </main>
</template>
