<script lang="ts" setup>
import CopyBlock from "~/components/common/CopyBlock.vue";
import {
  PAGE_LIMIT_DEFAULT,
  SORT_DIRECTION,
  PAGE_SIZE_OPTIONS,
} from "~/constants/common";
import { SCHOOL_ROUTE } from "~/constants/route";
import type { QueryParamEntity } from "~/entities/common";
import type { ClassCommonEntity } from "~/entities/school/class";
import { ClassSchoolStore } from "~/stores/school/class";
import { SchoolMetaDataStore } from "~/stores/school/metadata";

const pageName = "Quản lý lớp học";

definePageMeta({
  layout: "school",
  middleware: "auth-school",
  name: pageName,
});

const classSchoolStore = ClassSchoolStore();
const schoolMetaDataStore = SchoolMetaDataStore();
const isLoading = computed(() => classSchoolStore.isLoading);
const classes = computed(() => classSchoolStore.classes);
const metaData = computed(() => classSchoolStore.metaData);
const grades = computed(() => schoolMetaDataStore.grades);

const copyStatus = ref<{
  status: boolean;
  message: string;
}>({ status: false, message: "" });

const queryParamEntity = ref<QueryParamEntity>({
  page: 1,
  limit: PAGE_LIMIT_DEFAULT,
  direction: SORT_DIRECTION.ASC,
  sortBy: "name",
});

const headers = [
  { title: "Mã", key: "id", value: "id" },
  { title: "Lớp", key: "className", value: "className" },
  {
    title: "Khối",
    key: "grade",
    value: (item: ClassCommonEntity) =>
      grades?.value.filter((grade) => grade.id === item.grade)[0].name,
  },
  { title: "Số lượng", key: "numberOfStudent", value: "numberOfStudent" },
  { title: "Chi tiết", key: "actions" },
];

watch(
  () => queryParamEntity.value,
  async (newQueryParamEntity) => {
    await classSchoolStore.getListClass(newQueryParamEntity);
  },
  { deep: true }
);

const copyToClipboard = (data: string) => {
  copyStatus.value = {
    status: true,
    message: data,
  };
};

onMounted(async () => {
  await schoolMetaDataStore.getDataGradeList();
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
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
        </template>

        <template v-slot:item.id="{ item }">
          <CopyBlock :text="item.id" @on-display="copyToClipboard" />
        </template>

        <template v-slot:item.actions="{ item }">
          <a :href="`${SCHOOL_ROUTE.CLASSES}/${item.id}`">
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
    <v-snackbar
      id="copySuccess"
      v-model="copyStatus.status"
      :location="'top right'"
    >
      {{ copyStatus.message }}
      <template v-slot:actions>
        <v-btn color="pink" variant="text" @click="copyStatus.status = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
