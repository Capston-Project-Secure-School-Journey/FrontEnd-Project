<script lang="ts" setup>
import { PAGE_LIMIT_DEFAULT, SORT_DIRECTION } from "~/constants/common";
import { SCHOOL_ROUTE } from "~/constants/route";
import type { QueryParamEntity } from "~/entities/common";
import { ClassSchoolStore } from "~/stores/school/class";

const pageName = "Quản lý lớp học";

definePageMeta({
  layout: "school",
  middleware: "auth-school",
  name: pageName,
});

const classSchoolStore = ClassSchoolStore();
const isLoading = computed(() => classSchoolStore.isLoading);
const classes = computed(() => classSchoolStore.classes);
const metaData = computed(() => classSchoolStore.metaData);

const queryParamEntity = ref<QueryParamEntity>({
  page: 1,
  limit: PAGE_LIMIT_DEFAULT,
  direction: SORT_DIRECTION.ASC,
  sortBy: "name",
});

const headers = [
  { title: "Mã", key: "id", value: "id" },
  { title: "Lớp", key: "className", value: "className" },
  { title: "Khối", key: "grade", value: "grade" },
  { title: "Số lượng", key: "numberOfStudent", value: "numberOfStudent" },
  { title: "Chi tiết", key: "actions" },
];

const goToDetail = (id: string) => {
  navigateTo(`${SCHOOL_ROUTE.CLASSES}/${id}`);
};

watch(
  () => queryParamEntity.value.page,
  async (newPage) => {
    queryParamEntity.value.page = newPage;
    await classSchoolStore.getListClass(queryParamEntity.value);
  }
);

onMounted(async () => {
  await classSchoolStore.getListClass(queryParamEntity.value);
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
        :onclick="() => navigateTo(SCHOOL_ROUTE.CREATE_CLASS)"
      >
        Tạo mới
      </v-btn>
    </div>
    <v-card class="w-100">
      <v-data-table
        class="w-100"
        :loading="isLoading as boolean"
        :headers="headers"
        :items="classes"
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
              :length="Math.ceil(metaData.total / PAGE_LIMIT_DEFAULT)"
            ></v-pagination>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
