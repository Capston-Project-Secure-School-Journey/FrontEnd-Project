<script setup lang="ts">
import { SCHOOL_ROUTE } from "~/constants/route";
import {
  SCHEDULE_SESSION_NAME,
  TRIP_STATUS_ENUMS,
  TRIP_STATUS_NAMES,
} from "~/constants/school";
import type { StudentInTripEntity } from "~/entities/school/driver";
import { SchoolTripStore } from "~/stores/school/trip";

const pageName = "Chi tiết chuyến đi";

definePageMeta({
  layout: "school",
  middleware: "auth-school",
  name: pageName,
});

const route = useRoute();
const tripId = route.params.id as string;
const schoolTripStore = SchoolTripStore();
const detailTrip = computed(() => schoolTripStore.driverTripsHasStudent);
const students = computed(
  () => schoolTripStore.driverTripsHasStudent?.students
);

const headerStudentTable = [
  {
    title: "Họ và tên",
    key: "fullName",
    value: "fullName",
  },
  {
    title: "Địa chỉ đón",
    key: "pickupAddress",
    value: "pickupAddress",
  },
  {
    title: "Lớp",
    key: "className",
    value: "className",
  },
  {
    title: "Bỏ qua đưa đón",
    key: "skipPickup",
    value: (item: StudentInTripEntity) => (item.skipPickup ? "Có" : "Không"),
  },
  {
    title: "Thời gian đón",
    key: "pickedUpTime",
    value: (item: StudentInTripEntity) =>
      item.pickedUpTime ? getTimeTrip(item.pickedUpTime) : null,
  },
  {
    title: "Thời gian trả",
    key: "droppedOffTime",
    value: (item: StudentInTripEntity) =>
      item.droppedOffTime ? getTimeTrip(item.droppedOffTime) : null,
  },
  { title: "Chi tiết", key: "actions", sortable: false },
];
const routes = computed(() => schoolTripStore.driverTripsHasStudent?.bestRoute);

const mapRef = ref();
const directionsService = ref<any>(null);
const directionsRenderer = ref<any>(null);
const steps = ref<string[]>([]);
interface StudentLocation {
  location: string;
  stopover: boolean;
}
const waypoints = ref<StudentLocation[]>([]);

const calculateAndDisplayRoute = () => {
  if (!directionsService.value || waypoints.value.length < 2) {
    console.warn("Không đủ điểm để tạo tuyến đường!");
    return;
  }

  directionsService.value.route(
    {
      origin: detailTrip.value?.bestRoute.origin.fullAddress,
      destination: detailTrip.value?.bestRoute.destination.fullAddress,
      waypoints: waypoints.value,
      travelMode: window.google.maps.TravelMode.DRIVING,
      optimizeWaypoints: true,
    },
    (response: any, status: string) => {
      if (status === "OK") {
        directionsRenderer.value.setDirections(response);
      } else {
        console.error("Directions request failed due to " + status);
      }
    }
  );
};

