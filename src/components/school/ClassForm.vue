<script setup lang="ts">
import { useForm } from "vee-validate";
import {
  GENDER_NAME,
  MODE_FORM_CREATE,
  MODE_FORM_UPDATE,
  PAGE_LIMIT_DEFAULT,
  SORT_DIRECTION,
} from "~/constants/common";
import { SCHOOL_ROUTE } from "~/constants/route";
import type { OptionSelect, QueryParamEntity } from "~/entities/common";
import type {
  ClassEntity,
  GradeEntity,
  ManagerTeacher,
} from "~/entities/school/class";
import type { TeacherCommonEntity } from "~/entities/school/teacher";
import {
  createClassSchema,
  updateClassSchema,
} from "~/schemas/school/class.schema";
import { ClassSchoolStore } from "~/stores/school/class";
import { TeacherSchoolStore } from "~/stores/school/teacher";

interface ClassFormProps {
  mode: string;
  classDetail?: ClassEntity;
  grades: GradeEntity[];
}

const props = withDefaults(defineProps<ClassFormProps>(), {
  mode: MODE_FORM_CREATE,
});

const emits = defineEmits(["submit", "delete"]);

const { defineField, setFieldValue, handleSubmit, errors } = useForm({
  validationSchema:
    props.mode === MODE_FORM_CREATE ? createClassSchema : updateClassSchema,
});

const [className] = defineField("className");
const [numberOfStudent] = defineField("numberOfStudent");

const classSchoolStore = ClassSchoolStore();
const teacherSchoolStore = TeacherSchoolStore();
const teachers = computed(() => teacherSchoolStore.teachers);
const isLoading = computed(() => classSchoolStore.isLoading);
const isSucceed = computed(() => classSchoolStore.isSucceed);
const gradeSelected = ref();

/** For search teacher */
const headers = [
  {
    title: "Mã",
    key: "id",
    value: "id",
  },
  {
    title: "Họ và Tên",
    key: "name",
    value: (item: TeacherCommonEntity) => `${item.firstName} ${item.lastName}`,
  },
  {
    title: "Giới tính",
    key: "gender",
    value: (item: TeacherCommonEntity) =>
      GENDER_NAME[item.gender as keyof typeof GENDER_NAME],
  },
  {
    title: "Email",
    key: "email",
    value: "email",
  },
  {
    title: "Số điện thoại",
    key: "phoneNumber",
    value: "phoneNumber",
  },
  { title: "Chi tiết", key: "actions" },
];
const queryParamEntity = ref<QueryParamEntity>({
  page: 1,
  limit: PAGE_LIMIT_DEFAULT,
  direction: SORT_DIRECTION.ASC,
  sortBy: "name",
});
const metaDataTeacher = computed(() => teacherSchoolStore.metaData);
const selectedTeacher = ref<OptionSelect[]>([]);
const addTeacher = (teacherId: string, name: string) => {
  const newTeacher: OptionSelect = {
    id: teacherId,
    name: name,
  };
  if (selectedTeacher.value.filter((_) => _.id === teacherId).length > 0) {
    return;
  }

  selectedTeacher.value.push(newTeacher);
  errorSelectedTeacher.value = "";
};

watch(
  () => queryParamEntity.value.page,
  async (newPage) => {
    queryParamEntity.value.page = newPage;
    await classSchoolStore.getListClass(queryParamEntity.value);
  }
);
const searchTeacher = ref<string>("");
const displayTableTeacher = ref<boolean>(false);
const errorSelectedTeacher = ref<string>("");
const handleSearchTeacher = async () => {
  displayTableTeacher.value = false;

  if (!searchTeacher.value) {
    queryParamEntity.value = Object.assign(
      { name: searchTeacher.value },
      queryParamEntity.value
    );

    await teacherSchoolStore.getTeacherList(queryParamEntity.value);
    if (teachers.value.length > 0) {
      displayTableTeacher.value = true;
    }
  }
};

const setupForCreate = () => {
  gradeSelected.value = props.grades[0];
};

const setupForUpdate = () => {
  if (!props.classDetail) {
    return;
  }

  setFieldValue("numberOfStudent", props.classDetail.numberOfStudent);
  setFieldValue("className", props.classDetail.className);
  gradeSelected.value =
    props.grades.filter((_) => _.id === props.classDetail?.grade)?.[0] ??
    props.grades[0];
  selectedTeacher.value = props.classDetail.managedTeachers;
};

