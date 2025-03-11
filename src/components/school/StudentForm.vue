<script setup lang="ts">
import { useForm } from "vee-validate";
import { date } from "zod";
import {
  GENDER_OPTIONS,
  MODE_FORM_CREATE,
  MODE_FORM_UPDATE,
} from "~/constants/common";
import { SCHOOL_ROUTE } from "~/constants/route";
import type { OptionSelect } from "~/entities/common";
import type { ClassEntity, GradeEntity } from "~/entities/school/class";
import type { StudentEntity } from "~/entities/school/student";
import {
  createStudentSchema,
  updateStudentSchema,
} from "~/schemas/school/student.schema";
import { ClassSchoolStore } from "~/stores/school/class";

interface ClassFormProps {
  tempId?: number;
  mode: string;
  student?: StudentEntity;
  grades?: GradeEntity[];
}

// Props & emits
const props = withDefaults(defineProps<ClassFormProps>(), {
  mode: MODE_FORM_CREATE,
});

const emits = defineEmits(["submit", "delete"]);

// Validate
const { defineField, setFieldValue, handleSubmit, errors } = useForm({
  validationSchema:
    props.mode === MODE_FORM_CREATE ? createStudentSchema : updateStudentSchema,
});

// Class
const classSchoolStore = ClassSchoolStore();
const classDetail = ref<ClassEntity>();
const classId = ref<string>();
const classError = ref<string>("");

// Student
const [firstName] = defineField("firstName");
const [lastName] = defineField("lastName");
const [dateOfBirth] = defineField("dateOfBirth");
const [gender] = defineField("gender");
const genderSelected = ref<OptionSelect>(GENDER_OPTIONS[0]);
const dateOfBirthSelected = ref<Date>(new Date());

// Handle function
const updateDateOfBirth = () => {
  dateOfBirth.value = convertDateTimeServer(
    dateOfBirthSelected.value.toLocaleDateString().split("T")[0]
  );
};

const handleSearchClass = async () => {
  if (!classId.value) {
    classError.value = "Mã lớp là trường bắt buộc";
    return;
  }
  await classSchoolStore.getDetailClass(classId.value);
  classDetail.value = classSchoolStore.class;
  if (!classDetail.value) {
    classError.value = "Không tìm thấy Lớp học này vui lòng thử lại";
    return;
  }

  classError.value = "";
};

const genderOptionChange = (data: OptionSelect) => {
  gender.value = data.id;
};

const onSubmit = handleSubmit(async () => {
  let entity: StudentEntity = {
    firstName: firstName.value,
    lastName: lastName.value,
    dateOfBirth: dateOfBirth.value,
    gender: Number(genderSelected.value.id),
  };

  if (props.tempId && props.mode === MODE_FORM_CREATE) {
    entity = Object.assign({ key: props.tempId }, entity);
  }

  if (props.mode === MODE_FORM_UPDATE) {
    if (!classId.value || !classDetail.value) {
      classError.value = "Mã lớp là trường bắt buộc";
      return;
    } else {
      entity.classId = classDetail.value.id;
      classError.value = "";
    }
  }

  emits("submit", entity);
});

const onDelete = () => {
  emits("delete");
};

const setupForCreate = () => {
  updateDateOfBirth();
  if (props.student) {
    setFieldValue("firstName", props.student.firstName);
    setFieldValue("lastName", props.student.lastName);
    setFieldValue("gender", props.student.gender);
    genderSelected.value =
      GENDER_OPTIONS.filter((_) => _.id === props.student?.gender)?.[0] ??
      GENDER_OPTIONS[0];
    setFieldValue("dateOfBirth", props.student.dateOfBirth);
    dateOfBirthSelected.value = new Date(props.student.dateOfBirth);
  }
};

const { formattedTime, start, stop, reset } = useCountdown(30 * 60);

const setupForUpdate = () => {
  if (props.student) {
    setFieldValue("firstName", props.student.firstName);
    setFieldValue("lastName", props.student.lastName);
    setFieldValue("gender", props.student.gender);
    genderSelected.value =
      GENDER_OPTIONS.filter((_) => _.id === props.student?.gender)?.[0] ??
      GENDER_OPTIONS[0];
    setFieldValue("dateOfBirth", props.student.dateOfBirth);
    classId.value = props.student.classId;
    dateOfBirthSelected.value = new Date(props.student.dateOfBirth);
    handleSearchClass();

    start();
  }
};

const reloadPage = () => {
  location.reload();
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
    <v-form
      @submit.prevent="onSubmit"
      class="d-flex flex-column w-100 ga-2 pa-2"
    >
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

      <v-row no-gutters class="ga-2" v-if="props.mode === MODE_FORM_UPDATE">
        <v-col
          ><v-text-field
            label="Mã lớp (Bắt buộc)"
            v-model="classId"
            name="classId"
            :rules="[() => classError || true]"
          />
          <v-btn class="mx-2 mb-4" color="primary" :onclick="handleSearchClass">
            Xác nhận và Tìm kiếm
          </v-btn>
          <div class="d-flex flex-column align-center justify-center">
            <p class="d-flex ga-2">
              Thời gian hết hạn mã:
              <strong class="text-red">{{ formattedTime }}</strong>
              <v-icon :onclick="reloadPage">mdi-reload</v-icon>
            </p>
            <v-img
              :width="300"
              aspect-ratio="1/1"
              cover
              :src="props.student?.qrImageUrl"
            ></v-img>
          </div>
        </v-col>
        <v-col>
          <v-card class="pa-2 ga-1">
            <v-card-subtitle>Thông tin lớp học</v-card-subtitle>
            <v-card-text
              ><strong>Mã lớp:</strong> {{ classDetail?.id }}</v-card-text
            >
            <v-card-text
              ><strong>Tên lớp:</strong>
              {{ classDetail?.className }}</v-card-text
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
        </v-col>
      </v-row>

      <v-row no-gutters class="d-flex justify-end ga-2">
        <v-spacer></v-spacer>
        <v-btn
          v-if="props.mode === MODE_FORM_UPDATE"
          text="Xoá"
          color="error"
          @click="onDelete"
        ></v-btn>
        <v-btn
          v-if="props.mode === MODE_FORM_CREATE"
          text="Lưu"
          type="submit"
          color="primary"
          @click="onSubmit"
        ></v-btn>
        <v-btn
          text="Lưu"
          type="submit"
          color="primary"
          :disabled="!classDetail || !classId"
          @click="onSubmit"
        ></v-btn>
      </v-row>
    </v-form>
  </v-card>
</template>
