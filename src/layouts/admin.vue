<script lang="ts" setup>
import { ADMIN_MENU } from "~/constants/route";
import { AdminAuthStore } from "~/stores/admin/auth";

const storeAdmin = AdminAuthStore();
const route = useRoute();

const isOpen = ref<boolean>(true);

const logout = () => {
  storeAdmin.logout();
};
</script>
<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar>
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="isOpen = !isOpen"></v-app-bar-nav-icon>
      </template>
      <template v-slot:append>
        <v-btn icon="mdi-logout" :onclick="logout"></v-btn>
      </template>
    </v-app-bar>

    <v-navigation-drawer v-model="isOpen">
      <v-list>
        <v-list-item
          v-for="item in ADMIN_MENU"
          :active="route.fullPath === item.url"
          :title="item.label"
          :prepend-icon="item.icon"
          :onclick="() => navigateTo(item.url)"
        />
      </v-list>
    </v-navigation-drawer>

    <v-main
      class="d-flex align-center justify-center"
      style="min-height: 300px"
    >
      <slot />
    </v-main>
  </v-layout>
</template>
