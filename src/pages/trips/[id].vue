<script setup lang="ts">
import { SCHOOL_ROUTE } from "~/constants/route";
import type { StudentInTripEntity } from "~/entities/school/driver";
import { SchoolTripStore } from "~/stores/school/trip";

const pageName = "Chi tiết chuyến đi";

definePageMeta({
  layout: "school",
  middleware: "auth-school",
  name: pageName,
});

const route = useRoute();
const studentId = route.params.id;
const schoolTripStore = SchoolTripStore();
const students = computed(
  () => schoolTripStore.driverTripsHasStudent?.students
);

const students1 = computed(() => schoolTripStore.driverTripsHasStudent);

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
    value: "pickedUpTime",
  },
  {
    title: "Thời gian trả",
    key: "dropOffTime",
    value: "dropOffTime",
  },
  { title: "Chi tiết", key: "actions" },
];

const mapRef = ref();
const directionsService = ref<any>(null);
const directionsRenderer = ref<any>(null);
const steps = ref<string[]>([]);
interface StudentLocation {
  location: string;
  stopover: boolean;
}
const waypoints = ref<StudentLocation[]>([]);
const startPoint =
  "52 Nguyễn Lương Bằng, Hoà Khánh Bắc, Liên Chiểu, Đà Nẵng 550000, Việt Nam";

const calculateAndDisplayRoute = () => {
  if (!directionsService.value || waypoints.value.length < 2) {
    console.warn("Không đủ điểm để tạo tuyến đường!");
    return;
  }

  directionsService.value.route(
    {
      origin: startPoint,
      destination: startPoint,
      waypoints: waypoints.value,
      travelMode: window.google.maps.TravelMode.DRIVING,
      optimizeWaypoints: true,
    },
    (response: any, status: string) => {
      if (status === "OK") {
        directionsRenderer.value.setDirections(response);
        console.log(response);
      } else {
        console.error("Directions request failed due to " + status);
      }
    }
  );
};

onMounted(async () => {
  await schoolTripStore.getDetailTripHasListStudent(studentId);

  const map = new window.google.maps.Map(mapRef.value, {
    center: { lat: 16.0780448, lng: 108.1232448 },
    zoom: 14,
  });

  steps.value.push(startPoint);

  waypoints.value = students.value?.map((student) => {
    steps.value.push(student.pickupAddress ?? "");

    return {
      location: student.pickupAddress,
      stopover: true,
    } as StudentLocation;
  });

  steps.value.push(startPoint);

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
    <v-data-table :headers="headerStudentTable" :items="students">
      <template v-slot:loading>
        <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
      </template>

      <template v-slot:item.actions="{ item }">
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
