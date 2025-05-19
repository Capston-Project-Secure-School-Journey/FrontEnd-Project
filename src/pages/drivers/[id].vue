<script lang="ts" setup>
import { SCHOOL_ROUTE } from "~/constants/route";
import { SchoolDriverStore } from "~/stores/school/driver";
import HoverImage from "~/components/common/HoverImage.vue";
import type {
  DriverApplicationEntity,
  HistoryRequest,
} from "~/entities/school/driver";
import {
  APPLICATION_ACTION_ENUMS,
  APPLICATION_ACTION_NAMES,
  APPLICATION_STATUS_ENUMS,
  APPLICATION_STATUS_NAMES,
} from "~/constants/school";
import PreviewImage from "~/components/common/PreviewImage.vue";

const pageName: string = "Thông tin chi tiết đơn";
document.title = pageName;
definePageMeta({
  layout: "school",
  middleware: "auth-school",
  name: pageName,
});
const route = useRoute();
const driverApplicationId = route.params.id;
const schoolDriverStore = SchoolDriverStore();
const isLoading = computed(() => schoolDriverStore.isLoading);
const isSucceed = computed(() => schoolDriverStore.isSucceed);
const driverApplication = computed(() => schoolDriverStore.driverApplication);
const statusHeaders = [
  {
    title: "Thời gian",
    key: "changedAt",
    value: (item: HistoryRequest) => new Date(item.changedAt).toLocaleString(),
  },
  {
    title: "Trạng thái trước",
    key: "fromStatus",
    value: "fromStatus",
  },
  {
    title: "Trạng thái sau",
    key: "toStatus",
    value: "toStatus",
  },
  {
    title: "Note",
    key: "note",
    value: (item: HistoryRequest) => item.note ?? "N/A",
  },
];

const overlay = ref<boolean>(false);
const currentImage = ref<string>();
const handlePreviewImage = (src: string) => {
  currentImage.value = src;
  overlay.value = true;
};
const currentAction = ref<number>();
const reason = ref<string>("");

const actionDriverApplication = async (action: number) => {
  switch (action) {
    case APPLICATION_ACTION_ENUMS.Approve:
      await schoolDriverStore.actionApprovalDriverApplication(
        driverApplicationId,
        reason.value
      );
      break;

    case APPLICATION_ACTION_ENUMS.Reject:
      await schoolDriverStore.actionRejectDriverApplication(
        driverApplicationId,
        reason.value
      );
      break;

    case APPLICATION_ACTION_ENUMS.RequestMoreInfo:
      await schoolDriverStore.actionRequestMoreInfoDriverApplication(
        driverApplicationId,
        reason.value
      );
      break;

    default:
      break;
  }

  await schoolDriverStore.getDetailDriverApplication(driverApplicationId);
};

