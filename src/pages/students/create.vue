<script setup lang="ts">
import {
  GENDER_NAME,
  MODE_FORM_CREATE,
  MODE_FORM_UPDATE,
} from "~/constants/common";
import StudentForm from "~/components/school/StudentForm.vue";
import { ClassSchoolStore } from "~/stores/school/class";
import { SCHOOL_ROUTE } from "~/constants/route";
import type { ClassEntity } from "~/entities/school/class";
import type { StudentEntity } from "~/entities/school/student";
import { StudentSchoolStore } from "~/stores/school/student";
const pageName = "Tạo mới Học sinh";

definePageMeta({
  layout: "school",
  middleware: "auth-school",
  name: pageName,
});

interface CreateStudentEntity extends StudentEntity {
  key?: number;
}

const classSchoolStore = ClassSchoolStore();
const studentSchoolStore = StudentSchoolStore();
const isLoadingAddStudent = computed(() => studentSchoolStore.isLoading);
const isSucceed = computed(() => studentSchoolStore.isSucceed);
const classDetail = ref<ClassEntity>();
const classId = ref<string>();
const classError = ref<string>("");
const showModalAdd = ref<boolean>(false);
const showModalEdit = ref<boolean>(false);
const handleSearchClass = async () => {
  await classSchoolStore.getDetailClass(classId.value);
  classDetail.value = classSchoolStore.class;
  if (!classDetail.value) {
    classError.value = "Không tìm thấy Lớp học này vui lòng thử lại";
    return;
  }
};

const students = ref<CreateStudentEntity[]>([]);
const currentStudent = ref<CreateStudentEntity>();
const headers = [
  {
    title: "STT",
    key: "key",
    value: "key",
  },
  {
    title: "Họ",
    key: "firstName",
    value: "firstName",
  },
  {
    title: "Tên",
    key: "lastName",
    value: "lastName",
  },
  {
    title: "Giới tính",
    key: "gender",
    value: (item: CreateStudentEntity) =>
      GENDER_NAME[item.gender as keyof typeof GENDER_NAME],
  },
  {
    title: "Ngày sinh",
    key: "dateOfBirth",
    value: (item: CreateStudentEntity) =>
      item.dateOfBirth?.toString().split("T")[0],
  },
  { title: "Chi tiết", key: "actions" },
];

const addStudentIntoList = (data: CreateStudentEntity) => {
  if (!data) {
    return;
  }

  if (students.value.length === 0) {
    data.key = 1;
  } else {
    data.key = students.value[students.value.length - 1].key + 1;
  }

  data.classId = classDetail.value?.id;
  students.value.push(data);
  showModalAdd.value = false;
};

const editStudentInList = (data: CreateStudentEntity) => {
  students.value.forEach((_) => {
    if (_.key === data.key) {
      _.firstName = data.firstName;
      _.lastName = data.lastName;
      _.dateOfBirth = data.dateOfBirth;
      _.gender = data.gender;
    }
  });

  showModalEdit.value = false;
};

const handleEditStudent = (data: CreateStudentEntity) => {
  currentStudent.value = data;
  showModalEdit.value = true;
};

const handleRemoveStudent = (data: CreateStudentEntity) => {
  const indexRemove = students.value.indexOf(data);
  if (indexRemove > -1) {
    students.value.splice(indexRemove, 1);
  }
};

const canCreate = computed(() => {
  return (
    !!classDetail &&
    !!classId &&
    Array.isArray(students.value) &&
    students.value.length > 0
  );
});

