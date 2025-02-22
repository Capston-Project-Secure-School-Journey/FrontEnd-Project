<script setup lang="ts">
const props = defineProps({
  data: {
    type: String,
    default: "",
  },
});
const emits = defineEmits(["getAddress"]);

const address = toRef(props.data);
const inputRef = ref();
const error = ref<string>("");
const autocomplete = ref<google.maps.places.Autocomplete | null>(null);
const initAutocompleteInput = () => {
  // Check system has loaded google map yet
  if (!window.google.maps.places) {
    return;
  }

  const options = {
    componentRestrictions: { country: "vn" },
    fields: ["formatted_address", "geometry", "name"],
  };
  inputRef.value = document.getElementById(
    "autocomplete-input"
  ) as HTMLInputElement;
  autocomplete.value = new google.maps.places.Autocomplete(
    inputRef.value,
    options
  );

  autocomplete.value.addListener("place_changed", () => {
    const place = autocomplete.value?.getPlace();
    if (!place?.geometry || !place?.geometry.location) {
      error.value = `Không tìm thấy địa chỉ ${place?.name} vui lòng thử lại`;

      return;
    }
    emits("getAddress", place.formatted_address);

    error.value = "";
  });
};

onMounted(() => {
  initAutocompleteInput();
});
</script>
<template>
  <v-text-field
    v-model="address"
    label="Địa chỉ"
    prepend-inner-icon="mdi-google-maps"
    id="autocomplete-input"
    placeholder="Điền địa chỉ của trường"
    :rule="[() => error || true]"
  />
</template>
