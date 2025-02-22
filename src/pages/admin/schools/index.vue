<script lang="ts" setup>
import { SCHOOL_TYPE } from "~/constants/school";
import { AdminSchoolStore } from "~/stores/admin/school";
import type { AdminSchoolCommonEntity } from "~/entities/admin/school";
import { ADMIN_ROUTE } from "~/constants/route";
import type { QueryParamEntity } from "~/entities/common";
import { PAGE_LIMIT_DEFAULT, SORT_DIRECTION } from "~/constants/common";
import { PASSWORD_REGEX } from "~/constants/regex-comon";
import { meta } from "eslint-plugin-vue";

const pageName: string = "Danh sách trường học";

definePageMeta({
  layout: "admin",
  middleware: "auth-admin",
  name: pageName,
});

const adminSchoolStore = AdminSchoolStore();
const schools = computed(() => adminSchoolStore.schools ?? []);
const errors = computed(() => adminSchoolStore.errors);
const isLoading = computed(() => adminSchoolStore.isLoading);
const metaData = computed(() => adminSchoolStore.metaData);

const queryParamEntity = ref<QueryParamEntity>({
  page: 1,
  limit: PAGE_LIMIT_DEFAULT,
  direction: SORT_DIRECTION.ASC,
  sortBy: "name",
});

const headers = [
  { title: "Mã", key: "id", value: "id" },
  { title: "Tên", key: "name", value: "schoolName" },
  {
    title: "Loại",
    key: "schoolType",
    value: (item: AdminSchoolCommonEntity) =>
      SCHOOL_TYPE[item.schoolType as keyof typeof SCHOOL_TYPE],
  },
  { title: "Email", key: "email", value: "email" },
  { title: "Điện thoại", key: "phone", value: "phoneNumber" },
  { title: "Chi tiết", key: "actions" },
];

const goToDetail = (id: string) => {
  navigateTo(`${ADMIN_ROUTE.SCHOOLS}/${id}`);
};

const showDialog = ref<boolean>(false);
const currentSchool = ref<string>("");
const adminPassword = ref<string>("");
const showPass = ref<boolean>(false);
const showDialogChangePassword = (id: string) => {
  currentSchool.value = id;
  showDialog.value = true;
};

const handleChangePassword = async () => {
  if (
    currentSchool.value &&
    adminPassword.value &&
    PASSWORD_REGEX.test(adminPassword.value)
  ) {
    const form = new FormData();
    form.append("newPassword", adminPassword.value);

    await adminSchoolStore.updateSchoolAdminPassword(currentSchool.value, form);
  }
};

watch(
  () => queryParamEntity.value.page,
  async (newPage) => {
    queryParamEntity.value.page = newPage;
    await adminSchoolStore.getListSchool(queryParamEntity.value);
  }
);
onMounted(async () => {
  await adminSchoolStore.getListSchool(queryParamEntity.value);
});
</script>
<template>
  <v-container class="w-100 d-flex ga-2 flex-column">
    <!-- <Toast :display="!!errors.message" :message="errors.message" /> -->
    <div class="w-100 d-flex justify-space-between">
      <h2>
        {{ pageName }}
      </h2>
      <v-btn
        class="btn-primary"
        :onclick="() => navigateTo(ADMIN_ROUTE.SCHOOLS_CREATE)"
      >
        Tạo mới
      </v-btn>
    </div>
    <v-card class="w-100">
      <v-data-table
        class="w-100"
        :loading="isLoading as boolean"
        :headers="headers"
        :items="schools"
        :items-per-page="queryParamEntity.limit"
      >
        <template v-slot:item.actions="{ item }">
          <div class="d-flex ga-2">
            <div @click="showDialogChangePassword(item.id)">
              <v-icon v-tooltip="'Đổi mật khẩu'">mdi-lock</v-icon>
            </div>
            <div @click="goToDetail(item.id)">
              <v-icon v-tooltip="'Xem chi tiết'">mdi-arrow-right</v-icon>
            </div>
          </div>
        </template>
        <template v-slot:bottom>
          <div class="text-center pt-2">
            <v-pagination
              v-model="queryParamEntity.page"
              :length="Math.ceil(metaData.total / metaData.pageSize)"
            ></v-pagination>
          </div>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="showDialog" width="500">
      <template v-slot:default="{ isActive }">
        <v-card title="Đổi mật khẩu" class="pa-2 bg-white">
          <v-divider></v-divider>
          <v-card-text class="px-4">
            <v-text-field
              label="Mật khẩu (Bắt buộc)"
              :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPass ? 'text' : 'password'"
              v-model="adminPassword"
              name="adminPassword"
              hint="Mật khẩu từ 8 kí tự trở lên, kết hợp số và ký hiệu."
              :rules="[
                (value) =>
                  PASSWORD_REGEX.test(value) ||
                  'Mật khẩu từ 8 kí tự trở lên, kết hợp số và ký hiệu.',
              ]"
              @click:append="showPass = !showPass"
            />
          </v-card-text>
          <v-card-actions>
            <v-btn text="Close" @click="isActive.value = false"></v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text="Lưu"
              @click="handleChangePassword"
            ></v-btn>
          </v-card-actions>
        </v-card>
        <v-divider></v-divider>
      </template>
    </v-dialog>
  </v-container>
</template>
