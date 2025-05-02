<script setup lang="ts">
definePageMeta({
  name: "School Security and Safety in Transportation",
});

const { requestPermission } = useFirebaseMessaging();

onMounted(() => {
  requestPermission();
});
</script>
<template>
  <NuxtLayout>
    <v-app>
      <v-navigation-drawer />
      <NuxtPage />
    </v-app>
  </NuxtLayout>
</template>
