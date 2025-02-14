<script lang="ts" setup>
const pageName = "Trang chủ";

definePageMeta({
  layout: "school",
  middleware: "auth-school",
  name: pageName,
});
</script>
<template>
  <div>{{ pageName }}</div>
</template>
