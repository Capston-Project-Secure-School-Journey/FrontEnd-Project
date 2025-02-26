<script setup lang="ts">
import { MODE_FORM_CREATE } from "~/constants/common";
import ClassForm from "~/components/school/ClassForm.vue";
import { ClassSchoolStore } from "~/stores/school/class";
const pageName = "Tạo mới Lớp học";

definePageMeta({
  layout: "school",
  middleware: "auth-school",
  name: pageName,
});

const classSchoolStore = ClassSchoolStore();
const grades = computed(() => classSchoolStore.grades);

onMounted(async () => {
  await classSchoolStore.getGradeList();
});
</script>
<template>
  <v-container class="h-100 pa-2">
    <ClassForm
      v-if="grades.length > 0"
      :mode="MODE_FORM_CREATE"
      :grades="grades"
    />
  </v-container>
</template>
