<script lang="ts" setup>
import {
  GENDER_NAME,
  PAGE_LIMIT_DEFAULT,
  SORT_DIRECTION,
} from "~/constants/common";
import { SCHOOL_ROUTE } from "~/constants/route";
import type { QueryParamEntity } from "~/entities/common";
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
const metaData = computed(() => teacherSchoolStore.metaData);

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

const goToDetail = (id: string) => {
  navigateTo(`${SCHOOL_ROUTE.TEACHERS}/${id}`);
};

watch(
  () => queryParamEntity.value.page,
  async (newPage) => {
    queryParamEntity.value.page = newPage;
    await teacherSchoolStore.getTeacherList(queryParamEntity.value);
  }
);

onMounted(async () => {
  await teacherSchoolStore.getTeacherList(queryParamEntity.value);
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
        :onclick="() => navigateTo(SCHOOL_ROUTE.CREATE_TEACHER)"
      >
        Tạo mới
      </v-btn>
    </div>
    <v-card class="w-100">
      <v-data-table
        class="w-100"
        :headers="headers"
        :loading="isLoading as boolean"
        :items="teachers"
        :items-per-page="queryParamEntity.limit"
      >
        <template v-slot:item.actions="{ item }">
          <div @click="goToDetail(item.id)">
            <v-icon v-tooltip="'Xem chi tiết'">mdi-arrow-right</v-icon>
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
  </v-container>
</template>
