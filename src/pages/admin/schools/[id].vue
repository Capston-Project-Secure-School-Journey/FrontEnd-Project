<script setup lang="ts">
import { AdminSchoolStore } from "~/stores/admin/school";
import { MODE_FORM_CREATE, MODE_FORM_UPDATE } from "~/constants/common";
import SchoolForm from "~/components/admin/SchoolForm.vue";

const pageName: string = "Thông tin chi tiết trường học";

definePageMeta({
  layout: "admin",
  middleware: "auth-admin",
  name: pageName,
});

const adminSchoolStore = AdminSchoolStore();
const route = useRoute();
const schoolId = route.params.id;
const errors = computed(() => adminSchoolStore.errors);
const isLoading = computed(() => adminSchoolStore.isLoading);
const school = computed(() => adminSchoolStore.school);
onMounted(async () => {
  await adminSchoolStore.getDetailSchool(schoolId);
});
</script>
<template>
  <v-container>
    <SchoolForm
      v-if="!isLoading && school"
      :mode="MODE_FORM_UPDATE"
      :school="school"
    />
  </v-container>
</template>
