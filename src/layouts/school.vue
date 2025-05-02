<script lang="ts" setup>
import { USER_TYPE_ENUM } from "~/constants/authentication";
import { USER_TYPE_NAME } from "~/constants/authentication";
import { SCHOOL_MENU } from "~/constants/route";
import type { MenuItemEntity } from "~/entities/common";
import { SchoolAuthStore } from "~/stores/school/auth";

const schoolAuthStore = SchoolAuthStore();

const route = useRoute();
const isOpen = ref<boolean>(true);
const menu = ref<MenuItemEntity[]>(SCHOOL_MENU);
const me = computed(() => schoolAuthStore.me);

const logout = () => {
  schoolAuthStore.logout(USER_TYPE_ENUM.SCHOOL_ADMIN);
};

const { requestPermission } = useFirebaseMessaging();

onMounted(() => {
  requestPermission();
});

const messageShow = ref<boolean>(false);
const snackbarMessage = ref<string>("");

if (typeof window !== "undefined") {
  const channel = new BroadcastChannel("fcm_channel");
  channel.onmessage = (event) => {
    const { title, body } = event.data;
    console.log(title, body);

    snackbarMessage.value = `${title}: ${body}`;
    messageShow.value = true;
  };
}
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

    <v-snackbar
      id="notification_status"
      v-model="messageShow"
      :location="'top right'"
    >
      {{ snackbarMessage }}
      <template v-slot:actions>
        <v-btn color="pink" variant="text" @click="messageShow = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-layout>
</template>
