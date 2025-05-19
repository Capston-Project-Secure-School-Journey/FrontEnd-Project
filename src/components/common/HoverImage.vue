<script lang="ts" setup>
import { useAttrs } from "vue";
const attrs = useAttrs();
const emits = defineEmits(["click"]);
const combinedProps = computed(() => ({
  ...attrs,
  class: `position-relative d-flex align-center justify-center ${
    attrs.class ?? ""
  }`,
}));
</script>
<template>
  <v-hover v-slot="{ isHovering, props }">
    <div v-bind="{ ...props, ...combinedProps }">
      <slot />
      <v-overlay
        :model-value="!!isHovering"
        class="position-absolute top-0 left-0 bottom-0 right-0 align-center justify-center !bg-opacity-40 !bg-black"
        scrim="primary"
        contained
      >
        <v-btn
          variant="flat"
          icon="mdi-eye"
          color="white"
          class="hover:bg-opacity-75"
          @click="() => emits('click')"
        ></v-btn>
      </v-overlay>
    </div>
  </v-hover>
</template>
<style scoped>
.hover\:bg-opacity-75:hover {
  background-color: rgba(0, 0, 0, 0.5) !important;
}
</style>
