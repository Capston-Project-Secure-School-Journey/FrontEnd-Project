<script setup lang="ts">
import TeacherForm from "~/components/school/TeacherForm.vue";
import { MODE_FORM_CREATE } from "~/constants/common";

const pageName = "Tạo mới Giáo viên";

definePageMeta({
  layout: "school",
  middleware: "auth-school",
  name: pageName,
});
</script>
<template>
  <v-container fluid class="h-100 pa-2">
    <TeacherForm :mode="MODE_FORM_CREATE" />
  </v-container>
</template>
