<script setup lang="ts">
import { isEmpty, debounce } from "lodash-es";
import { UNKNOWN_ERROR } from "~/constants/common";
import { SCHOOL_ROUTE } from "~/constants/route";
import {
  SCHEDULE_TYPE_OPTIONS,
  SCHEDULE_TYPE_ENUM,
  SCHEDULE_TYPE_NAME,
  SCHEDULE_SESSION_OPTIONS,
} from "~/constants/school";
import type { OptionSelect } from "~/entities/common";
import type { CreateScheduleEntity } from "~/entities/school/schedule";
import { ClassSchoolStore } from "~/stores/school/class";
import { SchoolMetaDataStore } from "~/stores/school/metadata";
import { SchoolScheduleStore } from "~/stores/school/schedule";

const pageName = "Tạo mới Lịch học";

definePageMeta({
  layout: "school",
  middleware: "auth-school",
  name: pageName,
});

// Handle schedule type
const selectedScheduleType = ref<OptionSelect>(SCHEDULE_TYPE_OPTIONS[2]);
// Handle search class
const classSchoolStore = ClassSchoolStore();
const schoolMetaData = SchoolMetaDataStore();
const schoolMetaDataStore = SchoolMetaDataStore();
const isLoadingClass = computed(() => classSchoolStore.isLoading);
const grades = computed(() => schoolMetaData.grades);
const resultSearchChooseClasses = computed(
  () => schoolMetaDataStore.classSearch
);
const selectedGrade = ref<OptionSelect>(grades.value[0]);
const selectedClass = ref<OptionSelect[]>([]);
const searchClassName = ref<string>("");
const selectedChooseClass = ref<OptionSelect>();
const selectedExclusionClass = ref<OptionSelect[]>([]);
const exclusionClassOptions = ref<OptionSelect[]>([]);
const exclusionClass = ref<OptionSelect[]>([]);
const selectedExclusionGrade = ref<OptionSelect[]>([]);
const exclusionClassSearch = ref<string>("");
const exclusionGradeSearch = ref<string>("");
const note = ref<string>("");
const selectedSession = ref<OptionSelect>(SCHEDULE_SESSION_OPTIONS[0]);
const gradeChange = async () => {
  await classSchoolStore.getListClass({ grade: selectedGrade.value.id });
  exclusionClassOptions.value = await classSchoolStore.classes.map((_) => {
    return { id: _.id, name: _.className } as OptionSelect;
  });
};

const handleAddExclusionClass = () => {
  selectedClass.value = [];

  if (selectedScheduleType.value.id === SCHEDULE_TYPE_ENUM.GRADE) {
    selectedClass.value = [
      ...selectedClass.value,
      ...selectedExclusionClass.value,
    ];
    selectedExclusionClass.value = [];
  } else if (selectedScheduleType.value.id === SCHEDULE_TYPE_ENUM.SCHOOL) {
    selectedExclusionGrade.value.forEach(async (_) => {
      await classSchoolStore.getListClass({
        grade: _.id,
      });
      selectedClass.value = [
        ...selectedClass.value,
        ...classSchoolStore.classes.map((_) => {
          return { id: _.id, name: _.className } as OptionSelect;
        }),
      ];
    });
  }
};

const scheduleTypeChange = async () => {
  if (grades.value.length > 0) {
    selectedGrade.value = grades.value[0];
    await gradeChange();
  }
};

const handleSearchExclusionClass = debounce((name: string) => {
  if (!isEmpty(name)) {
    schoolMetaDataStore.getDataClassList(name);
  }
}, 500);

const removeExclusionClass = (id: string) => {
  selectedClass.value = selectedClass.value.filter((_) => _.id !== id);
};

const scheduleDate = ref<Date[]>();
const updateRangeSchedule = () => {};
const schoolScheduleStore = SchoolScheduleStore();
const isLoadingSchedule = computed(() => schoolScheduleStore.isLoading);
const errors = computed(() => schoolScheduleStore.errors);
const errorQueue = ref<string[]>([]);
const handleCreateSchedule = async () => {
  if (!scheduleDate.value) return;

  errorQueue.value = [];
  schoolScheduleStore.errors = null;
  displaySnackQueue.value = false;
  currentErrorMessage.value = "";

  errorQueue.value = [];
  const promises = scheduleDate.value.map(async (_) => {
    const entity: CreateScheduleEntity = {
      date: convertDateTimeServer(_.toLocaleDateString().split("T")[0]),
      note: note.value,
      sessionType: Number(selectedSession.value.id),
      scheduleType: Number(selectedScheduleType.value.id),
    };

    switch (selectedScheduleType.value.id) {
      case SCHEDULE_TYPE_ENUM.SCHOOL:
        entity.classException = selectedClass.value.map((_) => String(_.id));
      case SCHEDULE_TYPE_ENUM.GRADE:
        entity.classException = selectedClass.value.map((_) => String(_.id));
        if (selectedGrade.value) {
          entity.grade = Number(selectedGrade.value.id);
        }
        break;

      case SCHEDULE_TYPE_ENUM.CLASS:
        entity.classId = String(selectedChooseClass.value?.id);
        break;
    }

    await schoolScheduleStore.createSchedule(entity);

    if (!isEmpty(errors.value?.message)) {
      displaySnackQueue.value = true;
      currentErrorMessage.value = errors.value?.message;
      errorQueue.value.push(errors.value?.message);
    }
  });

  await Promise.all(promises);

  if (errorQueue.value && errorQueue.value.length > 0) {
    displaySnackQueue.value = true;
    currentErrorMessage.value = errorQueue.value[0];
  } else {
    navigateTo(SCHOOL_ROUTE.SCHEDULE);
  }
};

