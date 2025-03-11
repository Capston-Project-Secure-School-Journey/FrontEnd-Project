<script lang="ts" setup>
import { SCHOOL_TYPE } from "~/constants/school";
import { AdminSchoolStore } from "~/stores/admin/school";
import type { AdminSchoolCommonEntity } from "~/entities/admin/school";
import { ADMIN_ROUTE } from "~/constants/route";
import type { QueryParamEntity, SnackbarProp } from "~/entities/common";
import CopyBlock from "~/components/common/CopyBlock.vue";
import { PASSWORD_REGEX } from "~/constants/regex-common";
import {
  PAGE_LIMIT_DEFAULT,
  PAGE_SIZE_OPTIONS,
  SNACKBAR_INFO_STATUS,
  SORT_DIRECTION,
} from "~/constants/common";

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
const isSucceed = computed(() => adminSchoolStore.isSucceed);
const metaData = computed(() => adminSchoolStore.metaData);
const selectedSchool = ref<AdminSchoolCommonEntity[]>([]);

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

const showDialog = ref<boolean>(false);
const currentSchool = ref<string>("");
const adminPassword = ref<string>("");
const showPass = ref<boolean>(false);
const showDialogChangePassword = (id: string) => {
  currentSchool.value = id;
  showDialog.value = true;
};
const showDialogDelete = ref<boolean>(false);

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

const copyStatus = ref<SnackbarProp>({
  status: SNACKBAR_INFO_STATUS,
  message: "",
  color: "#FFFFFF",
  display: false,
});

const copyToClipboard = (data: SnackbarProp) => {
  copyStatus.value = data;
};

const deleteListSchool = async () => {
  if (selectedSchool.value.length > 0) {
    await adminSchoolStore.deleteListSchool(selectedSchool.value);

    if (!isLoading.value && isSucceed.value) {
      showDialogDelete.value = false;
      await adminSchoolStore.getListSchool(queryParamEntity.value);
      selectedSchool.value = [];
    }
  }
};

watch(
  () => queryParamEntity.value,
  async (newQueryParamEntity) => {
    await adminSchoolStore.getListSchool(newQueryParamEntity);
  },
  { deep: true }
);
onMounted(async () => {
  await adminSchoolStore.getListSchool(queryParamEntity.value);
});
</script>
<template>
  <v-container class="w-100 d-flex ga-2 flex-column">
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
        show-select
        item-value="id"
        v-model="selectedSchool"
        :loading="isLoading as boolean"
        :headers="headers"
        :items="schools"
        :items-per-page="queryParamEntity.limit"
      >
        <template v-slot:top>
          <div class="pa-2 d-flex justify-start">
            <v-btn
              text="Xoá"
              :disabled="selectedSchool.length === 0"
              color="error"
              :onclick="() => (showDialogDelete = true)"
            ></v-btn>
          </div>
        </template>

        <template v-slot:loading>
          <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
        </template>

        <template v-slot:item.id="{ item }">
          <CopyBlock :text="item.id" @on-display="copyToClipboard" />
        </template>

        <template v-slot:item.actions="{ item }">
          <div class="d-flex ga-2">
            <div @click="showDialogChangePassword(item.id)">
              <v-icon v-tooltip="'Đổi mật khẩu'">mdi-lock</v-icon>
            </div>
            <a :href="`${ADMIN_ROUTE.SCHOOLS}/${item.id}`">
              <v-icon v-tooltip="'Xem chi tiết'">mdi-arrow-right</v-icon>
            </a>
          </div>
        </template>
        <template v-slot:bottom>
          <v-row class="text-center d-flex flex-row pt-2 justify-end pa-2">
            <v-col class="ga-2">
              <v-select
                label="Hiển thị"
                class="w-25"
                :items="PAGE_SIZE_OPTIONS"
                v-model="queryParamEntity.limit"
              ></v-select>
            </v-col>
            <v-col>
              <v-pagination
                v-model="queryParamEntity.page"
                class="w-100"
                :length="Math.ceil(metaData.total / queryParamEntity.limit)"
              >
              </v-pagination>
            </v-col>
          </v-row>
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
              @click:append-inner="showPass = !showPass"
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

    <v-dialog v-model="showDialogDelete" max-width="500">
      <v-card
        title="Xác nhận thao tác"
        subtitle="Bạn có muốn xoá Trường học này chứ này chứ?"
      >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="Xoá" :onclick="deleteListSchool"></v-btn>
          <v-btn text="Huỷ" :onclick="() => (showDialogDelete = false)"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      id="copySuccess"
      v-model="copyStatus.display"
      :color="copyStatus.color"
      :location="'top right'"
    >
      {{ copyStatus.message }}
      <template v-slot:actions>
        <v-btn
          color="primary"
          variant="text"
          @click="copyStatus.display = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
