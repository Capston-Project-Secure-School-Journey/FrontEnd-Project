<script lang="ts" setup>
const pageName = "Quản lý Tài xế";

definePageMeta({
  layout: "school",
  middleware: "auth-school",
  name: pageName,
});

const tab = ref<string>("one");
</script>
<template>
  <v-container class="w-100 d-flex ga-2 flex-column">
    <div class="w-100 d-flex justify-space-between">
      <h2>
        {{ pageName }}
      </h2>
    </div>
    <v-card>
      <v-tabs v-model="tab">
        <v-tab value="one">Chờ xét duyệt</v-tab>
        <v-tab value="two">Đã duyệt</v-tab>
        <v-tab value="three">Đang chờ phản hồi</v-tab>
      </v-tabs>

      <v-card-text>
        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="one"> One </v-tabs-window-item>

          <v-tabs-window-item value="two"> Two </v-tabs-window-item>

          <v-tabs-window-item value="three"> Three </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
    </v-card>
  </v-container>
</template>
