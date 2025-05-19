<script setup lang="ts">
import { SCHOOL_ROUTE } from "~/constants/route";
import { TRIP_STATUS_NAMES } from "~/constants/school";
import type { DriverTripEntity } from "~/entities/school/driver";
import { SchoolTripStore } from "~/stores/school/trip";

const pageName = "Chi tiết lịch chuyến đi";

definePageMeta({
  layout: "school",
  middleware: "auth-school",
  name: pageName,
});

const schoolTripStore = SchoolTripStore();
const driverTrips = computed(() => schoolTripStore.driverTrips);
const scheduleDate = ref<Date>(new Date());
const getDetailSchedule = async () => {
  const dateConverted = convertDateTimeServer(
    scheduleDate.value.toLocaleDateString().split("T")[0]
  );

  await schoolTripStore.getDetailTripCalendar(dateConverted);
};

const headerDriverTrip = [
  // {
  //   title: "Mã",
  //   key: "id",
  //   value: "id",
  // },
  {
    title: "Tài xế",
    key: "driverName",
    value: "driverName",
  },
  {
    title: "Loại xe",
    key: "vehicleType",
    value: "vehicleType",
  },
  {
    title: "Tình trạng",
    key: "journeyStatus",
    value: (item: DriverTripEntity) =>
      TRIP_STATUS_NAMES[item.journeyStatus as keyof typeof TRIP_STATUS_NAMES],
  },
  {
    title: "Tổng số học sinh",
    key: "numberOfStudents",
    value: "numberOfStudents",
  },
  {
    title: "Tổng số học sinh hiện tại",
    key: "numberOfCurrentStudents",
    value: "numberOfCurrentStudents",
  },
  { title: "Chi tiết", key: "actions" },
];

const displayInfoDriver = ref<boolean>(false);
const currentDriver = ref<DriverTripEntity>();
const showInfoDriver = (item: DriverTripEntity) => {
  displayInfoDriver.value = true;
  currentDriver.value = item;
};

onMounted(async () => {
  await schoolTripStore.getDetailTripCalendar("2025-05-19");
});
</script>
<template>
  <v-container fluid class="w-100 d-flex ga-2 flex-column">
    <div class="w-100 d-flex justify-space-between">
      <h2>
        {{ pageName }}
      </h2>
    </div>
    <v-row class="py-2">
      <v-col>
        <v-date-input
          label="Ngày học"
          v-model="scheduleDate"
          name="scheduleDate"
          prepend-icon=""
          prepend-inner-icon="$calendar"
          @update:model-value="getDetailSchedule"
        ></v-date-input>
      </v-col>
      <v-col></v-col>
    </v-row>
    <v-data-table
      title="Danh sách tài xế và chuyến đi trong ngày"
      :items="driverTrips"
      :headers="headerDriverTrip"
    >
      <template v-slot:loading>
        <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
      </template>

      <template v-slot:item.actions="{ item }">
        <div class="d-flex flex-row ga-2">
          <v-btn
            density="compact"
            icon="mdi-card-account-details-outline"
            :onclick="() => showInfoDriver(item)"
          ></v-btn>
          <v-btn
            density="compact"
            icon="mdi-account-group"
            :onclick="() => navigateTo(`${SCHOOL_ROUTE.TRIPS}/${item.id}`)"
          ></v-btn>
        </div>
      </template>
    </v-data-table>

    <v-dialog v-model="displayInfoDriver" width="500px">
      <v-card
        title="Chi tiết thông tin tài xế"
        class="max-w-md mx-auto shadow-lg overflow-hidden border border-gray-200 rounded-lg"
      >
        <v-img
          :src="currentDriver?.driverAvatar"
          class="h-40 object-cover"
          alt="Driver Avatar"
        />
        <v-card-text class="p-4">
          <h3 class="text-xl font-semibold mb-2">
            {{ currentDriver?.driverName }}
          </h3>
          <div class="mb-2 text-sm text-gray-600">
            <strong>Loại xe:</strong> {{ currentDriver?.vehicleType || "N/A" }}
          </div>
          <div class="mb-2 text-sm text-gray-600">
            <strong>Giới tính:</strong> {{ currentDriver?.driverGender }}
          </div>
          <div class="mb-2 text-sm text-gray-600">
            <strong>Biển số:</strong>
            {{ currentDriver?.licenseNumber || "N/A" }}
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>
