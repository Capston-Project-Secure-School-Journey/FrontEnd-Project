<script setup lang="ts">
import { useForm } from "vee-validate";
import { MODE_FORM_CREATE } from "~/constants/common";
import { SCHOOL_TYPE_OPTIONS } from "~/constants/school";
import type { AdminSchoolEntity } from "~/entities/admin/school";
import type { OptionSelect } from "~/entities/common";
import { schoolSchema } from "~/schemas/admin/school.shema";
import Toast from "~/components/common/Toast.vue";
import { AdminSchoolStore } from "~/stores/admin/school";
import { ADMIN_ROUTE } from "~/constants/route";

interface SchoolFormProps {
  mode: string;
  school?: AdminSchoolEntity;
}
const props = withDefaults(defineProps<SchoolFormProps>(), {
  mode: MODE_FORM_CREATE,
});

const { defineField, setFieldValue, handleSubmit, errors } = useForm({
  validationSchema: schoolSchema,
});
const adminSchoolStore = AdminSchoolStore();
const isLoading = computed(() => adminSchoolStore.isLoading);
const isSucceed = computed(() => adminSchoolStore.isSucceed);

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

const hasApiKey = ref<boolean>(true);
const placeData = ref<google.maps.places.PlaceResult | null>(null);
const inputRef = ref<HTMLInputElement>();

onMounted(async () => {
  if (props.mode === MODE_FORM_CREATE) {
    setupForCreate();
  }
  initAutocompleteInput();
});

const initAutocompleteInput = () => {
  // Check system has loaded google map yet
  if (!window.google.maps.places) {
    hasApiKey.value = false;
    return;
  }
  // Create HTMLInputElement
  inputRef.value = document.getElementById("pac-input") as HTMLInputElement;
  const options = {
    componentRestrictions: { country: "vn" },
    fields: ["formatted_address", "geometry", "name"],
  };

  const autocomplete = new google.maps.places.Autocomplete(
    inputRef.value,
    options
  );

  autocomplete.addListener("onChange", () => {
    placeData.value = autocomplete.getPlace();
    console.log("Selected place:", placeData.value);
  });
};

const setupForCreate = () => {
  setFieldValue("schoolType", schoolTypeSelected.value.id);
};

const onSubmit = handleSubmit(async () => {
  const entity: AdminSchoolEntity = {
    schooltype: schoolType.value,
    name: "Trường test",
    schooldescription: schoolDescription.value,
    address: address.value,
    morningstarttime: morningStarttime.value,
    morningendtime: morningEndtime.value,
    afternoonendtime: afternoonEndtime.value,
    afternoonstarttime: afternoonStarttime.value,
    email: email.value,
    phonenumber: phoneNumber.value,
  };

  if (props.mode === MODE_FORM_CREATE) {
    await adminSchoolStore.createSchool(entity);

    if (!isLoading.value && isSucceed.value) {
      navigateTo(ADMIN_ROUTE.SCHOOLS);
    }
  }
});

const schoolTypeOptionChange = () => {
  schoolType.value = schoolTypeSelected.value.id;
};

watch([errors], () => {
  console.log(errors.value);
});
</script>
<template>
  <v-card class="w-100 d-flex flex-column pa-2 ga-4">
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

    <v-form @submit.prevent="onSubmit" class="d-flex flex-column w-100 ga-2">
      <v-row no-gutters class="ga-2">
        <v-col>
          <v-text-field
            label="Tên"
            v-model="name"
            name="name"
            :rules="[() => errors.name || true]"
          />
        </v-col>
        <v-col>
          <v-combobox
            auto-select-first="exact"
            label="Cấp"
            v-model="schoolTypeSelected"
            :items="SCHOOL_TYPE_OPTIONS"
            item-title="name"
            item-value="id"
            :onchange="schoolTypeOptionChange"
          ></v-combobox>
        </v-col>
      </v-row>

      <v-row no-gutters class="ga-2">
        <v-col>
          <v-text-field
            label="Email"
            v-model="email"
            name="email"
            :rules="[() => errors.email || true]"
          />
        </v-col>
        <v-col>
          <v-text-field
            label="Số điện thoại"
            v-model="phoneNumber"
            name="phoneNumber"
            :rules="[() => errors.phoneNumber || true]"
          />
        </v-col>
      </v-row>

      <v-row no-gutters class="ga-2">
        <v-col>
          <v-text-field
            id="pac-input"
            placeholder="Điền địa chỉ của trường"
            v-model="address"
          />
        </v-col>
      </v-row>

      <v-row no-gutters class="ga-2">
        <v-col>
          <v-text-field
            label="Thời gian bắt đầu ca sáng"
            v-model="morningStarttime"
            hint="Ví dụ: 07:00:00"
            name="morningStarttime"
            :rules="[() => errors.morningStarttime || true]"
          />
        </v-col>
        <v-col>
          <v-text-field
            label="Thời gian kết thúc ca sáng"
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
            label="Thời gian bắt đầu ca chiều"
            v-model="afternoonStarttime"
            hint="Ví dụ: 13:00:00"
            name="afternoonStarttime"
            :rules="[() => errors.afternoonStarttime || true]"
          />
        </v-col>
        <v-col>
          <v-text-field
            label="Thời gian kết thúc ca chiều"
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
      :display="!hasApiKey"
      message="Vui lòng cài đặt GOOGLE MAP API KEY"
    />
  </v-card>
</template>
