<script setup lang="ts">
import {
  SNACKBAR_COLOR,
  SNACKBAR_DANGER_STATUS,
  SNACKBAR_SUCCESS_STATUS,
} from "~/constants/common";
import type { SnackbarProp } from "~/entities/common";

const props = defineProps({
  text: {
    type: String,
    default: "",
  },
});

const emits = defineEmits(["onDisplay"]);

const copyToClipboard = () => {
  navigator.clipboard
    .writeText(props.text)
    .then(() => {
      const copyStatus: SnackbarProp = {
        status: SNACKBAR_SUCCESS_STATUS,
        message: `Sao chép thành công: ${props.text}`,
        display: true,
        color: SNACKBAR_COLOR[SNACKBAR_SUCCESS_STATUS],
      };
      emits("onDisplay", copyStatus);
    })
    .catch((err) => {
      const copyStatus: SnackbarProp = {
        status: SNACKBAR_DANGER_STATUS,
        message: `Lỗi khi sao chép: ${err}`,
        display: true,
        color: SNACKBAR_COLOR[SNACKBAR_DANGER_STATUS],
      };
      emits("onDisplay", copyStatus);
    });
};
</script>
<template>
  <div class="hover-container">
    <p>{{ props.text }}</p>
    <v-icon @click="copyToClipboard" class="copy-icon">
      mdi-content-copy
    </v-icon>
  </div>
</template>
<style lang="css" scoped>
.hover-container {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
}

.copy-icon {
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  cursor: pointer;
}

.hover-container:hover .copy-icon {
  opacity: 1;
}
</style>
