<script setup lang="ts">
import { TeacherSchoolStore } from "~/stores/school/teacher";
import TeacherForm from "~/components/school/TeacherForm.vue";
import { MODE_FORM_UPDATE } from "~/constants/common";
import type { TeacherEntity } from "~/entities/school/teacher";
import { SCHOOL_ROUTE } from "~/constants/route";

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
const display = ref<boolean>(false);

const submit = async (data: TeacherEntity) => {
  await teacherSchoolStore.updateTeacher(teacherId, data);

  if (!isLoading.value && isSucceed.value) {
    updateStatus.value = true;
  }
};

const deleteTeacher = async () => {
  if (teacherId) {
    await teacherSchoolStore.deleteTeacher(teacherId);

    if (!isLoading.value && isSucceed.value) {
      navigateTo(SCHOOL_ROUTE.TEACHERS);
    }
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
      @delete="() => (display = true)"
    />

    <v-snackbar
      id="updateSuccessTeacherForm"
      v-model="updateStatus"
      :location="'top right'"
    >
      Cập nhật dữ liệu thành công
      <template v-slot:actions>
        <v-btn color="pink" variant="text" @click="updateStatus = false">
          Đóng
        </v-btn>
      </template>
    </v-snackbar>

    <v-dialog v-model="display" max-width="500">
      <v-card
        title="Xác nhận thao tác"
        subtitle="Bạn có muốn xoá Giáo viên này chứ?"
      >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="Xoá" @click="deleteTeacher"></v-btn>
          <v-btn text="Huỷ" @click="display = false"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
