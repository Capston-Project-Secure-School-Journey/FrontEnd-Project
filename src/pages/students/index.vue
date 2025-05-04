<script lang="ts" setup>
import { isEmpty, debounce } from "lodash-es";
import {
  GENDER_NAME,
  PAGE_LIMIT_DEFAULT,
  SORT_DIRECTION,
  PAGE_SIZE_OPTIONS,
  SNACKBAR_INFO_STATUS,
} from "~/constants/common";
import CopyBlock from "~/components/common/CopyBlock.vue";
import {
  type OptionSelect,
  type QueryParamEntity,
  type SnackbarProp,
} from "~/entities/common";
import type { StudentCommonEntity } from "~/entities/school/student";
import { StudentSchoolStore } from "~/stores/school/student";
import { SCHOOL_ROUTE } from "~/constants/route";
import { SchoolMetaDataStore } from "~/stores/school/metadata";

const pageName = "Quản lý Học sinh";

definePageMeta({
  layout: "school",
  middleware: "auth-school",
  name: pageName,
});

const studentSchoolStore = StudentSchoolStore();
const schoolMetaDataStore = SchoolMetaDataStore();
const students = computed(() => studentSchoolStore.students);
const errors = computed(() => studentSchoolStore.errors);
const isLoading = computed(() => studentSchoolStore.isLoading);
const isSucceed = computed(() => studentSchoolStore.isSucceed);
const metaData = computed(() => studentSchoolStore.metaData);
const selectedStudent = ref<StudentCommonEntity[]>([]);
const showDialogDelete = ref<boolean>(false);
const queryParamEntity = ref<QueryParamEntity>({
  page: 1,
  limit: PAGE_LIMIT_DEFAULT,
  direction: SORT_DIRECTION.ASC,
  sortBy: "name",
});

const headers = [
  {
    title: "Mã",
    key: "id",
    value: "id",
  },
  {
    title: "Họ và Tên",
    key: "name",
    value: (item: StudentCommonEntity) => `${item.firstName} ${item.lastName}`,
  },
  {
    title: "Lớp",
    key: "className",
    value: "className",
  },
  {
    title: "Giới tính",
    key: "gender",
    value: (item: StudentCommonEntity) =>
      GENDER_NAME[item.gender as keyof typeof GENDER_NAME],
  },
  {
    title: "Ngày sinh",
    key: "dateOfBirth",
    value: (item: StudentCommonEntity) =>
      item.dateOfBirth?.toString().split("T")[0],
  },
  { title: "Chi tiết", key: "actions" },
];

watch(
  () => queryParamEntity.value,
  async (newQueryParamEntity) => {
    await studentSchoolStore.getListStudent(newQueryParamEntity);
  },
  { deep: true }
);

const deleteListStudent = async () => {
  if (selectedStudent.value.length > 0) {
    await studentSchoolStore.deleteListStudent(selectedStudent.value);

    if (!isLoading.value && isSucceed.value) {
      showDialogDelete.value = false;
      await studentSchoolStore.getListStudent(queryParamEntity.value);
      selectedStudent.value = [];
    }
  }
};

const copyStatus = ref<SnackbarProp>({
  status: SNACKBAR_INFO_STATUS,
  message: "",
  color: "#FFFFFF",
  display: false,
});
const copyToClipboard = (data: SnackbarProp) => {
  copyStatus.value = data;
};

// Handle search by class
const selectedClass = ref<OptionSelect>();
const searchClass = ref<string>("");
const resultSearchClasses = computed(() => schoolMetaDataStore.classSearch);

const handleSearchClass = debounce((name: string) => {
  if (!isEmpty(name)) {
    schoolMetaDataStore.getDataClassList(name);
  }
}, 500);

const handleChangeSelectedSearchClass = async () => {
  if (selectedClass.value?.id) {
    queryParamEntity.value = Object.assign(
      { ClassId: selectedClass.value?.id },
      queryParamEntity.value
    );
  } else {
    const { ClassId, ...rest } = queryParamEntity.value;
    queryParamEntity.value = rest;
  }

  await studentSchoolStore.getListStudent(queryParamEntity.value);
};

watch(searchClass, (newSearch) => {
  console.log(newSearch);

  handleSearchClass(newSearch);
});

onMounted(async () => {
  await studentSchoolStore.getListStudent(queryParamEntity.value);
});
</script>
<template>
  <v-container class="w-100 d-flex ga-2 flex-column">
    <div class="w-100 d-flex justify-space-between">
      <h2>
        {{ pageName }}
      </h2>
      <v-btn
        class="btn-primary"
        :onclick="() => navigateTo(SCHOOL_ROUTE.CREATE_STUDENTS)"
      >
        Tạo mới
      </v-btn>
    </div>
    <v-card class="w-100">
      <v-data-table
        class="w-100"
        :headers="headers"
        show-select
        v-model="selectedStudent"
        :loading="isLoading as boolean"
        :items="students"
        :items-per-page="queryParamEntity.limit"
      >
        <template v-slot:top>
          <v-row class="d-flex pa-2 ga-2">
            <v-col class="pa-2">
              <v-autocomplete
                auto-select-first="exact"
                label="Tìm kiếm theo lớp"
                item-title="name"
                item-value="id"
                v-model="selectedClass"
                v-model:search="searchClass"
                :items="resultSearchClasses"
                chips
                clearable
                no-data-text="Không có dữ liệu"
                return-object
                @update:model-value="handleChangeSelectedSearchClass"
              ></v-autocomplete>
            </v-col>
            <v-col class="pa-2 d-flex justify-end">
              <v-btn
                text="Xoá"
                :disabled="selectedStudent.length === 0"
                color="error"
                :onclick="() => (showDialogDelete = true)"
              ></v-btn>
            </v-col>
          </v-row>
        </template>

        <template v-slot:loading>
          <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
        </template>

        <template v-slot:item.id="{ item }">
          <CopyBlock :text="item.id" @on-display="copyToClipboard" />
        </template>

        <template v-slot:item.actions="{ item }">
          <a :href="`${SCHOOL_ROUTE.STUDENTS}/${item?.id}`">
            <v-icon v-tooltip="'Xem chi tiết'">mdi-arrow-right</v-icon>
          </a>
        </template>
        <template v-slot:bottom>
          <div class="text-center d-flex flex-row pt-2 justify-end pa-2">
            <v-col class="ga-2">
              <v-select
                label="Hiển thị"
                class="w-25"
                :items="PAGE_SIZE_OPTIONS"
                v-model="queryParamEntity.limit"
              ></v-select>
            </v-col>
            <v-col>
              <v-pagination
                v-model="queryParamEntity.page"
                class="w-100"
                :length="
                  Math.max(
                    1,
                    Math.ceil(
                      (metaData.total || 0) /
                        (queryParamEntity.limit || PAGE_LIMIT_DEFAULT)
                    )
                  )
                "
              >
              </v-pagination>
            </v-col>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="showDialogDelete" max-width="500">
      <v-card
        title="Xác nhận thao tác"
        subtitle="Bạn có muốn xoá Học sinh này chứ này chứ?"
      >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="Xoá" :onclick="deleteListStudent"></v-btn>
          <v-btn text="Huỷ" :onclick="() => (showDialogDelete = false)"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      id="copySuccess"
      v-model="copyStatus.display"
      :color="copyStatus.color"
      :location="'top right'"
    >
      {{ copyStatus.message }}
      <template v-slot:actions>
        <v-btn
          color="primary"
          variant="text"
          @click="copyStatus.display = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
