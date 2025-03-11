import { getListClassApi } from "~/api/school/class";
import {
  createStudentApi,
  deleteListStudentApi,
  deleteStudentApi,
  getDetailStudentApi,
  getListStudentApi,
  updateStudentApi,
} from "~/api/school/student";
import type { ErrorEntity } from "~/entities/api-error";
import type { MetaDataEntity } from "~/entities/common";
import type { ClassCommonEntity, ClassEntity } from "~/entities/school/class";
import type {
  StudentCommonEntity,
  StudentEntity,
} from "~/entities/school/student";

interface State {
  isLoading: Boolean;
  actionsStatus: Boolean;
  isSucceed: Boolean;
  errors: ErrorEntity;
  classes: ClassCommonEntity[];
  students: StudentCommonEntity[];
  student: StudentEntity;
  class: ClassEntity;
  metaData: MetaDataEntity;
}

const defaultState: State = {
  isLoading: false,
  isSucceed: false,
  actionsStatus: false,
  errors: {},
  classes: [],
  students: [],
  student: {},
  class: {},
  metaData: {},
};

export const StudentSchoolStore = defineStore("StudentSchoolStore", {
  state: (): State => Object.assign(defaultState, getErrorObjectStore()),

  actions: {
    resetState() {
      this.$state = defaultState;
    },

    /**
     * Get list student
     *
     * @param params Pagination Params
     */
    async getListStudent(params: Object) {
      this.$state.isLoading = true;
      this.$state.isSucceed = false;

      await getListStudentApi(params)
        .then((result) => {
          this.$state.metaData = result;
          this.$state.students = result.data as StudentCommonEntity[];
          this.$state.isSucceed = true;
        })
        .catch((err) => {
          this.$state.errors = err.data;
        })
        .finally(() => {
          this.$state.isLoading = false;
        });
    },

    /**
     * Get list Class
     *
     * @param params Pagination Params
     */
    async getListClass(params: Object) {
      this.$state.isLoading = true;
      this.$state.isSucceed = false;

      await getListClassApi(params)
        .then((result) => {
          this.$state.metaData = result;
          this.$state.classes = result.data as ClassCommonEntity[];
          this.$state.isSucceed = true;
        })
        .catch((err) => {
          this.$state.errors = err.data;
        })
        .finally(() => {
          this.$state.isLoading = false;
        });
    },

    /**
     * Create a new student
     *
     * @param entity StudentEntity
     */
    async createStudent(entity: StudentEntity) {
      this.$state.isLoading = true;
      this.$state.isSucceed = false;

      await createStudentApi(entity)
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

    /**
     * Detail student
     * @param id student id
     */
    async getDetailStudent(id: string) {
      this.$state.isLoading = true;
      this.$state.isSucceed = false;

      await getDetailStudentApi(id)
        .then((result) => {
          this.$state.student = result;
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
     * Update student
     * @param id student id
     */
    async updateStudent(id: string, entity: StudentEntity) {
      this.$state.isLoading = true;
      this.$state.isSucceed = false;

      await updateStudentApi(id, entity)
        .then((result) => {
          this.$state.student = result;
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
     * Delete student
     * @param id student id
     */
    async deleteStudent(id: string) {
      this.$state.isLoading = true;
      this.$state.isSucceed = false;

      await deleteStudentApi(id)
        .then((result) => {
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
     * Delete list student
     *
     * @param ids list id student
     */
    async deleteListStudent(ids: string[]) {
      this.$state.isLoading = true;
      this.$state.isSucceed = false;

      await deleteListStudentApi(ids)
        .then((result) => {
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
  },
});
