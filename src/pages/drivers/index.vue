<script lang="ts" setup>
import DriverApplicationTable from "~/components/school/DriverApplicationTable.vue";
import { PAGE_LIMIT_DEFAULT, SORT_DIRECTION } from "~/constants/common";
import type { QueryParamEntity } from "~/entities/common";
import { SchoolDriverStore } from "~/stores/school/driver";

const pageName = "Quản lý Tài xế";
const defaultTab = "1";
definePageMeta({
  layout: "school",
  middleware: "auth-school",
  name: pageName,
});

document.title = pageName;

const tab = ref<string>(defaultTab);
const schoolDriverSchool = SchoolDriverStore();
const driverApplications = computed(
  () => schoolDriverSchool.driverApplications
);
const metaData = computed(() => schoolDriverSchool.metaData);
const defaultParams: QueryParamEntity = {
  page: 1,
  limit: PAGE_LIMIT_DEFAULT,
  direction: SORT_DIRECTION.ASC,
};

const changeTab = async () => {
  const newParams = {
    ...defaultParams,
    status: tab.value,
  };
  await schoolDriverSchool.getListDriverApplication(newParams);
};

const fetch = async (params: Object) => {
  await schoolDriverSchool.getListDriverApplication(params);
};

onMounted(async () => {
  await changeTab();
});
</script>
<template>
  <v-container fluid class="w-100 d-flex ga-2 flex-column">
    <div class="w-100 d-flex justify-space-between">
      <h2>
        {{ pageName }}
      </h2>
    </div>
    <v-card>
      <v-tabs v-model="tab" @update:modelValue="changeTab">
        <v-tab value="1">Chờ xét duyệt</v-tab>
        <v-tab value="4">Đã duyệt</v-tab>
        <v-tab value="3">Đang chờ phản hồi</v-tab>
      </v-tabs>

      <v-card-text>
        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="1">
            <DriverApplicationTable
              @fetch="fetch"
              :status="1"
              :driver-applications="driverApplications"
              :meta-data="metaData"
            />
          </v-tabs-window-item>

          <v-tabs-window-item value="4">
            <DriverApplicationTable
              @fetch="fetch"
              :status="4"
              :driver-applications="driverApplications"
              :meta-data="metaData"
            />
          </v-tabs-window-item>

          <v-tabs-window-item value="3">
            <DriverApplicationTable
              @fetch="fetch"
              :status="3"
              :driver-applications="driverApplications"
              :meta-data="metaData"
            />
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
    </v-card>
  </v-container>
</template>
