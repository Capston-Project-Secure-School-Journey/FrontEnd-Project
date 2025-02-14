<script setup lang="ts">
interface Props {
  label?: string;
  error?: string;
  required?: boolean;
}

const props = defineProps<Props>();
const { error, label, required } = toRefs(props);
</script>

<template>
  <div class="mb-4">
    <h6
      v-if="!!label"
      class="block mb-2 text-sm p-label"
      :class="{ 'p-required': required }"
    >
      {{ label }}
    </h6>
    <slot />
    <span v-show="!!error" class="p-error">{{ error }}</span>
  </div>
</template>

<style lang="scss" scoped>
.p-required {
  position: relative;
  &:after {
    content: "*";
    font-size: 0.875rem;
    color: #ff3a30;
    position: absolute;
    padding-left: 6px;
  }
}

.p-label {
  color: #333333;
  font-weight: bold;

  &:hover {
    color: #2386c7;
  }
}

.p-error {
  color: #e24c4c;
}
</style>
