<script setup lang="ts">
const props = defineProps({
  imageUrl: {
    type: String,
    default: "",
  },
});
</script>
<template>
  <v-overlay v-bind="$attrs" class="w-100 h-100 align-center justify-center"
    ><v-img
      :src="props.imageUrl"
      height="100%"
      width="600px"
      class="rounded-md shadow-lg max-w-screen max-h-screen"
  /></v-overlay>
</template>
