<script lang="ts" setup>
import type { NotificationEntity } from "~/entities/school/notification";
import { SchoolNotificationStore } from "~/stores/school/notification";

const schoolNotificationStore = SchoolNotificationStore();
const countUnreadNotification = computed(
  () => schoolNotificationStore.countUnreadNotification
);
const notificationsStore = computed(
  () => schoolNotificationStore.notifications
);
const notifications = ref<NotificationEntity[]>([]);
const isLoadingSchoolNotification = computed(
  () => schoolNotificationStore.isLoading
);
const isSucceedSchoolNotification = computed(
  () => schoolNotificationStore.isSucceed
);
const currentPage = ref<number>(1);

const { requestPermission } = useFirebaseMessaging();
const messageShow = ref<boolean>(false);
const snackbarMessage = ref<string>("");

if (typeof window !== "undefined") {
  const channel = new BroadcastChannel("fcm_channel");
  channel.onmessage = async (event) => {
    const { title, body } = event.data;
    snackbarMessage.value = title;
    messageShow.value = true;
    currentPage.value = 1;
    await schoolNotificationStore.getUnreadNotification();
    await schoolNotificationStore.getListNotification(currentPage.value);
    updateArrayNotification(false);
  };
}

const handleMarkAsReadNotification = async (id: string) => {
  if (
    notifications.value.filter((notification) => notification.id === id)[0]
      .isRead
  ) {
    return;
  }

  await schoolNotificationStore.markAsReadNotification(id);
  if (!isLoadingSchoolNotification.value && isSucceedSchoolNotification.value) {
    schoolNotificationStore.updateCountUnreadNotification(true, id);
  }
};

const handleMarkAllAsRead = async () => {
  await schoolNotificationStore.markAllAsReadNotification();
  updateArrayNotification(false);
};

const handleLoadMoreNotification = async () => {
  currentPage.value += 1;
  await schoolNotificationStore.getListNotification(currentPage.value);
  updateArrayNotification(true);
};

const updateArrayNotification = (isLoadMore: boolean = true) => {
  notifications.value = isLoadMore
    ? [...notifications.value, ...notificationsStore.value]
    : notificationsStore.value;
};

onMounted(async () => {
  requestPermission();
  await schoolNotificationStore.getUnreadNotification();
  await schoolNotificationStore.getListNotification(currentPage.value);
  updateArrayNotification(false);
});
</script>
<template>
  <div>
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
    <v-menu
      activator="parent"
      :close-on-content-click="false"
      offset-y
      min-width="300"
      max-height="400"
    >
      <template #activator="{ props }">
        <v-btn class="text-none" stacked v-bind="props">
          <v-badge
            v-if="countUnreadNotification > 0"
            color="error"
            :content="countUnreadNotification.toString()"
          >
            <v-icon>mdi-bell-outline</v-icon>
          </v-badge>
          <v-icon v-else>mdi-bell-outline</v-icon>
        </v-btn>
      </template>

      <v-card min-width="200px" max-width="350px">
        <v-card-title
          class="w-full d-flex flex-row justify-space-between items-center"
        >
          <span class="text-h6 align-self-center align-center">Thông báo</span>
          <v-btn
            variant="plain"
            min-width="150px"
            class="h-full"
            append-icon="mdi-message-badge"
            @click="handleMarkAllAsRead"
          >
            Đã đọc hết
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-list>
          <v-list-item
            v-for="(notification, index) in notifications"
            :key="notification.id"
            class="cursor-pointer"
          >
            <div
              class="pa-2 rounded-lg"
              :class="notification.isRead ? '' : 'bg-primary'"
              :onclick="
                () => {
                  handleMarkAsReadNotification(notification.id);
                }
              "
            >
              <v-list-item-title class="font-weight-bold">{{
                notification.title
              }}</v-list-item-title>
              <span class="text-body-2">{{ notification.content }}</span>
              <v-list-item-subtitle class="text-end">{{
                new Date(notification.createdAt).toLocaleString()
              }}</v-list-item-subtitle>
            </div>
          </v-list-item>
          <v-list-item
            v-if="notifications.length === 0"
            class="text-center text-gray-500"
          >
            Không có thông báo
          </v-list-item>
          <v-card-actions
            v-if="notificationsStore.length > 0"
            class="d-flex justify-center"
          >
            <v-btn
              class="w-full"
              variant="outlined"
              color="primary"
              :onclick="
                () => {
                  handleLoadMoreNotification();
                }
              "
              >Tải thêm</v-btn
            >
          </v-card-actions>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>
