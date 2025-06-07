<script setup lang="ts">
import {
  PAGE_LIMIT_DEFAULT,
  PAGE_SIZE_OPTIONS,
  SORT_DIRECTION,
} from "~/constants/common";
import { SCHOOL_ROUTE } from "~/constants/route";
import { APPLICATION_STATUS_NAMES } from "~/constants/school";
import type { MetaDataEntity, QueryParamEntity } from "~/entities/common";
import type { DriverApplicationEntity } from "~/entities/school/driver";
import { SchoolDriverStore } from "~/stores/school/driver";

interface DriverApplicationTableProps {
  driverApplications?: DriverApplicationEntity[];
  status: number;
  metaData: MetaDataEntity;
}

interface ExtendQueryParamEntity extends QueryParamEntity {
  status: number;
}

const schoolDriverSchool = SchoolDriverStore();
const props = defineProps<DriverApplicationTableProps>();
const emits = defineEmits(["fetch"]);
const isLoading = computed(() => schoolDriverSchool.isLoading);
const isSucceed = computed(() => schoolDriverSchool.isSucceed);

const queryParamEntity = ref<ExtendQueryParamEntity>({
  page: 1,
  limit: PAGE_LIMIT_DEFAULT,
  direction: SORT_DIRECTION.ASC,
  sortBy: "name",
  status: props.status,
});

const headers = [
  {
    title: "Họ và tên",
    key: "driverName",
    value: "driverName",
  },
  {
    title: "Ngày",
    key: "requestedDate",
    value: (item: DriverApplicationEntity) =>
      item.requestedDate
        ? new Date(item.requestedDate).toLocaleString()
        : "N/A",
  },
  {
    title: "Trạng thái",
    key: "requestStatus",
    value: (item: DriverApplicationEntity) =>
      item.requestStatus
        ? APPLICATION_STATUS_NAMES[
            item.requestStatus as keyof typeof APPLICATION_STATUS_NAMES
          ]
        : "N/A",
    sortable: false,
  },
  {
    title: "Chấp thuận bởi",
    key: "approvedByName",
    value: "approvedByName",
  },
  { title: "Chi tiết", key: "actions", sortable: false },
];

// onMounted(() => {
//   emits("fetch", queryParamEntity.value);
// });
</script>
<template>
  <v-data-table
    class="w-100"
    :headers="headers"
    :loading="isLoading as boolean"
    :items="props.driverApplications"
    :items-per-page="queryParamEntity.limit"
  >
    <template v-slot:loading>
      <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
    </template>

    <template v-slot:item.approvedBy="{ item }">
      <v-btn size="small" pri>{{
        item.approvedBy ? item.approvedBy : "N/A"
      }}</v-btn>
    </template>

    <template v-slot:item.actions="{ item }">
      <a :href="`${SCHOOL_ROUTE.DRIVERS}/${item?.id}`">
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
            :length="
              Math.max(
                1,
                Math.ceil(
                  (metaData.total || 0) /
                    (queryParamEntity.limit || PAGE_LIMIT_DEFAULT)
                )
              )
            "
          >
          </v-pagination>
        </v-col>
      </div>
    </template>
  </v-data-table>
</template>
