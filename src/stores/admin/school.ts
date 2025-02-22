import { defineStore } from "pinia";
import {
  createSchoolApi,
  getDetailSchoolApi,
  getListSchoolApi,
  updateSchoolAdminPasswordApi,
  updateSchoolApi,
} from "~/api/admin/school";
import type {
  AdminSchoolCommonEntity,
  AdminSchoolEntity,
} from "~/entities/admin/school";
import type { ErrorEntity } from "~/entities/api-error";
import type { MetaDataEntity } from "~/entities/common";

interface State {
  isLoading: Boolean;
  isSucceed: Boolean;
  errors: ErrorEntity;
  schools: AdminSchoolCommonEntity[];
  school: AdminSchoolEntity;
  metaData: MetaDataEntity;
}

const defaultState: State = {
  isLoading: false,
  isSucceed: false,
  errors: {},
  schools: [],
  school: {},
  metaData: {},
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
          this.$state.metaData = result;
          this.$state.schools = result.data as AdminSchoolCommonEntity[];
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
        .then(() => {
          this.$state.isSucceed = true;
        })
        .catch((err) => {
          this.$state.errors = err.data;
          this.$state.isSucceed = false;
        })
        .finally(() => {
          this.$state.isLoading = false;
        });
    },

    /**
     * Create school
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
          this.$state.isSucceed = false;
        })
        .finally(() => {
          this.$state.isSucceed = true;
        });

      this.$state.isLoading = false;
    },

    /**
     * Update school
     * @param id school id
     */
    async updateSchool(id: string, entity: AdminSchoolEntity) {
      this.$state.isLoading = true;
      this.$state.isSucceed = false;

      await updateSchoolApi(id, entity)
        .then((result) => {
          this.$state.school = result;
        })
        .catch((err) => {
          this.$state.errors = err.data;
          this.$state.isSucceed = false;
        })
        .finally(() => {
          this.$state.isSucceed = true;
        });

      this.$state.isLoading = false;
    },

    /**
     * Update school admin password
     *
     * @param id school id
     * @param data form data
     */
    async updateSchoolAdminPassword(id: string, data: FormData) {
      this.$state.isLoading = true;
      this.$state.isSucceed = false;

      await updateSchoolAdminPasswordApi(id, data)
        .then(() => {})
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
