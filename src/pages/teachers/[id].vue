<script setup lang="ts">
import { TeacherSchoolStore } from "~/stores/school/teacher";
import TeacherForm from "~/components/school/TeacherForm.vue";
import { MODE_FORM_UPDATE } from "~/constants/common";
import type { TeacherEntity } from "~/entities/school/teacher";

const pageName: string = "Thông tin chi tiết Giáo viên";

definePageMeta({
  layout: "school",
  middleware: "auth-school",
  name: pageName,
});

const teacherSchoolStore = TeacherSchoolStore();
const teacher = computed(() => teacherSchoolStore.teacher);
const isLoading = computed(() => teacherSchoolStore.isLoading);
const isSucceed = computed(() => teacherSchoolStore.isSucceed);
const route = useRoute();
const teacherId = route.params.id;
const updateStatus = ref<boolean>(false);

const submit = async (data: TeacherEntity) => {
  await teacherSchoolStore.updateTeacher(teacherId, data);

  if (!isLoading.value && isSucceed.value) {
    updateStatus.value = true;
  }
};

onMounted(async () => {
  await teacherSchoolStore.getDetailTeacher(teacherId);
});
</script>
<template>
  <v-container class="w-100">
    <TeacherForm
      v-if="!isLoading && teacher"
      :mode="MODE_FORM_UPDATE"
      :teacher="teacher"
      @submit="submit"
    />
    <v-snackbar
      id="updateSuccessForm"
      v-model="updateStatus as boolean"
      :location="'top right'"
    >
      Cập nhật dữ liệu thành công
      <template v-slot:actions>
        <v-btn color="pink" variant="text" @click="updateStatus = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
