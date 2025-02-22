<script lang="ts" setup>
interface SnackbarProps {
  display: boolean;
  message?: "Đã xảy ra lỗi" | string;
  position?: "top" | string;
}

const props = defineProps<SnackbarProps>();
const display = toRef(props.display);
</script>
<template>
  <v-snackbar v-bind="$attrs" v-model="display" :location="props.position">
    {{ props.message }}
    <template v-slot:actions>
      <v-btn color="pink" variant="text" @click="display = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>
