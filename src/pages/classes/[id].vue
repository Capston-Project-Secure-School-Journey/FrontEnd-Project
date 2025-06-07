<script setup lang="ts">
import { MODE_FORM_UPDATE } from "~/constants/common";
import ClassForm from "~/components/school/ClassForm.vue";
import { ClassSchoolStore } from "~/stores/school/class";
import type { ClassEntity } from "~/entities/school/class";
import { SchoolMetaDataStore } from "~/stores/school/metadata";

const pageName: string = "Thông tin chi tiết lớp học";

definePageMeta({
  layout: "school",
  middleware: "auth-school",
  name: pageName,
});

document.title = pageName;

const classSchoolStore = ClassSchoolStore();
const schoolMetaDataStore = SchoolMetaDataStore();
const route = useRoute();
const classId = route.params.id;
const errors = computed(() => classSchoolStore.errors);
const isLoading = computed(() => classSchoolStore.isLoading);
const isSucceed = computed(() => classSchoolStore.isSucceed);
const classDetail = computed(() => classSchoolStore.class);
const grades = computed(() => schoolMetaDataStore.grades);
const updateStatus = ref<boolean>(false);

const submit = async (data: ClassEntity) => {
  updateStatus.value = false;

  await classSchoolStore.updateClass(classId, data);

  if (!isLoading.value && isSucceed.value) {
    updateStatus.value = true;
  }
};

onMounted(async () => {
  await schoolMetaDataStore.getDataGradeList();
  await classSchoolStore.getDetailClass(classId);
});
</script>
<template>
  <v-container fluid>
    <v-snackbar
      id="updateSuccessForm"
      v-model="updateStatus"
      :location="'top right'"
    >
      Cập nhật dữ liệu thành công
      <template v-slot:actions>
        <v-btn color="pink" variant="text" @click="updateStatus = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <ClassForm
      v-if="!isLoading && classDetail"
      :mode="MODE_FORM_UPDATE"
      :classDetail="classDetail"
      :grades="grades"
      @submit="submit"
    />
  </v-container>
</template>
