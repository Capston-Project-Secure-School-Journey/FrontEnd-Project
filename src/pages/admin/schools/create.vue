<script setup lang="ts">
import SchoolForm from "~/components/admin/SchoolForm.vue";
import { MODE_FORM_CREATE } from "~/constants/common";

const pageName: string = "Tạo mới trường học";

definePageMeta({
  layout: "admin",
  middleware: "auth-admin",
  name: pageName,
});
</script>
<template>
  <v-container class="h-100 pa-2">
    <SchoolForm :mode="MODE_FORM_CREATE" />
  </v-container>
</template>
