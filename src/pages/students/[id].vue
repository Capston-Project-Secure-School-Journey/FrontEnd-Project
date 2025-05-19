<script setup lang="ts">
import StudentForm from "~/components/school/StudentForm.vue";
import { MODE_FORM_UPDATE } from "~/constants/common";
import { SCHOOL_ROUTE } from "~/constants/route";
import type { StudentEntity } from "~/entities/school/student";
import { StudentSchoolStore } from "~/stores/school/student";

const pageName: string = "Thông tin chi tiết Học sinh";

definePageMeta({
  layout: "school",
  middleware: "auth-school",
  name: pageName,
});
const route = useRoute();
const studentId = route.params.id;
const studentSchoolStore = StudentSchoolStore();
const isLoading = computed(() => studentSchoolStore.isLoading);
const isSucceed = computed(() => studentSchoolStore.isSucceed);
const student = computed(() => studentSchoolStore.student);
const updateStatus = ref<boolean>(false);
const display = ref<boolean>(false);

const submit = async (data: StudentEntity) => {
  updateStatus.value = false;

  await studentSchoolStore.updateStudent(studentId, data);

  if (!isLoading.value && isSucceed.value) {
    updateStatus.value = true;
  }
};

const deleteStudent = async () => {
  if (studentId) {
    await studentSchoolStore.deleteStudent(studentId);

    if (!isLoading.value && isSucceed.value) {
      navigateTo(SCHOOL_ROUTE.STUDENTS);
    }
  }
};

onMounted(async () => {
  await studentSchoolStore.getDetailStudent(studentId);
});
</script>
<template>
  <v-container fluid>
    <v-snackbar
      id="updateSuccessForm"
      v-model="updateStatus"
      :location="'top right'"
    >
      Cập nhật dữ liệu thành công
      <template v-slot:actions>
        <v-btn color="pink" variant="text" @click="updateStatus = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <div class="d-flex ga-2 align-center">
      <div class="h-100" @click="navigateTo(SCHOOL_ROUTE.STUDENTS)">
        <v-icon>mdi-arrow-left</v-icon>
      </div>
      <v-card-title>Chỉnh sửa học sinh</v-card-title>
    </div>
    <StudentForm
      v-if="!isLoading && student"
      :mode="MODE_FORM_UPDATE"
      :student="student"
      @submit="submit"
      @delete="() => (display = true)"
    />

    <v-dialog v-model="display" max-width="500">
      <v-card
        title="Xác nhận thao tác"
        subtitle="Bạn có muốn xoá học sinh này chứ?"
      >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="Xoá" @click="deleteStudent"></v-btn>
          <v-btn text="Huỷ" @click="display = false"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
