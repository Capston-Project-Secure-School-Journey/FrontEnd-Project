<script setup lang="ts">
import { useForm } from "vee-validate";
import { MODE_FORM_CREATE, MODE_FORM_UPDATE } from "~/constants/common";
import { SCHOOL_TYPE_OPTIONS } from "~/constants/school";
import type { AdminSchoolEntity } from "~/entities/admin/school";
import type { OptionSelect } from "~/entities/common";
import {
  createSchoolSchema,
  updateSchoolSchema,
} from "~/schemas/admin/school.shema";
import Toast from "~/components/common/Toast.vue";
import { AdminSchoolStore } from "~/stores/admin/school";
import { ADMIN_ROUTE } from "~/constants/route";
import SearchAddressInput from "~/components/common/SearchAddressInput.vue";

interface SchoolFormProps {
  mode: string;
  school?: AdminSchoolEntity;
}
const props = withDefaults(defineProps<SchoolFormProps>(), {
  mode: MODE_FORM_CREATE,
});

const { defineField, setFieldValue, handleSubmit, errors } = useForm({
  validationSchema:
    props.mode === MODE_FORM_CREATE ? createSchoolSchema : updateSchoolSchema,
});
const adminSchoolStore = AdminSchoolStore();
const isLoading = computed(() => adminSchoolStore.isLoading);
const isSucceed = computed(() => adminSchoolStore.isSucceed);
const errorsApi = computed(() => adminSchoolStore.errors);
const updateStatus = ref<boolean>(false);
const display = ref<boolean>(false);

const [name] = defineField("name");
const [schoolType] = defineField("schoolType");
const schoolTypeSelected = ref<OptionSelect>(SCHOOL_TYPE_OPTIONS[0]);
const [schoolDescription] = defineField("schoolDescription");
const [address] = defineField("address");
const [morningStarttime] = defineField("morningStarttime");
const [morningEndtime] = defineField("morningEndtime");
const [afternoonEndtime] = defineField("afternoonEndtime");
const [afternoonStarttime] = defineField("afternoonStarttime");
const [email] = defineField("email");
const [phoneNumber] = defineField("phoneNumber");
const [schoolAdminUserName] = defineField("schoolAdminUserName");
const [schoolAdminPassword] = defineField("schoolAdminPassword");

const hasApiKey = ref<boolean>(true);

onMounted(async () => {
  if (props.mode === MODE_FORM_CREATE) {
    setupForCreate();
  } else {
    setupForUpdate();
  }
});

const setupForCreate = () => {
  setFieldValue("schoolType", schoolTypeSelected.value.id);
};

const setupForUpdate = () => {
  if (!props.school) return;
  setFieldValue("name", props.school?.schoolName);
  setFieldValue("address", props.school?.address);
  setFieldValue("schoolType", props.school?.schoolType);

  schoolTypeSelected.value =
    SCHOOL_TYPE_OPTIONS.filter((_) => _.id === props.school?.schoolType)?.[0] ??
    SCHOOL_TYPE_OPTIONS[0];

  setFieldValue("schoolDescription", props.school?.schoolDescription);
  setFieldValue("morningStarttime", props.school?.morningStartTime);
  setFieldValue("morningEndtime", props.school?.morningEndTime);
  setFieldValue("afternoonEndtime", props.school?.afternoonEndTime);
  setFieldValue("afternoonStarttime", props.school?.afternoonStartTime);
  setFieldValue("email", props.school?.email);
  setFieldValue("phoneNumber", props.school?.phoneNumber);
  setFieldValue("schoolAdminUserName", props.school?.schoolAdminUserName);
};

const onSubmit = handleSubmit(async () => {
  let entity: AdminSchoolEntity = {
    schoolType: schoolType.value ?? 0,
    schoolName: name.value?.trim(),
    schoolDescription: schoolDescription.value ?? "",
    address: address.value,
    morningStartTime: morningStarttime.value?.trim(),
    morningEndTime: morningEndtime.value?.trim(),
    afternoonEndTime: afternoonEndtime.value?.trim(),
    afternoonStartTime: afternoonStarttime.value?.trim(),
    email: email.value,
    phoneNumber: phoneNumber.value,
    schoolAdminUserName: schoolAdminUserName.value,
  };

  if (props.mode === MODE_FORM_CREATE && schoolAdminPassword.value) {
    entity.schoolAdminPassword = schoolAdminPassword.value;
  }

  if (props.mode === MODE_FORM_CREATE) {
    await adminSchoolStore.createSchool(entity);

    if (!isLoading.value && isSucceed.value) {
      navigateTo(ADMIN_ROUTE.SCHOOLS);
    } else {
      display.value = true;
    }
  } else {
    updateStatus.value = false;
    await adminSchoolStore.updateSchool(props.school?.id, entity);

    if (!isLoading.value && isSucceed.value) {
      updateStatus.value = true;
    }
  }
});

const schoolTypeOptionChange = (data: OptionSelect) => {
  schoolType.value = data.id;
};

