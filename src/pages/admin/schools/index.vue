<script lang="ts" setup>
import Toast from "~/components/common/Toast.vue";
import { SCHOOL_TYPE } from "~/constants/school";
import { AdminSchoolStore } from "~/stores/admin/school";
import type { AdminSchoolCommonEntity } from "~/entities/admin/school";
import { ADMIN_ROUTE } from "~/constants/route";

const pageName: string = "Danh sách trường học";

definePageMeta({
  layout: "admin",
  middleware: "auth-admin",
  name: pageName,
});

const adminSchoolStore = AdminSchoolStore();
const errors = computed(() => adminSchoolStore.errors);
const isLoading = computed(() => adminSchoolStore.isLoading);

const headers = [
  { title: "Mã", key: "id", value: "id" },
  { title: "Tên", key: "name", value: "name" },
  {
    title: "Loại",
    key: "school_type",
    value: (item: AdminSchoolCommonEntity) =>
      SCHOOL_TYPE[item.schooltype as keyof typeof SCHOOL_TYPE],
  },
  { title: "Email", key: "email", value: "email" },
  { title: "Điện thoại", key: "phone", value: "phonenumber" },
  { title: "Chi tiết", key: "actions" },
];

onMounted(async () => {
  await adminSchoolStore.getListSchool({});
  console.log();
});

const goToDetail = (id: string) => {
  navigateTo(`${ADMIN_ROUTE.SCHOOLS}/${id}`);
};
</script>
<template>
  <v-container class="w-100 d-flex ga-2 flex-column">
    <Toast :display="!!errors.message" :message="errors.message" />
    <div class="w-100 d-flex justify-space-between">
      <h2>
        {{ pageName }}
      </h2>
      <v-btn :onclick="() => navigateTo(ADMIN_ROUTE.SCHOOLS_CREATE)">
        Tạo mới
      </v-btn>
    </div>
    <v-card class="w-100">
      <v-data-table
        class="w-100"
        :loading="isLoading as boolean"
        :headers="headers"
        :items="adminSchoolStore.schools"
      >
        <template v-slot:item.actions="{ item }">
          <div @click="goToDetail(item.id)">
            <v-icon>mdi-arrow-right</v-icon>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