onMounted(async () => {
  await schoolTripStore.getDetailTripHasListStudent(tripId);

  const map = new window.google.maps.Map(mapRef.value, {
    center: { lat: 16.0780448, lng: 108.1232448 },
    zoom: 14,
  });

  if (detailTrip.value?.bestRoute.origin.fullAddress) {
    steps.value.push(detailTrip.value.bestRoute.origin.fullAddress);
  }

  waypoints.value = (detailTrip.value?.bestRoute.wayPoints ?? []).map(
    (student) => {
      steps.value.push(student.fullAddress ?? "");

      return {
        location: student.fullAddress,
        stopover: true,
      } as StudentLocation;
    }
  );

  if (detailTrip.value?.bestRoute.destination.fullAddress) {
    steps.value.push(detailTrip.value.bestRoute.destination.fullAddress);
  }

  directionsService.value = new window.google.maps.DirectionsService();
  directionsRenderer.value = new window.google.maps.DirectionsRenderer({
    map: map,
    suppressMarkers: false,
  });

  calculateAndDisplayRoute();
});
</script>
<template>
  <v-container fluid class="w-100 d-flex ga-2 flex-column">
    <div class="w-100 d-flex align-center ga-2">
      <div class="h-100" @click="navigateTo(SCHOOL_ROUTE.DETAIL_TRIP)">
        <v-icon>mdi-arrow-left</v-icon>
      </div>
      <h2>
        {{ pageName }}
      </h2>
    </div>
    <v-row class="grid">
      <v-col cols="2">
        <v-img
          :width="200"
          aspect-ratio="1"
          cover
          :src="detailTrip?.driverAvatar"
        ></v-img>
      </v-col>
      <v-col class="d-flex flex-column justify-start ga-2">
        <span class="text-left text-lg">
          Tài xế:
          <strong>{{ detailTrip?.driverName }}</strong>
        </span>
        <span class="text-left text-lg">
          Điện thoại:
          <strong>{{ detailTrip?.driverPhoneNumber }}</strong>
        </span>
        <span class="text-left text-lg">
          Loại xe:
          <strong>{{ detailTrip?.vehicleType }}</strong>
        </span>
        <span class="text-left">
          Ngày:
          <strong>{{ detailTrip?.date }}</strong> Buổi
          <strong>{{
            SCHEDULE_SESSION_NAME[
              detailTrip?.sessionType as keyof typeof SCHEDULE_SESSION_NAME
            ]
          }}</strong>
        </span>
        <span class="text-left">
          Trạng thái:
          <strong>{{
            TRIP_STATUS_NAMES[
              detailTrip?.journeyStatus as keyof typeof TRIP_STATUS_NAMES
            ]
          }}</strong>
        </span>
        <span class="text-left">
          Thời gian đưa đón:
          <strong>{{ detailTrip?.pickupStartTime }}</strong> -
          <strong>{{ detailTrip?.pickupEndTime }}</strong>
        </span>
        <span class="text-left">
          Thời gian bắt đầu - kết thúc:
          <strong>{{
            detailTrip?.startJourneyTime ? detailTrip?.startJourneyTime : "N/A"
          }}</strong>
          -
          <strong>{{
            detailTrip?.endJourneyTime ? detailTrip?.endJourneyTime : "N/A"
          }}</strong>
        </span>
        <span class="text-left">
          Số học sinh đã đón - trả:
          <strong>{{ detailTrip?.numberOfPickedUpStudents }}</strong>
          -
          <strong>{{ detailTrip?.numberOfDroppedOffStudents }}</strong>
        </span>

        <span
          v-if="detailTrip?.journeyStatus === TRIP_STATUS_ENUMS.Cancelled"
          class="text-left"
        >
          Lí do huỷ chuyến:
          <strong>{{ detailTrip?.cancelReason }}</strong>
        </span>
      </v-col>
    </v-row>
    <v-data-table :headers="headerStudentTable" :items="students">
      <template v-slot:loading>
        <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-tooltip v-if="item.skipPickup" location="top">
          <template #activator="{ props }">
            <v-icon v-bind="props" color="info" class="ml-2">mdi-note</v-icon>
          </template>
          <span>{{ item.isSkipUpReason || "Không có ghi chú" }}</span>
        </v-tooltip>
        <a :href="`${SCHOOL_ROUTE.STUDENTS}/${item.studentId}`">
          <v-icon v-tooltip="'Xem chi tiết'">mdi-arrow-right</v-icon>
        </a>
      </template>
    </v-data-table>

    <div class="map-container">
      <div ref="mapRef" class="map"></div>
    </div>
    <div>
      <v-stepper-vertical :items="steps"></v-stepper-vertical>
    </div>
  </v-container>
</template>
<style scoped>
.map-container {
  width: 100%;
  height: 500px;
}
.map {
  height: 100%;
  width: 100%;
}
</style>
