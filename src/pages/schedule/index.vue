<script lang="ts" setup>
import { SNACKBAR_INFO_STATUS } from "~/constants/common";
import { SCHOOL_ROUTE } from "~/constants/route";
import type { OptionSelect, SnackbarProp } from "~/entities/common";
import { SchoolScheduleStore } from "~/stores/school/schedule";
const pageName = "Quản lý Lịch học";

definePageMeta({
  layout: "school",
  middleware: "auth-school",
  name: pageName,
});

document.title = pageName;

const schoolScheduleStore = SchoolScheduleStore();
const schoolApp = SchoolApp();
const today = ref();
const test = ref();
const events = computed(() => schoolScheduleStore.events);
const errors = computed(() => schoolScheduleStore.errors);
const isLoading = computed(() => schoolScheduleStore.isLoading);
const isSucceed = computed(() => schoolScheduleStore.isSucceed);

const handleMonthChange = async (newDay: string) => {
  const currentDate = convertDateTimeServer(
    new Date(newDay).toLocaleDateString().split("T")[0]
  );

  await schoolScheduleStore.getSchedule(currentDate);
};

const visibleCloneDateDialog = ref<boolean>(false);
const isCloneDate = ref<boolean>(true);
const sourceDate = ref<string>();
const destinationDate = ref<string>();

const handleCloneDate = async () => {
  if (!sourceDate.value || !destinationDate.value) {
    return;
  }

  if (isCloneDate.value) {
    let data = {
      dateSource: formatToYYYYMMDD(sourceDate.value as string),
      dateDestination: formatToYYYYMMDD(destinationDate.value as string),
    };
    await schoolScheduleStore.cloneScheduleDate(data);
  } else {
    let data = {
      weekSource: formatToYYYYMMDD(sourceDate.value as string),
      weekDestination: formatToYYYYMMDD(destinationDate.value as string),
    };
    await schoolScheduleStore.cloneScheduleWeek(data);
  }

  if (!isLoading.value && isSucceed.value) {
    schoolApp.showToastSuccess("Sao chép thành công");
    visibleCloneDateDialog.value = false;
  } else {
    schoolApp.showToastError(
      (errors.value as string) ?? "Sao chép không thành công"
    );
  }
};

onMounted(async () => {
  await schoolScheduleStore.getSchedule(
    convertDateTimeServer(new Date().toLocaleDateString().split("T")[0])
  );
});
</script>
<template>
  <v-container fluid class="w-100 d-flex ga-2 flex-column">
    <h2 class="pb-3 w-100">Lịch học của toàn trường</h2>
    <v-row class="w-100">
      <v-col>
        <v-btn
          text="Xem chi tiết"
          color="primary"
          :onclick="() => navigateTo(SCHOOL_ROUTE.DETAIL_DATE)"
        ></v-btn>
      </v-col>

      <v-col class="d-flex justify-end ga-2">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn color="primary" v-bind="props"> Sao chép lịch </v-btn>
          </template>
          <v-list>
            <v-list-item class="d-flex flex-column">
              <v-btn
                variant="flat"
                :onclick="
                  () => {
                    visibleCloneDateDialog = true;
                    isCloneDate = true;
                  }
                "
                >Sao chép ngày</v-btn
              >
            </v-list-item>
            <v-list-item class="d-flex flex-column">
              <v-btn
                variant="flat"
                :onclick="
                  () => {
                    visibleCloneDateDialog = true;
                    isCloneDate = false;
                  }
                "
                >Sao chép tuần</v-btn
              >
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn
          text="Tạo mới"
          color="primary"
          :onclick="() => navigateTo(SCHOOL_ROUTE.CREATE_SCHEDULE)"
        ></v-btn>
      </v-col>
    </v-row>
    <v-calendar
      v-model="today"
      color="primary"
      type="month"
      view-mode="month"
      :day="test"
      @update:model-value="handleMonthChange"
      :events="events"
      style="flex: 1; max-height: (100vh -100px)"
    >
      <template v-slot:event="{ day, event }">
        <v-tooltip location="top">
          <template v-slot:activator="{ props }">
            <v-chip
              v-bind="props"
              :color="event.color as string"
              class="w-100 pa-1"
              style="max-width: 150px"
            >
              <span
                v-for="title in event.title"
                class="text-medium-emphasis text-truncate"
                style="
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                "
                >{{ title }}</span
              >
            </v-chip>
          </template>
          <template v-slot:default>
            <v-card class="tooltip-card" elevation="2">
              <v-card-text>
                <h3 v-for="title in event.title" v-html="title"></h3>
                <div class="d-flex ga-2 align-center">
                  <v-icon>mdi-clock</v-icon>
                  <p>{{ new Date(event.start).toLocaleDateString() }}</p>
                  <p>Từ {{ new Date(event.start).toLocaleTimeString() }}</p>
                  <p>Đến {{ new Date(event.end).toLocaleTimeString() }}</p>
                </div>
                <div class="d-flex ga-2 flex-column">
                  <p class="text-bold">Note</p>
                  <p>{{ event.note }}</p>
                </div>
              </v-card-text>
            </v-card>
          </template>
        </v-tooltip>
      </template>
    </v-calendar>

    <v-dialog v-model="visibleCloneDateDialog" max-width="50vw">
      <div class="pa-2 ga-2">
        <h2>Sao chép lịch theo ngày</h2>
        <v-date-input
          label="Ngày gốc"
          v-model="sourceDate"
          name="sourceDate"
          prepend-icon=""
          prepend-inner-icon="$calendar"
        ></v-date-input>
        <v-date-input
          label="Ngày đích"
          v-model="destinationDate"
          name="destinationDate"
          :min="getMinDate(new Date(), 0, false)"
          prepend-icon=""
          prepend-inner-icon="$calendar"
        ></v-date-input>
        <div class="d-flex flex-column ga-2">
          <span
            >Vui lòng xem lại lịch học trong quá khứ trước khi sao chép
            lịch.</span
          >
          <span v-if="!isCloneDate"
            >Chọn 1 ngày thuộc tuần đó để định danh là tuần gốc và tuần
            đích.</span
          >
        </div>
        <div class="d-flex justify-end ga-2">
          <v-btn :onclick="() => (visibleCloneDateDialog = false)">Huỷ</v-btn>
          <v-btn color="primary" :onclick="handleCloneDate">Lưu</v-btn>
        </div>
      </div>
    </v-dialog>
  </v-container>
</template>

<style scoped>
::v-deep(.v-overlay__content) {
  background: white !important;
}

::v-deep(.v-calendar-weekly__day-content) {
  height: 100%;
}

.text-truncate {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis !important;
}

.tooltip-card {
  width: 100%;
  padding: 0 auto;
  background: white;
  color: black;
  border-radius: 4px;
  word-wrap: break-word;
}
</style>
