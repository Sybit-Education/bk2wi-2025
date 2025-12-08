<script setup lang="ts">
import TreeInfoList from '../components/TreeInfoList.vue'
</script>
<style>

          .button{
          background: linear-gradient(145deg, #228B22, #96da17);
          border: 3px solid #b3e662b2;
          color: white;
          font-size: 16px;
          margin: 600px;
          padding: 12px 27px;
          border-radius: 30px;
          cursor: pointer;
          transition: all 0.3s ease;
          }


      </style>
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

        <a href="/more-info" class="button">
          Zu weiteren Infos!
        </a>

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
