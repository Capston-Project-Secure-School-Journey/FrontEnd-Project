<script lang="ts" setup>
import { string } from "zod";
import { SNACKBAR_COLOR, SNACKBAR_SUCCESS_STATUS } from "~/constants/common";
import { SCHOOL_ROUTE } from "~/constants/route";
import {
  SCHEDULE_SESSION_NAME,
  SCHEDULE_SESSION_OPTIONS,
  SCHEDULE_TYPE_NAME,
} from "~/constants/school";
import type { OptionSelect, SnackbarProp } from "~/entities/common";
import type { EventDetailEntity } from "~/entities/school/schedule";
import { SchoolScheduleStore } from "~/stores/school/schedule";

const pageName = "Chi tiết lịch học trong ngày";

definePageMeta({
  layout: "school",
  middleware: "auth-school",
  name: pageName,
});
const schoolScheduleStore = SchoolScheduleStore();
const scheduleDate = ref<Date>(new Date());
const isLoading = computed(() => schoolScheduleStore.isLoading);
const isSucceed = computed(() => schoolScheduleStore.isSucceed);
const errors = computed(() => schoolScheduleStore.errors);
const scheduleData = computed(() => schoolScheduleStore.scheduleData);
const readonly = ref<boolean>(true);

const getDetailSchedule = async () => {
  const dateConverted = convertDateTimeServer(
    scheduleDate.value.toLocaleDateString().split("T")[0]
  );
  readonly.value =
    scheduleDate.value <= new Date(getMinDate(new Date(), 0, false));

  await schoolScheduleStore.getDetailScheduleDate(dateConverted);
};

const scheduleDateHeaders = [
  {
    title: "Mã lớp",
    key: "classId",
    value: "classId",
  },
  {
    title: "Lớp",
    key: "className",
    value: "className",
  },
  {
    title: "Khối",
    key: "gradeName",
    value: "gradeName",
  },
  {
    title: "Xếp theo",
    key: "scheduleType",
    value: (item: EventDetailEntity) =>
      SCHEDULE_TYPE_NAME[item.scheduleType as keyof typeof SCHEDULE_TYPE_NAME],
  },
  {
    title: "Buổi",
    key: "sessionType",
    value: (item: EventDetailEntity) =>
      SCHEDULE_SESSION_NAME[
        item.sessionType as keyof typeof SCHEDULE_SESSION_NAME
      ],
  },
  {
    title: "Ghi chú",
    key: "note",
    value: "note",
  },
  { title: "Chi tiết", key: "actions" },
];

const selectedScheduleData = ref<EventDetailEntity>({});
const selectedClassName = ref<string>("");
const selectedClassScheduleDate = ref<Date>(new Date());
const selectedClassScheduleNote = ref<string>("");
const visibleDialog = ref<boolean>(false);
const selectedClassScheduleSession = ref<OptionSelect>();
const snackbarStatus = ref<SnackbarProp>({
  display: false,
});

const handleSelectSchedule = (item: EventDetailEntity) => {
  selectedScheduleData.value = item;
  selectedClassName.value = item.className ?? "";
  selectedClassScheduleNote.value = item.note ?? "";
  selectedClassScheduleSession.value =
    SCHEDULE_SESSION_OPTIONS.filter((i) => i.id == item.sessionType)[0] ??
    SCHEDULE_SESSION_OPTIONS[0];
  visibleDialog.value = true;
};

const updateSchedule = async () => {
  const dateConverted = convertDateTimeServer(
    scheduleDate.value.toLocaleDateString().split("T")[0]
  );

  const data = {
    id: selectedScheduleData.value.id,
    date: dateConverted,
    note: selectedClassScheduleNote.value,
    sessionType: selectedClassScheduleSession.value?.id,
    classId: selectedScheduleData.value.classId,
  };

  await schoolScheduleStore.updateDetailScheduleDate(data as EventDetailEntity);

  await handleSnackbar("Cập nhật thành công");
};

const deleteSchedule = async () => {
  if (selectedScheduleData.value && selectedScheduleData.value.id) {
    await schoolScheduleStore.deleteDetailScheduleDate(
      selectedScheduleData.value.id
    );

    await handleSnackbar("Xoá thành công");
  }
};

const handleSnackbar = async (successMessage: string) => {
  if (!isLoading.value && isSucceed.value) {
    visibleDialog.value;
    await getDetailSchedule();
    snackbarStatus.value = {
      color: SNACKBAR_COLOR[SNACKBAR_SUCCESS_STATUS],
      message: successMessage,
      display: true,
    } as SnackbarProp;
    return;
  }

  if (!isSucceed.value && errors.value?.message) {
    snackbarStatus.value = {
      color: SNACKBAR_COLOR[SNACKBAR_SUCCESS_STATUS],
      message: errors.value.message,
      display: true,
    } as SnackbarProp;
  }
};
</script>
<template>
  <v-container class="w-100 d-flex ga-2 flex-column">
    <v-snackbar
      v-model="snackbarStatus.display"
      :color="snackbarStatus.color"
      :location="'top right'"
      :timeout="-1"
    >
      {{ snackbarStatus?.message }}
      <template v-slot:actions>
        <v-btn
          color="primary"
          variant="text"
          @click="
            () => {
              snackbarStatus.display = false;
            }
          "
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-card class="d-flex flex-column pa-2 ga-2">
      <div class="d-flex ga-2 align-center">
        <div class="h-100" @click="navigateTo(SCHOOL_ROUTE.SCHEDULE)">
          <v-icon>mdi-arrow-left</v-icon>
        </div>
        <v-card-title>{{ pageName }}</v-card-title>
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

      <h3>Chi tiết các lớp học</h3>
      <v-row>
        <v-col>
          <v-data-table
            class="w-100"
            :headers="scheduleDateHeaders"
            :loading="isLoading as boolean"
            :items="scheduleData"
          >
            <template v-slot:loading>
              <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
            </template>

            <template v-slot:item.actions="{ item }">
              <a @click="handleSelectSchedule(item)">
                <v-icon v-tooltip="'Xem chi tiết'">mdi-arrow-right</v-icon>
              </a>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card>

    <v-dialog v-model="visibleDialog" max-width="800">
      <v-card title="Chi tiết lịch học">
        <v-card-text>
          <v-row>
            <v-col
              ><v-text-field
                label="Lớp"
                v-model="selectedClassName"
                name="firstName"
                readonly
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col
              ><v-date-input
                label="Ngày "
                v-model="selectedClassScheduleDate"
                prepend-icon=""
                prepend-inner-icon="$calendar"
                :min="new Date()"
                :readonly="readonly"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col
              ><v-select
                auto-select-first="exact"
                label="Ca học"
                v-model="selectedClassScheduleSession"
                :items="SCHEDULE_SESSION_OPTIONS"
                item-title="name"
                item-value="id"
                :return-object="true"
                :readonly="readonly"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              ><v-textarea
                label="Mô tả thêm"
                :readonly="readonly"
                v-model="selectedClassScheduleNote"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="readonly"
            text="Xoá"
            :onclick="deleteSchedule"
          ></v-btn>
          <v-btn
            :disabled="readonly"
            text="Cập nhật"
            :onclick="updateSchedule"
          ></v-btn>
          <v-btn text="Huỷ" :onclick="() => (visibleDialog = false)"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
