import { defineStore } from "pinia";
import {
  createSchoolApi,
  getDetailSchoolApi,
  getListSchoolApi,
} from "~/api/admin/school";
import type {
  AdminSchoolCommonEntity,
  AdminSchoolEntity,
} from "~/entities/admin/school";
import type { ErrorEntity } from "~/entities/api-error";

interface State {
  isLoading: Boolean;
  isSucceed: Boolean;
  errors: ErrorEntity;
  schools: AdminSchoolCommonEntity[];
  school: AdminSchoolEntity;
}

const defaultState: State = {
  isLoading: false,
  isSucceed: false,
  errors: {},
  schools: [],
  school: {},
};

export const AdminSchoolStore = defineStore("AdminSchoolStore", {
  state: (): State => Object.assign(defaultState, getErrorObjectStore()),

  actions: {
    resetState() {
      this.$state = defaultState;
    },

    /**
     * Get list school
     *
     * @param params Pagination Params
     */
    async getListSchool(params: Object) {
      this.$state.isLoading = true;
      this.$state.isSucceed = false;

      await getListSchoolApi(params)
        .then((result) => {
          this.$state.schools = result as AdminSchoolCommonEntity[];
        })
        .catch((err) => {
          this.$state.errors = err.data;
        })
        .finally(() => {
          this.$state.isSucceed = true;
        });

      this.$state.isLoading = false;
    },

    /**
     * Create a new school
     *
     * @param entity AdminSchoolEntity
     */
    async createSchool(entity: AdminSchoolEntity) {
      this.$state.isLoading = true;
      this.$state.isSucceed = false;

      await createSchoolApi(entity)
        .then(() => {})
        .catch((err) => {
          this.$state.errors = err.data;
        })
        .finally(() => {
          this.$state.isSucceed = true;
        });

      this.$state.isLoading = false;
    },

    /**
     * Cetail school
     * @param id school id
     */
    async getDetailSchool(id: string) {
      this.$state.isLoading = true;
      this.$state.isSucceed = false;

      await getDetailSchoolApi(id)
        .then((result) => {
          this.$state.school = result;
        })
        .catch((err) => {
          this.$state.errors = err.data;
        })
        .finally(() => {
          this.$state.isSucceed = true;
        });

      this.$state.isLoading = false;
    },
  },
});
