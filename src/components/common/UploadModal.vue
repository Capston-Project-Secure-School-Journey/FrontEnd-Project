<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import axios from "axios";
import { SCHOOL_TOKEN } from "~/constants/authentication";

const props = defineProps({
  entity: { type: String, required: true },
});

const schoolApp = SchoolApp();
const config = useRuntimeConfig();
const isVisibleDialog = ref<boolean>(false);
const file = ref(null);
const loading = ref(false);

const close = () => {
  isVisibleDialog.value = false;
  file.value = null;
};

const fileRule = (value) => {
  return !!value || "Vui lòng chọn file";
};
function getApiUrl() {
  switch (props.entity) {
    case "teacher":
      return "api/teachers/import-data";
    case "class":
      return "api/classes/import-data";
    case "student":
      return "api/students/import-data";
    default:
      return "";
  }
}
async function uploadFile() {
  if (!file.value) {
    schoolApp.showToastError("Vui lòng chọn tệp");
    return;
  }
  if (!getApiUrl()) {
    schoolApp.showToastError("Loại thực thể không hợp lệ");
    return;
  }

  const url = `${config.public.API_BASE_URL}/${getApiUrl()}`;
  const formData = new FormData();
  formData.append("file", file.value);

  loading.value = true;

  await axios
    .post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: getToken(SCHOOL_TOKEN),
      },
    })
    .then(() => {
      schoolApp.showToastSuccess("Tải lên thành công");
      isVisibleDialog.value = false;
    })
    .catch((err) => {
      schoolApp.showToastError(err.error);
    })
    .finally(() => {
      loading.value = false;
    });
}
</script>
<template>
  <v-btn
    class="btn-primary"
    prepend-icon="mdi-upload"
    :onclick="() => (isVisibleDialog = true)"
    >Tai len</v-btn
  >
  <v-dialog v-model="isVisibleDialog" max-width="500">
    <v-card>
      <v-card-title>
        <span class="headline">Tải lên</span>
      </v-card-title>
      <v-card-text>
        <v-file-input
          v-model="file"
          label="Chọn file để upload"
          outlined
          dense
          :rules="[fileRule]"
          accept=".csv,.xlsx,.xls"
        ></v-file-input>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="close">Hủy</v-btn>
        <v-btn
          color="primary"
          :loading="loading"
          @click="uploadFile"
          :disabled="!file"
          >Upload</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.v-card-title {
  justify-content: center;
}
</style>
