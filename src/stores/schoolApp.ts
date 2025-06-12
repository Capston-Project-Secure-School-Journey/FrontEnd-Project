import {
  SNACKBAR_COLOR,
  SNACKBAR_DANGER_STATUS,
  SNACKBAR_INFO_STATUS,
} from "~/constants/common";

interface State {
  displayToast: boolean;
  message: string | null;
  color: string;
  timeout: number;
}

const defaultState: State = {
  displayToast: false,
  message: null,
  color: SNACKBAR_COLOR[SNACKBAR_INFO_STATUS],
  timeout: 3000,
};

export const SchoolApp = defineStore("SchoolApp", {
  state: (): State => Object.assign(defaultState, getErrorObjectStore()),

  actions: {
    resetState() {
      this.$state = defaultState;
    },

    showToastSuccess(message: string, timeout?: number) {
      this.$state.displayToast = true;
      this.$state.message = message;
      this.$state.color = SNACKBAR_COLOR[SNACKBAR_INFO_STATUS];
      if (timeout) {
        this.$state.timeout = timeout as number;
      }
    },

    showToastError(message: string, timeout?: number) {
      this.$state.displayToast = true;
      this.$state.message = message;
      this.$state.color = SNACKBAR_COLOR[SNACKBAR_DANGER_STATUS];
      if (timeout) {
        this.$state.timeout = timeout as number;
      }
    },

    hiddenToast(visible: boolean = false) {
      this.$state.displayToast = visible;
    },
  },
});
