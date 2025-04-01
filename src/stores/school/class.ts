import {
  createClassApi,
  getDetailClassApi,
  getGradeListApi,
  getListClassApi,
  getSearchNameClassApi,
  updateClassApi,
} from "~/api/school/class";
import type { ErrorEntity } from "~/entities/api-error";
import type { MetaDataEntity, OptionSelect } from "~/entities/common";
import type {
  ClassCommonEntity,
  ClassEntity,
  GradeEntity,
} from "~/entities/school/class";

interface State {
  isLoading: Boolean;
  actionsStatus: Boolean;
  isSucceed: Boolean;
  errors: ErrorEntity;
  classes: ClassCommonEntity[];
  grades: GradeEntity[];
  class: ClassEntity;
  classSearch: OptionSelect[];
  metaData: MetaDataEntity;
}

const defaultState: State = {
  isLoading: false,
  isSucceed: false,
  actionsStatus: false,
  errors: {},
  classes: [],
  classSearch: [],
  grades: [],
  class: {},
  metaData: {},
};

export const ClassSchoolStore = defineStore("ClassSchoolStore", {
  state: (): State => Object.assign(defaultState, getErrorObjectStore()),

  actions: {
    resetState() {
      this.$state = defaultState;
    },

    /**
     * Get list grade
     *
     * @param params Pagination Params
     */
    async getGradeList() {
      this.$state.isLoading = true;
      this.$state.isSucceed = false;

      await getGradeListApi()
        .then((result) => {
          this.$state.grades = result as GradeEntity[];
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
     * Get list school
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
     * Create a new school
     *
     * @param entity AdminSchoolEntity
     */
    async createClass(entity: ClassEntity) {
      this.$state.isLoading = true;
      this.$state.isSucceed = false;

      await createClassApi(entity)
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
     * Detail class
     * @param id class id
     */
    async getDetailClass(id: string) {
      this.$state.isLoading = true;
      this.$state.isSucceed = false;

      await getDetailClassApi(id)
        .then((result) => {
          this.$state.class = result;
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
     * Update school
     * @param id school id
     */
    async updateClass(id: string, entity: ClassEntity) {
      this.$state.isLoading = true;
      this.$state.isSucceed = false;

      await updateClassApi(id, entity)
        .then((result) => {
          this.$state.class = result;
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
     * Get list school
     *
     * @param params Pagination Params
     */
    async getSearchNameClass(name: string) {
      this.$state.isLoading = true;
      this.$state.isSucceed = false;

      await getSearchNameClassApi(name)
        .then((result) => {
          this.$state.metaData = result;
          this.$state.classSearch = result as OptionSelect[];
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
