import {
  createTeacherApi,
  getDetailTeacherApi,
  getTeacherListApi,
  updateTeacherApi,
} from "~/api/school/teacher";
import type { ErrorEntity } from "~/entities/api-error";
import type { MetaDataEntity } from "~/entities/common";
import type {
  TeacherCommonEntity,
  TeacherEntity,
} from "~/entities/school/teacher";

interface State {
  isLoading: Boolean;
  actionsStatus: Boolean;
  isSucceed: Boolean;
  errors: ErrorEntity;
  teachers: TeacherCommonEntity[];
  teacher: TeacherEntity;
  metaData: MetaDataEntity;
}

const defaultState: State = {
  isLoading: false,
  isSucceed: false,
  actionsStatus: false,
  errors: {},
  teachers: [],
  teacher: {},
  metaData: {},
};

export const TeacherSchoolStore = defineStore("TeacherSchoolStore", {
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
    async getTeacherList(params: Object) {
      this.$state.isLoading = true;
      this.$state.isSucceed = false;

      await getTeacherListApi(params)
        .then((result) => {
          this.$state.metaData = result;
          this.$state.teachers = result.data as TeacherCommonEntity[];
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
    async createTeacher(entity: TeacherEntity) {
      this.$state.isLoading = true;
      this.$state.isSucceed = false;

      await createTeacherApi(entity)
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
     * Detail school
     * @param id teacher id
     */
    async getDetailTeacher(id: string) {
      this.$state.isLoading = true;
      this.$state.isSucceed = false;
      this.$state.actionsStatus = false;

      await getDetailTeacherApi(id)
        .then((result) => {
          this.$state.teacher = result;
          this.$state.isSucceed = true;
          this.$state.actionsStatus = true;
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
     * Update school
     * @param id school id
     */
    async updateTeacher(id: string, entity: TeacherEntity) {
      this.$state.isLoading = true;
      this.$state.isSucceed = false;

      await updateTeacherApi(id, entity)
        .then((result) => {
          this.$state.teacher = result;
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
  },
});
