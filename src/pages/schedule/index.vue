<script lang="ts" setup>
import { SCHOOL_ROUTE } from "~/constants/route";
import type { OptionSelect } from "~/entities/common";
import { SchoolScheduleStore } from "~/stores/school/schedule";
const pageName = "Quản lý Lịch học";

definePageMeta({
  layout: "school",
  middleware: "auth-school",
  name: pageName,
});

const schoolScheduleStore = SchoolScheduleStore();
const today = ref();
const test = ref();

const weekNumber = Array.from({ length: 52 }, (_, i) => {
  return { id: String(i + 1), name: String(i + 1) } as OptionSelect;
});

const selectedWeek = ref<OptionSelect>(weekNumber[getWeekNumber() - 1]);
const events = computed(() => schoolScheduleStore.events);
const weekOptionChange = () => {};

const handleMonthChange = async (newDay: string) => {
  const currentDate = convertDateTimeServer(
    new Date(newDay).toLocaleDateString().split("T")[0]
  );

  await schoolScheduleStore.getSchedule(currentDate);
};

onMounted(async () => {
  await schoolScheduleStore.getSchedule(
    convertDateTimeServer(new Date().toLocaleDateString().split("T")[0])
  );
});
</script>
<template>
  <v-container>
    <v-col>
      <v-row>
        <h2>Lịch học của toàn trường</h2>
      </v-row>
      <v-row class="d-none justify-space-between">
        <v-col>
          <v-select
            auto-select-first="exact"
            label="Xem chi tiết lịch trong tuần"
            v-model="selectedWeek"
            :items="weekNumber"
            item-title="name"
            item-value="id"
            :return-object="true"
            @update:model-value="weekOptionChange"
          ></v-select>
        </v-col>
        <v-col>
          <v-btn class="mr-3" text="Xem chi tiết" color="primary"></v-btn>
        </v-col>
        <v-col class="d-flex justify-end">
          <v-btn
            class="mr-3"
            text="Tạo mới"
            color="primary"
            :onclick="() => navigateTo(SCHOOL_ROUTE.CREATE_SCHEDULE)"
          ></v-btn>
        </v-col>
      </v-row>
    </v-col>

    <v-calendar
      class="w-100 h-100"
      v-model="today"
      color="primary"
      type="month"
      :day="test"
      @update:model-value="handleMonthChange"
      :events="events"
    >
      <template v-slot:event="{ day, event }">
        <v-tooltip location="top">
          <template v-slot:activator="{ props }">
            <v-chip v-bind="props" :color="event.color" class="w-100 pa-1">
              <span class="text-truncate">{{ event.title }}</span>
            </v-chip>
          </template>
          <template v-slot:default>
            <v-card class="tooltip-card" elevation="2">
              <v-card-text>
                <h3 v-html="event.title"></h3>
                <div class="d-flex ga-2 align-center">
                  <v-icon>mdi-clock</v-icon>
                  <p>{{ new Date(event.start).toLocaleDateString() }}</p>
                  <p>Từ {{ new Date(event.start).toLocaleTimeString() }}</p>
                  <p>Đến {{ new Date(event.end).toLocaleTimeString() }}</p>
                </div>
              </v-card-text>
            </v-card>
          </template>
        </v-tooltip>
      </template>
    </v-calendar></v-container
  >
</template>

<style scoped>
::v-deep(.v-overlay__content) {
  background: white !important;
}

.tooltip-card {
  max-width: 100%;
  padding: 0 auto;
  background: white;
  color: black;
  border-radius: 4px;
  word-wrap: break-word;
}
</style>