const classTableHeaders = [
  {
    title: "Mã",
    key: "id",
    value: "id",
  },
  {
    title: "Tên",
    key: "name",
    value: "name",
  },
  { title: "Chi tiết", key: "actions" },
];

watch(searchClassName, (newSearch) => {
  handleSearchExclusionClass(newSearch);
});

// Handle snack queue
const displaySnackQueue = ref<boolean>(false);
const currentErrorMessage = ref<string>("");
const handleCloseSnackbar = () => {
  displaySnackQueue.value = false;
  if (errorQueue.value.length > 0) {
    currentErrorMessage.value = errorQueue.value.shift();
    displaySnackQueue.value = true;
  }
};

onMounted(async () => {
  await schoolMetaData.getDataGradeList();
  errorQueue.value = [];
});
</script>
<template>
  <v-container class="w-100 d-flex ga-2 flex-column">
    <v-card class="d-flex flex-column pa-2 ga-2">
      <div class="d-flex ga-2 align-center">
        <div class="h-100" @click="navigateTo(SCHOOL_ROUTE.SCHEDULE)">
          <v-icon>mdi-arrow-left</v-icon>
        </div>
        <v-card-title>{{ pageName }}</v-card-title>
      </div>

      <v-row class="py-2">
        <v-alert type="info" closable icon="$info" class="w-100">
          <template v-slot:title> Hướng dẫn </template>
          <template v-slot:text>
            <p>
              1. Đối với Loại lịch học bằng
              <strong>{{
                SCHEDULE_TYPE_NAME[SCHEDULE_TYPE_ENUM.SCHOOL]
              }}</strong>
              , lựa chọn khối loại trừ lịch (Nếu có) đó ở mục 2, toàn bộ lớp
              trong khối đó sẽ được thêm vào bảng loại trừ lớp học.
            </p>
            <p>
              2. Đối với Loại lịch học bằng
              <strong>{{ SCHEDULE_TYPE_NAME[SCHEDULE_TYPE_ENUM.GRADE] }}</strong
              >, lựa chọn khối muốn thêm lịch học ở ô bên cạnh. Lựa chọn lớp
              muốn thêm vào bảng lớp loại trừ (Nếu có) ở mục 2.
            </p>
            <p>
              3. Đối với Loại lịch học bằng
              <strong>{{ SCHEDULE_TYPE_NAME[SCHEDULE_TYPE_ENUM.CLASS] }}</strong
              >, lựa chọn lớp thêm vào bằng cách tìm kiếm tên trong ô đó.
            </p>
          </template>
        </v-alert>
      </v-row>

      <h3>1. Thời gian tạo.</h3>
      <v-row>
        <v-col>
          <v-date-input
            label="Ngày học"
            v-model="scheduleDate"
            name="scheduleDate"
            prepend-icon=""
            multiple="range"
            prepend-inner-icon="$calendar"
            :min="getMinDate(new Date(), 0, false)"
            @update:model-value="updateRangeSchedule"
          ></v-date-input>
        </v-col>
        <v-col></v-col>
      </v-row>

      <h3>2. Loại lịch học muốn tạo.</h3>
      <v-row>
        <v-col>
          <v-select
            auto-select-first="exact"
            label="Dạng lịch học"
            v-model="selectedScheduleType"
            :items="SCHEDULE_TYPE_OPTIONS"
            item-title="name"
            item-value="id"
            :return-object="true"
            @update:model-value="scheduleTypeChange"
          ></v-select>
        </v-col>
        <v-col
          ><v-select
            v-if="Number(selectedScheduleType.id) === SCHEDULE_TYPE_ENUM.GRADE"
            auto-select-first="exact"
            label="Khối"
            v-model="selectedGrade"
            :items="grades"
            item-title="name"
            item-value="id"
            persistent-hint
            hint="Lựa chọn một khối để sắp xếp lịch"
            :return-object="true"
            @update:model-value="gradeChange"
          ></v-select>
          <v-autocomplete
            v-if="selectedScheduleType.id === SCHEDULE_TYPE_ENUM.CLASS"
            auto-select-first="exact"
            label="Tìm kiếm lớp"
            v-model="selectedChooseClass"
            v-model:search="searchClassName"
            :items="resultSearchChooseClasses"
            item-title="name"
            item-value="id"
            chips
            no-data-text="Không có dữ liệu"
            :return-object="true"
          ></v-autocomplete>
        </v-col>
      </v-row>

      <h3>
        3. Loại trừ lớp hoặc khối (Dành cho loai lịch
        <strong>{{ SCHEDULE_TYPE_NAME[SCHEDULE_TYPE_ENUM.SCHOOL] }}</strong> và
        <strong>{{ SCHEDULE_TYPE_NAME[SCHEDULE_TYPE_ENUM.GRADE] }}</strong
        >)
      </h3>
      <v-row>
        <v-col>
          <v-select
            v-if="Number(selectedScheduleType.id) === SCHEDULE_TYPE_ENUM.SCHOOL"
            auto-select-first="exact"
            label="Khối loại trừ"
            multiple
            v-model="selectedExclusionGrade"
            v-model:search="exclusionGradeSearch"
            :items="grades"
            item-title="name"
            item-value="id"
            clearable
            chips
            no-data-text="Không có dữ liệu"
            hint="Để trống nếu bạn không loại trừ khối nào"
            :return-object="true"
          ></v-select>
          <v-select
            v-if="
              [SCHEDULE_TYPE_ENUM.GRADE].includes(
                Number(selectedScheduleType.id)
              )
            "
            auto-select-first="exact"
            label="Tìm kiếm lớp loại trừ"
            v-model="selectedExclusionClass"
            v-model:search="exclusionClassSearch"
            :items="exclusionClassOptions"
            item-title="name"
            item-value="id"
            multiple
            chips
            clearable
            no-data-text="Không có dữ liệu"
            :return-object="true"
          ></v-select>
        </v-col>
        <v-col>
          <v-btn
            v-if="
              [SCHEDULE_TYPE_ENUM.GRADE, SCHEDULE_TYPE_ENUM.SCHOOL].includes(
                Number(selectedScheduleType.id)
              )
            "
            class="mr-3"
            text="Tạo mới"
            color="primary"
            :onclick="handleAddExclusionClass"
          >
            Thêm
          </v-btn>
        </v-col>
      </v-row>

      <h3>4. Ca học</h3>
      <v-row>
        <v-col>
          <v-select
            auto-select-first="exact"
            label="Ca học"
            v-model="selectedSession"
            :items="SCHEDULE_SESSION_OPTIONS"
            item-title="name"
            item-value="id"
            :return-object="true"
          ></v-select>
        </v-col>
        <v-col></v-col>
      </v-row>

      <h3 class="p-2">
        5. Bảng lớp loại trừ (Dành cho loai lịch
        <strong>{{ SCHEDULE_TYPE_NAME[SCHEDULE_TYPE_ENUM.SCHOOL] }}</strong> và
        <strong>{{ SCHEDULE_TYPE_NAME[SCHEDULE_TYPE_ENUM.GRADE] }}</strong
        >)
      </h3>
      <v-row>
        <v-col>
          <v-data-table
            class="w-100"
            v-model="exclusionClass"
            :headers="classTableHeaders"
            :loading="isLoadingClass as boolean"
            :items="selectedClass"
          >
            <template v-slot:loading>
              <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
            </template>

            <template v-slot:top> </template>

            <template v-slot:item.actions="{ item }">
              <v-row class="d-flex ga-2">
                <div @click="removeExclusionClass(item.id)">
                  <v-icon class="text-red-500" v-tooltip="'Xoá'"
                    >mdi-trash-can</v-icon
                  >
                </div>
                <a :href="`${SCHOOL_ROUTE.CLASSES}/${item.id}`" target="_blank">
                  <v-icon v-tooltip="'Xem chi tiết'">mdi-arrow-right</v-icon>
                </a>
              </v-row>
            </template>
          </v-data-table>
        </v-col>
      </v-row>

      <h3 class="p-2">6. Thêm ghi chú</h3>
      <v-row class="mb-3 justify-end">
        <v-col>
          <v-textarea label="Mô tả thêm" v-model="note"></v-textarea>
        </v-col>
      </v-row>

      <v-row class="mb-3 justify-end">
        <v-btn
          :loading="isLoadingSchedule"
          class="mr-3"
          text="Tạo mới"
          color="primary"
          :onclick="handleCreateSchedule"
        >
          Thêm
        </v-btn>
      </v-row>
    </v-card>

    <v-snackbar
      v-model="displaySnackQueue"
      color="#E57373"
      :location="'top right'"
      multi-line
      :timeout="-1"
    >
      {{ currentErrorMessage }}
      <template v-slot:actions>
        <v-btn color="primary" variant="text" @click="handleCloseSnackbar">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
