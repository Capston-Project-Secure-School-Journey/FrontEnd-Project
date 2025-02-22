<script lang="ts" setup>
import { SCHOOL_ROUTE, ADMIN_ROUTE } from "~/constants/route";

definePageMeta({
  layout: "default",
  name: "School Security and Safety in Transportation",
});

const navigate = (screen: string) => {
  navigateTo({ path: screen });
};
</script>
<template>
  <v-container class="h-screen d-flex align-center justify-center">
    <v-card
      class="d-flex flex-column ga-4 align-center justify-between py-8"
      style="width: 300px; min-width: 300px"
    >
      <h2 class="w-full text-center">Đăng nhập</h2>
      <v-row class="d-flex ga-2">
        <v-btn :onclick="() => navigate(SCHOOL_ROUTE.LOGIN)">Admin</v-btn>
      </v-row>
    </v-card>
  </v-container>
</template>
