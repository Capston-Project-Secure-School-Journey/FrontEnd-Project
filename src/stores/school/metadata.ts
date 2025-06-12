import { defineStore } from "pinia";
import {
  getDataClassListApi,
  getDataGradeListApi,
} from "~/api/school/metadata";
import type { ErrorEntity } from "~/entities/api-error";
import type { MetaDataEntity, OptionSelect } from "~/entities/common";
import type { GradeEntity } from "~/entities/school/class";

interface State {
  isLoading: Boolean;
  isSucceed: Boolean;
  errors: ErrorEntity | null;
  grades: GradeEntity[];
  metaData: MetaDataEntity;
  classSearch: OptionSelect[];
}

const defaultState: State = {
  isLoading: false,
  isSucceed: false,
  errors: null,
  grades: [],
  metaData: {},
  classSearch: [],
};

export const SchoolMetaDataStore = defineStore("SchoolMetaDataStore", {
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
    async getDataGradeList() {
      this.$state.isLoading = true;
      this.$state.isSucceed = false;

      await getDataGradeListApi()
        .then((result) => {
          this.$state.grades = result as GradeEntity[];
          this.$state.isSucceed = true;
        })
        .catch((err) => {
          this.$state.errors = err.message;
        })
        .finally(() => {
          this.$state.isLoading = false;
        });
    },

    /**
     * Get search class
     *
     * @param params Pagination Params
     */
    async getDataClassList(name: string) {
      this.$state.isLoading = true;
      this.$state.isSucceed = false;

      await getDataClassListApi({ name })
        .then((result) => {
          this.$state.metaData = result;
          this.$state.classSearch = result as OptionSelect[];
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
