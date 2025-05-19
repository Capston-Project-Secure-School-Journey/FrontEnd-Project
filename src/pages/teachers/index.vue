<script lang="ts" setup>
import {
  GENDER_NAME,
  PAGE_LIMIT_DEFAULT,
  SORT_DIRECTION,
  PAGE_SIZE_OPTIONS,
  SNACKBAR_INFO_STATUS,
} from "~/constants/common";
import { SCHOOL_ROUTE } from "~/constants/route";
import CopyBlock from "~/components/common/CopyBlock.vue";
import { type SnackbarProp, type QueryParamEntity } from "~/entities/common";
import type { TeacherCommonEntity } from "~/entities/school/teacher";
import { TeacherSchoolStore } from "~/stores/school/teacher";

const pageName = "Quản lý Giáo viên";

definePageMeta({
  layout: "school",
  middleware: "auth-school",
  name: pageName,
});

const teacherSchoolStore = TeacherSchoolStore();
const teachers = computed(() => teacherSchoolStore.teachers);
const errors = computed(() => teacherSchoolStore.errors);
const isLoading = computed(() => teacherSchoolStore.isLoading);
const isSucceed = computed(() => teacherSchoolStore.isSucceed);
const metaData = computed(() => teacherSchoolStore.metaData);
const selectedTeacher = ref<TeacherCommonEntity[]>([]);
const showDialogDelete = ref<boolean>(false);
const queryParamEntity = ref<QueryParamEntity>({
  page: 1,
  limit: PAGE_LIMIT_DEFAULT,
  direction: SORT_DIRECTION.ASC,
  sortBy: "name",
});

const headers = [
  {
    title: "Mã",
    key: "id",
    value: "id",
  },
  {
    title: "Họ và Tên",
    key: "name",
    value: (item: TeacherCommonEntity) => `${item.firstName} ${item.lastName}`,
  },
  {
    title: "Giới tính",
    key: "gender",
    value: (item: TeacherCommonEntity) =>
      GENDER_NAME[item.gender as keyof typeof GENDER_NAME],
  },
  {
    title: "Email",
    key: "email",
    value: "email",
  },
  {
    title: "Số điện thoại",
    key: "phoneNumber",
    value: "phoneNumber",
  },
  { title: "Chi tiết", key: "actions" },
];

const copyStatus = ref<SnackbarProp>({
  status: SNACKBAR_INFO_STATUS,
  message: "",
  color: "#FFFFFF",
  display: false,
});

const copyToClipboard = (data: SnackbarProp) => {
  copyStatus.value = data;
};

const deleteListTeacher = async () => {
  if (selectedTeacher.value.length > 0) {
    await teacherSchoolStore.deleteListTeacher(selectedTeacher.value);

    if (!isLoading.value && isSucceed.value) {
      showDialogDelete.value = false;
      await teacherSchoolStore.getTeacherList(queryParamEntity.value);
      selectedTeacher.value = [];
    }
  }
};

watch(
  () => queryParamEntity.value,
  async (newQueryParamEntity) => {
    await teacherSchoolStore.getTeacherList(newQueryParamEntity);
  },
  { deep: true }
);

onMounted(async () => {
  await teacherSchoolStore.getTeacherList(queryParamEntity.value);
});
</script>
<template>
  <v-container fluid class="w-100 d-flex ga-2 flex-column">
    <div class="w-100 d-flex justify-space-between">
      <h2>
        {{ pageName }}
      </h2>
      <v-btn
        class="btn-primary"
        :onclick="() => navigateTo(SCHOOL_ROUTE.CREATE_TEACHER)"
      >
        Tạo mới
      </v-btn>
    </div>
    <v-card class="w-100">
      <v-data-table
        show-select
        v-model="selectedTeacher"
        class="w-100"
        :headers="headers"
        :loading="isLoading as boolean"
        :items="teachers"
        :items-per-page="queryParamEntity.limit"
      >
        <template v-slot:top>
          <div class="pa-2 d-flex justify-start">
            <v-btn
              text="Xoá"
              :disabled="selectedTeacher.length === 0"
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
          <a :href="`${SCHOOL_ROUTE.TEACHERS}/${item.id}`">
            <v-icon v-tooltip="'Xem chi tiết'">mdi-arrow-right</v-icon>
          </a>
        </template>
        <template v-slot:bottom>
          <div class="text-center d-flex flex-row pt-2 justify-end pa-2">
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
          </div>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="showDialogDelete" max-width="500">
      <v-card
        title="Xác nhận thao tác"
        subtitle="Bạn có muốn xoá Giáo viên này chứ này chứ?"
      >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="Xoá" :onclick="deleteListTeacher"></v-btn>
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
