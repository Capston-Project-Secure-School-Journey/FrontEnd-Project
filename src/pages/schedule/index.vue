<script lang="ts" setup>
const pageName = "Quản lý Lịch học";

definePageMeta({
  layout: "school",
  middleware: "auth-school",
  name: pageName,
});
</script>
<template>
  <div>{{ pageName }}</div>
</template>
