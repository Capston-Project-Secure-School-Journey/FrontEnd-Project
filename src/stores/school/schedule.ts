import {
  cloneScheduleDateApi,
  cloneScheduleWeekApi,
  createScheduleApi,
  deleteDetailScheduleDateApi,
  getDetailScheduleDateApi,
  getScheduleApi,
  updateDetailScheduleDateApi,
} from "~/api/school/schedule";
import type {
  CreateScheduleEntity,
  EventDetailEntity,
  EventDisplayEntity,
  ScheduleMonthEntity,
} from "~/entities/school/schedule";

interface State {
  isLoading: Boolean;
  isSucceed: Boolean;
  errors: string | null;
  schedule: ScheduleMonthEntity;
  events: EventDisplayEntity[];
  scheduleData: EventDetailEntity[];
}

const defaultState: State = {
  isLoading: false,
  isSucceed: false,
  errors: null,
  schedule: {},
  events: [],
  scheduleData: [],
};

export const SchoolScheduleStore = defineStore("SchoolScheduleStore", {
  state: (): State => Object.assign(defaultState, getErrorObjectStore()),

  actions: {
    resetState() {
      this.$state = defaultState;
    },

    /**
     * get schedule by date
     *
     * @param date date get schedule
     */
    async getSchedule(date: string) {
      this.$state.isLoading = true;
      this.$state.isSucceed = false;
      await getScheduleApi(date)
        .then((result) => {
          this.$state.schedule = result;
          if (this.$state.schedule) {
            const dataEvents = mappingSchedule(this.$state.schedule);
            this.$state.events = dataEvents as EventDisplayEntity[];
          }
        })
        .catch((err) => {
          this.$state.errors = err.message;
        })
        .finally(() => {
          this.$state.isLoading = false;
        });
    },

    /**
     * create schedule
     *
     * @param data create schedule data
     */
    async createSchedule(data: CreateScheduleEntity) {
      this.$state.isLoading = true;
      this.$state.isSucceed = false;
      await createScheduleApi(data)
        .then((result) => {
          this.$state.isSucceed = true;
        })
        .catch((err) => {
          this.$state.errors = err.message;
        })
        .finally(() => {
          this.$state.isLoading = false;
        });
    },

    async getDetailScheduleDate(date: string) {
      this.$state.isLoading = true;
      this.$state.isSucceed = false;

      await getDetailScheduleDateApi(date)
        .then((result) => {
          this.$state.scheduleData = result.data;
        })
        .catch((err) => {
          this.$state.errors = err.message;
        })
        .finally(() => {
          this.$state.isLoading = false;
        });
    },

    async updateDetailScheduleDate(data: EventDetailEntity) {
      this.$state.isLoading = true;
      this.$state.isSucceed = false;

      await updateDetailScheduleDateApi(data)
        .then(() => {
          this.$state.isSucceed = true;
        })
        .catch((err) => {
          this.$state.errors = err.message;
        })
        .finally(() => {
          this.$state.isLoading = false;
        });
    },

    async deleteDetailScheduleDate(id: string) {
      this.$state.isLoading = true;
      this.$state.isSucceed = false;

      await deleteDetailScheduleDateApi(id)
        .then(() => {
          this.$state.isSucceed = true;
        })
        .catch((err) => {
          this.$state.errors = err.message;
        })
        .finally(() => {
          this.$state.isLoading = false;
        });
    },

    async cloneScheduleDate(data: object) {
      this.$state.isLoading = true;
      this.$state.isSucceed = false;

      await cloneScheduleDateApi(data)
        .then(() => {
          this.$state.isSucceed = true;
        })
        .catch((err) => {
          this.$state.errors = err.message;
        })
        .finally(() => {
          this.$state.isLoading = false;
        });
    },

    async cloneScheduleWeek(data: object) {
      this.$state.isLoading = true;
      this.$state.isSucceed = false;

      await cloneScheduleWeekApi(data)
        .then(() => {
          this.$state.isSucceed = true;
        })
        .catch((err) => {
          this.$state.errors = err.message;
        })
        .finally(() => {
          this.$state.isLoading = false;
        });
    },
  },
});
