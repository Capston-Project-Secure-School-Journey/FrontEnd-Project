import { createScheduleApi, getScheduleApi } from "~/api/school/schedule";
import type { ErrorEntity } from "~/entities/api-error";
import type {
  CreateScheduleEntity,
  EventDisplayEntity,
  ScheduleMonthEntity,
} from "~/entities/school/schedule";

interface State {
  isLoading: Boolean;
  isSucceed: Boolean;
  errors: ErrorEntity | null;
  schedule: ScheduleMonthEntity;
  events: EventDisplayEntity[];
}

const defaultState: State = {
  isLoading: false,
  isSucceed: false,
  errors: null,
  schedule: {},
  events: [],
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
            this.$state.events = dataEvents;
          }
        })
        .catch((err) => {
          this.$state.errors = err.data;
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
        .then((result) => {})
        .catch((err) => {
          this.$state.errors = err.data;
        })
        .finally(() => {
          this.$state.isLoading = false;
        });
    },
  },
});