onMounted(async () => {
  await schoolDriverStore.getDetailDriverApplication(driverApplicationId);
});
</script>
<template>
  <v-container>
    <div class="d-flex ga-2 align-center">
      <div class="h-100" @click="navigateTo(SCHOOL_ROUTE.DRIVERS)">
        <v-icon>mdi-arrow-left</v-icon>
      </div>
      <v-card-title>{{ pageName }}</v-card-title>
    </div>
    <v-card class="px-2">
      <v-row>
        <v-col cols="12" md="6" class="px-0">
          <v-row class="pa-3">
            <v-card-title class="text-xl font-bold"
              >Thông tin đơn xin</v-card-title
            >
          </v-row>
          <v-divider />

          <v-list-item>
            <v-list-item-title>Bằng lái xe số:</v-list-item-title>
            <v-list-item-subtitle>{{
              driverApplication?.licenseNumber
            }}</v-list-item-subtitle>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Loại xe:</v-list-item-title>
            <v-list-item-subtitle>{{
              driverApplication?.vehicleType
            }}</v-list-item-subtitle>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Số chỗ:</v-list-item-title>
            <v-list-item-subtitle>{{
              driverApplication?.seatingCapacity
            }}</v-list-item-subtitle>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Ngày tạo:</v-list-item-title>
            <v-list-item-subtitle>{{
              new Date(driverApplication?.requestedDate).toLocaleString()
            }}</v-list-item-subtitle>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Thao tác:</v-list-item-title>
            <div class="d-flex flex-column ga-2">
              <v-btn
                :disabled="
                  driverApplication?.requestStatus ===
                  APPLICATION_STATUS_ENUMS.Rejected
                "
                variant="elevated"
                color="success"
                @click="
                  actionDriverApplication(APPLICATION_ACTION_ENUMS.Approve)
                "
                >{{
                  APPLICATION_ACTION_NAMES[APPLICATION_ACTION_ENUMS.Approve]
                }}</v-btn
              >
              <v-btn
                variant="elevated"
                color="error"
                :disabled="
                  driverApplication?.requestStatus ===
                  APPLICATION_STATUS_ENUMS.Approved
                "
                @click="
                  actionDriverApplication(APPLICATION_ACTION_ENUMS.Reject)
                "
                >{{
                  APPLICATION_ACTION_NAMES[APPLICATION_ACTION_ENUMS.Reject]
                }}</v-btn
              >
              <v-btn
                variant="elevated"
                :disabled="
                  [
                    APPLICATION_STATUS_ENUMS.Rejected,
                    APPLICATION_STATUS_ENUMS.Approved,
                  ].includes(driverApplication?.requestStatus)
                "
                @click="
                  actionDriverApplication(
                    APPLICATION_ACTION_ENUMS.RequestMoreInfo
                  )
                "
                >{{
                  APPLICATION_ACTION_NAMES[
                    APPLICATION_ACTION_ENUMS.RequestMoreInfo
                  ]
                }}</v-btn
              >
            </div>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Ghi chú</v-list-item-title>
            <v-textarea v-model="reason" />
          </v-list-item>
        </v-col>

        <v-col cols="12" md="6" class="px-0">
          <v-row class="pa-3">
            <v-card-title class="text-xl"
              >Ảnh chụp Giấy phép lái xe</v-card-title
            >
          </v-row>
          <v-divider />

          <div
            v-for="(img, idx) in driverApplication?.driverInformationImages"
            class="w-100"
          >
            <span class="text-xl">{{
              img.type === 1 ? "Mặt trước" : "Mặt sau"
            }}</span>
            <HoverImage
              class="border border-dashed rounded-lg"
              @click="handlePreviewImage(img.url)"
            >
              <v-img
                cover
                aspect-ratio="16/9"
                max-width="300"
                max-height="250"
                :src="img.url"
                :alt="img.type === 1 ? 'Mặt trước' : 'Mặt sau'"
              >
                <template v-slot:placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular
                      color="grey-lighten-4"
                      indeterminate
                    ></v-progress-circular>
                  </div> </template
              ></v-img>
            </HoverImage>
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-card-title class="text-h6">Ảnh chụp phương tiện</v-card-title>
      </v-row>
      <v-row class="px-2">
        <v-col
          v-for="img in driverApplication?.vehicleImages"
          :key="img"
          cols="12"
          md="2"
        >
          <HoverImage
            @click="handlePreviewImage(img)"
            class="border border-dashed rounded-lg"
          >
            <v-img cover aspect-ratio="1/1" width="100" height="100" :src="img">
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular
                    color="grey-lighten-4"
                    indeterminate
                  ></v-progress-circular>
                </div> </template
            ></v-img>
          </HoverImage>
        </v-col>
      </v-row>

      <v-row>
        <v-card-title class="text-h6">Lịch sử thay đổi</v-card-title>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-data-table
            :headers="statusHeaders"
            :items="driverApplication?.driverRequestStatusHistoryResponse"
          >
            <template v-slot:item.fromStatus="{ item }">
              <v-btn v-if="item.fromStatus !== null" size="small">{{
                APPLICATION_STATUS_NAMES[
                  item.fromStatus as keyof typeof APPLICATION_STATUS_NAMES
                ]
              }}</v-btn>
              <span v-else class="text-error-500">N/A</span>
            </template>

            <template v-slot:item.toStatus="{ item }">
              <v-btn v-if="String(item.toStatus)" size="small">{{
                APPLICATION_STATUS_NAMES[
                  item.toStatus as keyof typeof APPLICATION_STATUS_NAMES
                ]
              }}</v-btn>
              <span v-else class="text-error-500">N/A</span>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <PreviewImage v-model="overlay" :image-url="currentImage" />
    </v-card>
  </v-container>
</template>