const onSubmit = () => {
  if (!classId.value || !classDetail.value) {
    return;
  }

  if (students.value.length === 0) {
    return;
  }

  students.value.forEach(async (student) => {
    await studentSchoolStore.createStudent(student);
  });

  navigateTo(SCHOOL_ROUTE.STUDENTS);
};
</script>
<template>
  <v-container class="h-100 pa-2">
    <v-card class="d-flex flex-column pa-2 ga-2">
      <div class="d-flex ga-2 align-center">
        <div class="h-100" @click="navigateTo(SCHOOL_ROUTE.STUDENTS)">
          <v-icon>mdi-arrow-left</v-icon>
        </div>
        <v-card-title>Tạo mới học sinh</v-card-title>
      </div>

      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-title>
            Hướng dẫn tạo mới học sinh
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div>
              <strong>1</strong>. Copy mã lớp dán vào ô mã lớp, xem danh sách mã
              lớp tại đây
              <a target="_blank" :href="`${SCHOOL_ROUTE.CLASSES}`"
                >Danh sách lớp học.</a
              >
            </div>
            <div><strong>2</strong>. Copy mã lớp dán vào ô mã lớp.</div>
            <div>
              <strong>3</strong>. Nhấn gán mã để xác nhận mã lớp hợp lệ, mã lớp
              hợp lệ sẽ hiện ra thông tin của lớp đó.
            </div>
            <div>
              <strong>4</strong>. Nhấn vào ô <strong>Thêm học sinh</strong> để
              mở cửa sổ thêm học sinh.
            </div>
            <div>
              <strong>5</strong>. Sau khi thêm học sinh, nhấn vào ô
              <strong>Xác nhận</strong> để thêm vào danh sách thêm học sinh hàng
              chờ thêm.
            </div>
            <div>
              <strong>6</strong>. Kiểm tra lại tất cả các thông tin của học sinh
              và nhấn nút <strong>Xác nhận</strong> phía dưới góc phải màn hình
              để tiến hành thêm.
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <v-row>
        <v-col class="d-flex align-center"
          ><v-text-field
            label="Mã lớp (Bắt buộc)"
            v-model="classId"
            name="classId"
          />
          <v-btn class="mx-2 mb-4" color="primary" :onclick="handleSearchClass">
            Tìm kiếm
          </v-btn>
        </v-col>
        <v-col class="d-flex justify-end align-center">
          <v-btn
            class="mx-2 mb-4"
            color="primary"
            :disabled="!(classId && classDetail)"
            :onclick="
              () => {
                showModalAdd = true;
              }
            "
          >
            Thêm học sinh
          </v-btn>
        </v-col>
      </v-row>

      <v-row v-if="classDetail" class="pa-2">
        <v-card class="w-50 pa-2 ga-1">
          <v-card-subtitle>Thông tin lớp học</v-card-subtitle>
          <v-card-text
            ><strong>Mã lớp:</strong> {{ classDetail?.id }}</v-card-text
          >
          <v-card-text
            ><strong>Khối lớp:</strong> {{ classDetail?.gradeName }}
            <strong>Tên lớp:</strong> {{ classDetail?.className }}</v-card-text
          >
          <v-card-text>
            <strong>Giáo viên quản lý</strong>
            <div v-for="teacher in classDetail?.managedTeachers">
              <a
                class="text-decoration-none"
                :href="`${SCHOOL_ROUTE.TEACHERS}/${teacher.managedTeacherId}`"
                target="_blank"
                >{{ teacher.name }}</a
              >
            </div>
          </v-card-text>
          <v-card-text
            ><strong>Số lượng học sinh:</strong>
            {{ classDetail?.numberOfStudent }}</v-card-text
          >
        </v-card>
        <v-card-subtitle>{{ classError }}</v-card-subtitle>
      </v-row>
    </v-card>

    <v-card class="w-100">
      <v-data-table
        class="w-100"
        :headers="headers"
        :items="students"
        :loading="isLoadingAddStudent"
        hide-default-footer
      >
        <template v-slot:item.actions="{ item }">
          <div class="d-flex ga-2">
            <div @click="handleEditStudent(item)">
              <v-icon v-tooltip="'Chỉnh sửa'">mdi-account-edit</v-icon>
            </div>
            <div @click="handleRemoveStudent(item)">
              <v-icon v-tooltip="'Xoá'">mdi-account-remove</v-icon>
            </div>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <v-row no-gutters class="d-flex justify-end py-2">
      <v-spacer></v-spacer>
      <v-btn
        text="Lưu"
        :disabled="!canCreate"
        type="submit"
        color="primary"
        @click="onSubmit"
      ></v-btn>
    </v-row>

    <!-- Add Student -->
    <v-dialog v-model="showModalAdd">
      <v-card class="ga-2 pa-2">
        <div class="w-100 text-end">
          <v-btn
            density="compact"
            icon="mdi-close"
            @click="showModalAdd = false"
          >
          </v-btn>
        </div>
        <StudentForm :mode="MODE_FORM_CREATE" @submit="addStudentIntoList" />
      </v-card>
    </v-dialog>

    <!-- Edit student -->
    <v-dialog v-model="showModalEdit">
      <v-card class="ga-2 pa-2">
        <div class="w-100 text-end">
          <v-btn
            density="compact"
            icon="mdi-close"
            @click="showModalEdit = false"
          >
          </v-btn>
        </div>
        <StudentForm
          :key="currentStudent?.key"
          :temp-id="currentStudent?.key"
          :mode="MODE_FORM_CREATE"
          :student="currentStudent"
          @submit="editStudentInList"
        />
      </v-card>
    </v-dialog>
  </v-container>
</template>
