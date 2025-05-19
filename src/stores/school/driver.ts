import { defineStore } from "pinia";
import {
  actionApproveDriverApplicationApi,
  actionRejectDriverApplicationApi,
  actionRequestMoreInfoDriverApplicationApi,
  getDetailDriverApplicationApi,
  getListDriverApplicationApi,
} from "~/api/school/driver";
import type { DriverApplicationEntity } from "~/entities/school/driver";
import type { ErrorEntity } from "~/entities/api-error";
import type { MetaDataEntity } from "~/entities/common";

interface State {
  isLoading: Boolean;
  isSucceed: Boolean;
  errors: ErrorEntity | null;
  metaData: MetaDataEntity;
  driverApplications: DriverApplicationEntity[];
  driverApplication: DriverApplicationEntity | null;
}

const defaultState: State = {
  isLoading: false,
  isSucceed: false,
  errors: null,
  metaData: {},
  driverApplications: [],
  driverApplication: null,
};

export const SchoolDriverStore = defineStore("SchoolDriverStore", {
  state: (): State => Object.assign(defaultState, getErrorObjectStore()),

  actions: {
    resetState() {
      this.$state = defaultState;
    },

    async getListDriverApplication(params: Object) {
      this.$state.isLoading = true;
      this.$state.isSucceed = false;

      await getListDriverApplicationApi(params)
        .then((result) => {
          this.$state.metaData = result;

          this.$state.driverApplications =
            result.data as DriverApplicationEntity[];

          this.$state.isSucceed = true;
        })
        .catch((err) => {
          this.$state.errors = err.data;
        })
        .finally(() => {
          this.$state.isLoading = false;
        });
    },

    async getDetailDriverApplication(id: string) {
      this.$state.isLoading = true;
      this.$state.isSucceed = false;

      await getDetailDriverApplicationApi(id)
        .then((result) => {
          this.$state.driverApplication = result as DriverApplicationEntity;
          this.$state.isSucceed = true;
        })
        .catch((err) => {
          this.$state.errors = err.data;
        })
        .finally(() => {
          this.$state.isLoading = false;
        });
    },

    async actionApprovalDriverApplication(id: string, reason: string) {
      this.$state.isLoading = true;
      this.$state.isSucceed = false;

      await actionApproveDriverApplicationApi(id, reason)
        .then(() => {
          this.$state.isSucceed = true;
        })
        .catch((err) => {
          this.$state.errors = err.data;
        })
        .finally(() => {
          this.$state.isLoading = false;
        });
    },

    async actionRejectDriverApplication(id: string, reason: string) {
      this.$state.isLoading = true;
      this.$state.isSucceed = false;

      await actionRejectDriverApplicationApi(id, reason)
        .then(() => {
          this.$state.isSucceed = true;
        })
        .catch((err) => {
          this.$state.errors = err.data;
        })
        .finally(() => {
          this.$state.isLoading = false;
        });
    },

    async actionRequestMoreInfoDriverApplication(id: string, reason: string) {
      this.$state.isLoading = true;
      this.$state.isSucceed = false;

      await actionRequestMoreInfoDriverApplicationApi(id, reason)
        .then(() => {
          this.$state.isSucceed = true;
        })
        .catch((err) => {
          this.$state.errors = err.data;
        })
        .finally(() => {
          this.$state.isLoading = false;
        });
    },
  },
});
