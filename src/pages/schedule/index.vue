<script lang="ts" setup>
const pageName = "Quản lý Lịch học";

definePageMeta({
  layout: "school",
  middleware: "auth-school",
  name: pageName,
});

const today = ref();

onMounted(() => {});
</script>
<template>
  <v-container
    ><v-calendar
      class="w-100 h-100"
      v-model="today"
      color="primary"
      type="month"
    ></v-calendar
  ></v-container>
</template>
