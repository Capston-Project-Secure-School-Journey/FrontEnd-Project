<script lang="ts" setup>
import { USER_TYPE_ENUM } from "~/constants/authentication";
import { SCHOOL_MENU } from "~/constants/route";
import type { MenuItemEntity } from "~/entities/common";
import { SchoolAuthStore } from "~/stores/school/auth";
import NotificationButton from "~/components/common/NotificationButton.vue";

const schoolAuthStore = SchoolAuthStore();
const route = useRoute();
const isOpen = ref<boolean>(true);
const menu = ref<MenuItemEntity[]>(SCHOOL_MENU);

const logout = () => {
  schoolAuthStore.logout(USER_TYPE_ENUM.SCHOOL_ADMIN);
};
</script>
<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar>
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="isOpen = !isOpen"></v-app-bar-nav-icon>
      </template>
      <template v-slot:append>
        <NotificationButton />
        <v-btn icon="mdi-logout" :onclick="logout"></v-btn>
      </template>
    </v-app-bar>

    <v-navigation-drawer v-model="isOpen">
      <v-list>
        <v-list-item title="Hi Admin" subtitle="School Admin"></v-list-item>
        <v-divider></v-divider>
        <v-list-item
          v-for="item in menu"
          :active="route.fullPath === item.url"
          :prepend-icon="item.icon"
          :title="item.label"
          color="primary"
          nav
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

<style scoped>
.notification-dropdown {
  max-height: 400px;
  overflow-y: auto;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
