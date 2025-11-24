<script setup lang="ts">
import TreeInfoList from '../components/TreeInfoList.vue'
</script>

<template>
  <main>
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">

        <p class="mt-5 text-xl text-gray-600 max-w-3xl">
          Wir sind eine Klasse auf dem Berufsschulzentrum, die sich um die Gesellschaft und Umgebung einsetzen. Wir wollen, dass die Stadt
          Radolfzell aufgefrischt wird, indem wir eine Webseite für die Baumpartenschaft generieren und gleichzeitig einen vielfälltigen Mehrwert schaffen
          wollen!
          Entdecken Sie die Vielfalt unserer regionalen Bäume und erfahren Sie mehr über ihre Arten.
        </p>
        
        <button style="
          background: linear-gradient(145deg, #228B22, #ffe4c4);
          border: 2px solid #4e5bcd;
          color: white;
          font-size: 16px;
          padding: 12px 30px;
          border-radius: 30px;
          box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2), -2px -2px 6px rgba(255, 255, 255, 0.3);
          cursor: pointer;
          transition: all 0.3s ease;
  ">
    Hier klicken!
  </button>

        <h1 class="text-4xl font-bold text-gray-800">Baumarten</h1>

      </div>

      <h2>Baumarten</h2>
      <TreeInfoList />
      <RouterLink to="/trees" class="text-green-700 hover:underline"
        >Zur Baumartenübersicht</RouterLink
      >
    </div>
  </main>
</template>
