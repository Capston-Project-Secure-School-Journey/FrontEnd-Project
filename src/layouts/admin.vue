<script lang="ts" setup>
import { USER_TYPE_ENUM } from "~/constants/authentication";
import { ADMIN_MENU } from "~/constants/route";
import { AdminAuthStore } from "~/stores/admin/auth";

const storeAdmin = AdminAuthStore();
const route = useRoute();

const { requestPermission } = useFirebaseMessaging();

onMounted(() => {
  requestPermission();
});

const isOpen = ref<boolean>(true);

const logout = () => {
  storeAdmin.logout(USER_TYPE_ENUM.ADMIN);
};

const messageShow = ref<boolean>(false);
const snackbarMessage = ref<string>("");
const snackbarTitle = ref<string>("");

if (typeof window !== "undefined") {
  const channel = new BroadcastChannel("fcm_channel");
  channel.onmessage = (event) => {
    const { title, body } = event.data;
    snackbarTitle.value = title;
    snackbarMessage.value = body;
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

    <v-snackbar
      id="notification_status"
      v-model="messageShow"
      :location="'top right'"
      :title="snackbarTitle"
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
