import { defineStore } from "pinia";
import {
  getListNotificationApi,
  getUnreadNotificationApi,
  markAllAsReadNotification,
  markAsReadNotification,
} from "~/api/school/notification";
import type { ErrorEntity } from "~/entities/api-error";
import type { NotificationEntity } from "~/entities/school/notification";

interface State {
  isLoading: Boolean;
  isSucceed: Boolean;
  errors: ErrorEntity | null;
  countUnreadNotification: number;
  notifications: NotificationEntity[];
}

const defaultState: State = {
  isLoading: false,
  isSucceed: false,
  errors: null,
  countUnreadNotification: 0,
  notifications: [],
};

export const SchoolNotificationStore = defineStore("SchoolNotificationStore", {
  state: (): State => Object.assign(defaultState, getErrorObjectStore()),

  actions: {
    resetState() {
      this.$state = defaultState;
    },

    async getUnreadNotification() {
      this.$state.isLoading = true;

      await getUnreadNotificationApi()
        .then((res) => {
          this.$state.countUnreadNotification = res;
        })
        .catch((err) => {
          this.$state.errors = err.message;
        })
        .finally(() => {
          this.$state.isLoading = false;
        });
    },

    async getListNotification(currentPage: number) {
      this.$state.isLoading = true;
      this.$state.isSucceed = false;

      await getListNotificationApi(currentPage)
        .then((res) => {
          this.$state.isSucceed = true;
          this.$state.notifications = res.data;
        })
        .catch((err) => {
          this.$state.isSucceed = false;
          this.$state.errors = err.message;
        })
        .finally(() => {
          this.$state.isLoading = false;
        });
    },

    async markAsReadNotification(id: string) {
      this.$state.isLoading = true;
      this.$state.isSucceed = false;

      await markAsReadNotification(id)
        .then(() => {
          this.$state.isSucceed = true;
        })
        .catch((err) => {
          this.$state.errors = err.message;
          this.$state.isSucceed = false;
        })
        .finally(() => {
          this.$state.isLoading = false;
        });
    },

    updateCountUnreadNotification(isDecrease: boolean, id?: string) {
      if (this.$state.countUnreadNotification > 0 && isDecrease) {
        this.$state.countUnreadNotification -= 1;
        const updateArr = this.$state.notifications;
        updateArr.forEach((notification) => {
          if (notification.id === id) {
            notification.isRead = true;
            return;
          }
        });
        this.$state.notifications = updateArr;
        return;
      }

      this.$state.countUnreadNotification += 1;
    },

    async markAllAsReadNotification() {
      this.$state.isLoading = true;
      this.$state.isSucceed = false;

      await markAllAsReadNotification()
        .then(() => {
          this.$state.isSucceed = true;
          const updateArr = this.$state.notifications;
          this.$state.notifications = updateArr.map((notification) => {
            return { ...notification, ...{ isRead: true } };
          });
          this.$state.countUnreadNotification = 0;
        })
        .catch((err) => {
          this.$state.errors = err.message;
          this.$state.isSucceed = false;
        })
        .finally(() => {
          this.$state.isLoading = false;
        });
    },
  },
});
