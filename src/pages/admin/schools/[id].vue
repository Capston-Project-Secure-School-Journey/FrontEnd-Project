<script setup lang="ts">
import { AdminSchoolStore } from "~/stores/admin/school";

const pageName: string = "Thông tin chi tiết trường học";

definePageMeta({
  layout: "admin",
  middleware: "auth-admin",
  name: pageName,
});

const adminSchoolStore = AdminSchoolStore();
const errors = computed(() => adminSchoolStore.errors);
const isLoading = computed(() => adminSchoolStore.isLoading);

onMounted(async () => {});
</script>
<template>
  <v-container> aaaaa </v-container>
</template>