const getAddress = (data: string) => {
  address.value = data;
};
</script>
<template>
  <v-card class="w-100 d-flex flex-column pa-2 ga-4">
    <v-snackbar id="loginFailed" v-model="display" :location="'top right'">
      {{ errorsApi?.message || "" }}
      <template v-slot:actions>
        <v-btn color="pink" variant="text" @click="display = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <div class="d-flex ga-2 align-center">
      <div class="h-100" @click="navigateTo(ADMIN_ROUTE.SCHOOLS)">
        <v-icon>mdi-arrow-left</v-icon>
      </div>
      <h2>
        {{
          props.mode === MODE_FORM_CREATE
            ? "Tạo mới Trường học"
            : "Chỉnh sửa Trường học"
        }}
      </h2>
    </div>
    <h3>Thông tin trường học</h3>
    <v-form @submit.prevent="onSubmit" class="d-flex flex-column w-100 ga-2">
      <v-row no-gutters class="ga-2">
        <v-col>
          <v-text-field
            label="Tên (Bắt buộc)"
            v-model="name"
            name="name"
            :rules="[() => errors.name || true]"
          />
        </v-col>
        <v-col>
          <v-select
            auto-select-first="exact"
            label="Cấp"
            v-model="schoolTypeSelected"
            :items="SCHOOL_TYPE_OPTIONS"
            item-title="name"
            item-value="id"
            :return-object="true"
            @update:model-value="schoolTypeOptionChange"
          ></v-select>
        </v-col>
      </v-row>

      <v-row no-gutters class="ga-2">
        <v-col>
          <v-text-field
            label="Email (Bắt buộc)"
            v-model="email"
            name="email"
            :rules="[() => errors.email || true]"
          />
        </v-col>
        <v-col>
          <v-text-field
            label="Số điện thoại (Bắt buộc)"
            v-model="phoneNumber"
            name="phoneNumber"
            :rules="[() => errors.phoneNumber || true]"
          />
        </v-col>
      </v-row>

      <v-row no-gutters class="ga-2">
        <v-col>
          <SearchAddressInput v-model="address" v-on:get-address="getAddress" />
        </v-col>
      </v-row>

      <v-row no-gutters class="ga-2">
        <v-col>
          <v-text-field
            label="Thời gian bắt đầu ca sáng (Bắt buộc)"
            v-model="morningStarttime"
            hint="Ví dụ: 07:00:00"
            name="morningStarttime"
            :rules="[() => errors.morningStarttime || true]"
          />
        </v-col>
        <v-col>
          <v-text-field
            label="Thời gian kết thúc ca sáng (Bắt buộc)"
            v-model="morningEndtime"
            name="morningEndtime"
            hint="Ví dụ: 11:30:00"
            :rules="[() => errors.morningEndtime || true]"
          />
        </v-col>
      </v-row>

      <v-row no-gutters class="ga-2">
        <v-col>
          <v-text-field
            label="Thời gian bắt đầu ca chiều (Bắt buộc)"
            v-model="afternoonStarttime"
            hint="Ví dụ: 13:00:00"
            name="afternoonStarttime"
            :rules="[() => errors.afternoonStarttime || true]"
          />
        </v-col>
        <v-col>
          <v-text-field
            label="Thời gian kết thúc ca chiều (Bắt buộc)"
            v-model="afternoonEndtime"
            name="afternoonEndtime"
            hint="Ví dụ: 17:30"
            :rules="[() => errors.afternoonEndtime || true]"
          />
        </v-col>
      </v-row>

      <v-row no-gutters class="ga-2">
        <v-textarea label="Mô tả thêm" v-model="schoolDescription"></v-textarea>
      </v-row>

      <h3>Thông tin tài khoản quản trị viên</h3>
      <v-row no-gutters class="ga-2">
        <v-col>
          <v-text-field
            :disabled="props.mode === MODE_FORM_UPDATE"
            label="Tên đăng nhập (Bắt buộc)"
            v-model="schoolAdminUserName"
            name="schoolAdminUserName"
            :rules="[() => errors.schoolAdminUserName || true]"
          />
        </v-col>
        <v-col>
          <v-text-field
            v-if="props.mode === MODE_FORM_CREATE"
            label="Mật khẩu (Bắt buộc)"
            v-model="schoolAdminPassword"
            name="schoolAdminPassword"
            hint="Mật khẩu từ 8 kí tự trở lên, kết hợp số và ký hiệu."
            :rules="[() => errors.schoolAdminPassword || true]"
          />
        </v-col>
      </v-row>

      <div class="d-flex justify-end">
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
    <Toast
      id="toastGGMapAPI"
      :display="!hasApiKey"
      message="Vui lòng cài đặt GOOGLE MAP API KEY"
    />
    <Toast
      id="updateSuccessForm"
      :display="updateStatus"
      message="Cập nhật dữ liệu thành công"
    />
  </v-card>
</template>
