<script setup lang="ts">
import { SCHOOL_ROUTE } from "~/constants/route";
import { SchoolTripStore } from "~/stores/school/trip";

const pageName = "Chi tiết lịch chuyến đi trong ngày";

definePageMeta({
  layout: "school",
  middleware: "auth-school",
  name: pageName,
});

const schoolTripStore = SchoolTripStore();
const isLoading = computed(() => schoolTripStore.isLoading);
const isSucceed = computed(() => schoolTripStore.isSucceed);
const events = computed(() => schoolTripStore.events);
const today = ref();

const handleMonthChange = async (newDay: string) => {
  const currentDate = convertDateTimeServer(
    new Date(newDay).toLocaleDateString().split("T")[0]
  );

  await schoolTripStore.getListTripCalendar(currentDate);
};

onMounted(async () => {
  await schoolTripStore.getListTripCalendar(
    convertDateTimeServer(new Date().toLocaleDateString().split("T")[0])
  );
});
</script>
<template>
  <v-container fluid class="w-100 d-flex ga-2 flex-column">
    <div class="w-100 d-flex justify-space-between">
      <h2>
        {{ pageName }}
      </h2>
    </div>
    <v-row class="w-100">
      <v-col>
        <v-btn
          class="mr-3"
          text="Xem chi tiết"
          color="primary"
          :onclick="() => navigateTo(SCHOOL_ROUTE.DETAIL_TRIP)"
        ></v-btn>
      </v-col>
    </v-row>
    <v-calendar
      class="w-100 h-100"
      v-model="today"
      color="primary"
      type="month"
      view-mode="month"
      @update:model-value="handleMonthChange"
      :events="events"
    >
      <template v-slot:event="{ day, event }">
        <v-tooltip location="top">
          <template v-slot:activator="{ props }">
            <v-chip
              v-bind="props"
              :color="event.color"
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
                <p>{{ event.note }}</p>
              </v-card-text>
            </v-card>
          </template>
        </v-tooltip>
      </template>
    </v-calendar>
  </v-container>
</template>
