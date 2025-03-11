<script setup lang="ts">
import { useForm } from "vee-validate";
import {
  GENDER_OPTIONS,
  MODE_FORM_CREATE,
  MODE_FORM_UPDATE,
} from "~/constants/common";
import { SCHOOL_ROUTE } from "~/constants/route";
import type { OptionSelect } from "~/entities/common";
import type { TeacherEntity } from "~/entities/school/teacher";
import {
  createTeacherSchema,
  updateTeacherSchema,
} from "~/schemas/school/teacher.schem";
import { TeacherSchoolStore } from "~/stores/school/teacher";

interface TeacherFormProps {
  mode: string;
  teacher?: TeacherEntity;
}
const props = withDefaults(defineProps<TeacherFormProps>(), {
  mode: MODE_FORM_CREATE,
});

const emits = defineEmits(["submit", "delete"]);

const { defineField, setFieldValue, handleSubmit, errors } = useForm({
  validationSchema:
    props.mode === MODE_FORM_CREATE ? createTeacherSchema : updateTeacherSchema,
});

const teacherSchoolStore = TeacherSchoolStore();
const isLoading = computed(() => teacherSchoolStore.isLoading);
const isSucceed = computed(() => teacherSchoolStore.isSucceed);
const errorsApi = computed(() => teacherSchoolStore.errors);
const display = ref<boolean>(false);

const [firstName] = defineField("firstName");
const [lastName] = defineField("lastName");
const [dateOfBirth] = defineField("dateOfBirth");
const dateOfBirthSelected = ref<Date>(new Date());

const [gender] = defineField("gender");
const genderSelected = ref<OptionSelect>(GENDER_OPTIONS[0]);
const [phoneNumber] = defineField("phoneNumber");
const [email] = defineField("email");

const updateDateOfBirth = () => {
  dateOfBirth.value = convertDateTimeServer(
    dateOfBirthSelected.value.toLocaleDateString().split("T")[0]
  );
};

const onSubmit = handleSubmit(async () => {
  const entity: TeacherEntity = {
    firstName: firstName.value,
    lastName: lastName.value,
    dateOfBirth: dateOfBirth.value,
    phoneNumber: phoneNumber.value,
    email: email.value,
    gender: gender.value ?? Number(GENDER_OPTIONS[0].id),
  };

  if (props.mode === MODE_FORM_CREATE) {
    await teacherSchoolStore.createTeacher(entity);

    if (!isLoading.value && isSucceed.value) {
      navigateTo(SCHOOL_ROUTE.TEACHERS);
    } else {
      display.value = true;
    }
  } else {
    emits("submit", entity);
  }
});

const setupForCreate = () => {
  setFieldValue("gender", Number(genderSelected.value.id));
  setFieldValue(
    "dateOfBirth",
    dateOfBirthSelected.value.toISOString().split("T")[0]
  );
};

const setupForUpdate = () => {
  setFieldValue("firstName", props.teacher?.firstName);
  setFieldValue("lastName", props.teacher?.lastName);
  setFieldValue("dateOfBirth", props.teacher?.dateOfBirth);
  dateOfBirthSelected.value = new Date(props.teacher?.dateOfBirth);
  setFieldValue("phoneNumber", props.teacher?.phoneNumber);
  setFieldValue("gender", props.teacher?.gender);
  genderSelected.value =
    GENDER_OPTIONS.filter((_) => _.id === props.teacher?.gender)?.[0] ??
    GENDER_OPTIONS[0];

  setFieldValue("email", props.teacher?.email);
};

const genderOptionChange = (data: OptionSelect) => {
  gender.value = data.id;
};

const onDelete = () => {
  emits("delete");
};

onMounted(async () => {
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
      <div class="h-100" @click="navigateTo(SCHOOL_ROUTE.TEACHERS)">
        <v-icon>mdi-arrow-left</v-icon>
      </div>
      <h2>
        {{
          props.mode === MODE_FORM_CREATE
            ? "Tạo mới Giáo viên"
            : "Chỉnh sửa Giáo viên"
        }}
      </h2>
    </div>
    <h3>Thông tin Giáo viên</h3>
    <v-form @submit.prevent="onSubmit" class="d-flex flex-column w-100 ga-2">
      <v-row no-gutters class="ga-2">
        <v-col>
          <v-text-field
            label="Họ (Bắt buộc)"
            v-model="firstName"
            name="firstName"
            :rules="[() => errors.firstName || true]"
          />
        </v-col>
        <v-col>
          <v-text-field
            label="Tên (Bắt buộc)"
            v-model="lastName"
            name="lastName"
            :rules="[() => errors.lastName || true]"
          />
        </v-col>
      </v-row>
      <v-row no-gutters class="ga-2">
        <v-col>
          <v-select
            auto-select-first="exact"
            label="Giới tính"
            v-model="genderSelected"
            :items="GENDER_OPTIONS"
            item-title="name"
            item-value="id"
            :return-object="true"
            @update:model-value="genderOptionChange"
          ></v-select>
        </v-col>
        <v-col>
          <v-date-input
            label="Ngày sinh"
            v-model="dateOfBirthSelected"
            name="dateOfBirth"
            prepend-icon=""
            prepend-inner-icon="$calendar"
            @update:model-value="updateDateOfBirth"
            :rules="[() => errors.dateOfBirth || true]"
          ></v-date-input>
        </v-col>
      </v-row>
      <v-row no-gutters class="ga-2">
        <v-col>
          <v-text-field
            label="Số điện thoại"
            v-model="phoneNumber"
            name="phoneNumber"
            :rules="[() => errors.phoneNumber || true]"
          />
        </v-col>
        <v-col>
          <v-text-field
            label="Email"
            v-model="email"
            name="email"
            :rules="[() => errors.email || true]"
          />
        </v-col>
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
