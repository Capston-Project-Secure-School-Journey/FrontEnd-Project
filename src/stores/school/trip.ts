import {
  getDetailPickupScheduleApi,
  getDetailTripHasListStudentApi,
  getListTripCalendarApi,
} from "~/api/school/trip";
import type { ErrorEntity } from "~/entities/api-error";
import type { DriverTripEntity } from "~/entities/school/driver";
import type { EventDisplayEntity } from "~/entities/school/schedule";
import type { BasicTripEntity } from "~/entities/school/trip";
import { mappingTrip } from "~/utils/common";

interface State {
  isLoading: Boolean;
  isSucceed: Boolean;
  errors: ErrorEntity | null;
  trips: BasicTripEntity[];
  events: EventDisplayEntity[];
  driverTrips: DriverTripEntity[];
  driverTripsHasStudent: DriverTripEntity | null;
}

const defaultState: State = {
  isLoading: false,
  isSucceed: false,
  errors: null,
  trips: [],
  events: [],
  driverTrips: [],
  driverTripsHasStudent: null,
};

export const SchoolTripStore = defineStore("SchoolTripStore", {
  state: (): State => Object.assign(defaultState, getErrorObjectStore()),

  actions: {
    resetState() {
      this.$state = defaultState;
    },

    async getListTripCalendar(date: string) {
      this.$state.isLoading = true;
      this.$state.isSucceed = false;

      await getListTripCalendarApi(date)
        .then((res) => {
          this.$state.events = mappingTrip(res.data as BasicTripEntity[]);
          this.$state.isSucceed = true;
        })
        .catch((err) => {
          this.$state.errors = err;
        })
        .finally(() => {});
    },

    async getDetailTripCalendar(date: string) {
      this.$state.isLoading = true;
      this.$state.isSucceed = false;

      await getDetailPickupScheduleApi(date)
        .then((res) => {
          this.$state.driverTrips = res;
        })
        .catch((err) => {
          this.$state.errors = err;
        })
        .finally(() => {});
    },

    async getDetailTripHasListStudent(id: string) {
      this.$state.isLoading = true;
      this.$state.isSucceed = false;

      await getDetailTripHasListStudentApi(id)
        .then((res) => {
          this.$state.driverTripsHasStudent = res;
        })
        .catch((err) => {
          this.$state.errors = err;
        })
        .finally(() => {});
    },
  },
});
