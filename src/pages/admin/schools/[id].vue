<script setup lang="ts">
import { AdminSchoolStore } from "~/stores/admin/school";
import { MODE_FORM_UPDATE } from "~/constants/common";
import SchoolForm from "~/components/admin/SchoolForm.vue";
import type { AdminSchoolEntity } from "~/entities/admin/school";
import { ADMIN_ROUTE } from "~/constants/route";

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
const isSucceed = computed(() => adminSchoolStore.isSucceed);
const school = computed(() => adminSchoolStore.school);
const updateStatus = ref<boolean>(false);
const display = ref<boolean>(false);

const submit = async (data: AdminSchoolEntity) => {
  updateStatus.value = false;
  await adminSchoolStore.updateSchool(schoolId, data);

  if (!isLoading.value && isSucceed.value) {
    updateStatus.value = true;
  }
};

const deleteSchool = async () => {
  if (schoolId) {
    await adminSchoolStore.deleteSchool(schoolId);

    if (!isLoading.value && isSucceed.value) {
      navigateTo(ADMIN_ROUTE.SCHOOLS);
    }
  }
};

onMounted(async () => {
  await adminSchoolStore.getDetailSchool(schoolId);
});
</script>
<template>
  <v-container>
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
    <SchoolForm
      v-if="!isLoading && school"
      :mode="MODE_FORM_UPDATE"
      :school="school"
      @submit="submit"
      @delete="() => (display = true)"
    />

    <v-dialog v-model="display" max-width="500">
      <v-card
        title="Xác nhận thao tác"
        subtitle="Bạn có muốn xoá Trường học này chứ này chứ?"
      >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="Xoá" @click="deleteSchool"></v-btn>
          <v-btn text="Huỷ" @click="display = false"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