const onSubmit = handleSubmit(async () => {
  const managedTeachers: ManagerTeacher[] = selectedTeacher.value.map((_) => {
    const managedTeacher: ManagerTeacher = {
      managedTeacherId: String(_.id),
    };
    return managedTeacher;
  });

  if (managedTeachers.length === 0) {
    errorSelectedTeacher.value = "Lớp học phải có ít nhất 1 giáo viên";
  } else {
    errorSelectedTeacher.value = "";
  }

  const entity: ClassEntity = {
    grade: gradeSelected.value.id,
    managedTeachers: managedTeachers,
    className: className.value,
  };

  if (props.mode === MODE_FORM_CREATE) {
    await classSchoolStore.createClass(entity);

    if (!isLoading.value && isSucceed.value) {
      navigateTo(SCHOOL_ROUTE.CLASSES);
    }
  } else {
    emits("submit", entity);
  }
});

const onDelete = () => {
  emits("delete");
};

onMounted(() => {
  if (props.mode === MODE_FORM_CREATE) {
    setupForCreate();
  } else {
    setupForUpdate();
  }
});
</script>
<template>
  <v-card class="w-100 d-flex flex-column pa-2 ga-4">
    <div class="d-flex ga-2 align-center">
      <div class="h-100" @click="navigateTo(SCHOOL_ROUTE.CLASSES)">
        <v-icon>mdi-arrow-left</v-icon>
      </div>
      <h2>
        {{
          props.mode === MODE_FORM_CREATE
            ? "Tạo mới Lớp học"
            : "Chỉnh sửa Lớp học"
        }}
      </h2>
    </div>
    <v-form @submit.prevent="onSubmit" class="d-flex flex-column w-100 ga-2">
      <v-row no-gutters class="ga-2">
        <v-col>
          <v-text-field
            label="Tên lớp (Bắt buộc)"
            v-model="className"
            name="className"
            :rules="[() => errors.className || true]"
          />
        </v-col>
        <v-col>
          <v-select
            auto-select-first="exact"
            label="Khối"
            v-model="gradeSelected"
            :items="props.grades"
            item-title="name"
            item-value="id"
            :return-object="true"
          ></v-select>
        </v-col>
      </v-row>
      <v-row no-gutters class="ga-2">
        <v-col>
          <v-text-field
            label="Số lượng"
            v-model="numberOfStudent"
            disabled
            name="numberOfStudent"
          />
        </v-col>
      </v-row>
      <v-row no-gutters class="ga-2">
        <v-col>
          <v-text-field
            label="Tìm kiếm giáo viên"
            v-model="searchTeacher"
            name="searchTeacher"
            append-inner-icon="mdi-account-search"
          />
        </v-col>
        <v-col>
          <v-btn class="mx-2" color="primary" :onclick="handleSearchTeacher">
            Tìm kiếm
          </v-btn>
        </v-col>
      </v-row>
      <v-row no-gutters class="ga-2">
        <v-col
          ><v-select
            v-model="selectedTeacher"
            :items="selectedTeacher"
            label="Giáo viên đã chỉ định"
            chips
            multiple
            item-title="name"
            item-value="id"
            auto-select-first="exact"
            :return-object="true"
            :error="!!errorSelectedTeacher"
            :error-messages="errorSelectedTeacher"
          ></v-select
        ></v-col>
      </v-row>
      <v-row v-if="displayTableTeacher" no-gutters class="ga-2">
        <v-data-table
          class="w-100"
          :loading="isLoading as boolean"
          :headers="headers"
          :items="teachers"
          :items-per-page="queryParamEntity.limit"
        >
          <template v-slot:top>
            <h3>Keets qua tim kiem</h3>
          </template>
          <template v-slot:item.actions="{ item }">
            <div class="d-flex ga-2">
              <div
                @click="
                  addTeacher(item.id, `${item.firstName} ${item.lastName}`)
                "
              >
                <v-icon v-tooltip="'Thêm'">mdi-plus</v-icon>
              </div>
              <a target="blank" :href="`${SCHOOL_ROUTE.TEACHERS}/${item.id}`">
                <v-icon v-tooltip="'Xem chi tiết'">mdi-arrow-right</v-icon>
              </a>
            </div>
          </template>
          <template v-slot:bottom>
            <div class="text-center pt-2">
              <v-pagination
                v-model="queryParamEntity.page"
                :length="Math.ceil(metaDataTeacher.total / PAGE_LIMIT_DEFAULT)"
              ></v-pagination>
            </div>
          </template>
        </v-data-table>
      </v-row>

      <div class="d-flex justify-end">
        <v-btn
          v-if="props.mode === MODE_FORM_UPDATE"
          text="Xoá"
          color="error"
          @click="onDelete"
        ></v-btn>
        <v-btn
          class="mx-2"
          color="primary"
          type="submit"
          @keydown.ctrl.enter="onSubmit"
        >
          Lưu dữ liệu
        </v-btn>
      </div>
    </v-form>
  </v-card>
</template>
