import { defineStore } from "pinia";
import { loginApi } from "~/api/school/auth";
import {
  SCHOOL_LAST_WORKSPACE,
  SCHOOL_TOKEN,
} from "~/constants/authentication";
import { SCHOOL_ROUTE } from "~/constants/route";
import type { ErrorData } from "~/entities/api-error";
import type { SchoolLoginEntity } from "~/entities/school/auth";

interface State {
  isLoading: Boolean;
  isSucceed: Boolean;
  errors: ErrorData;
}

const defaultState: State = {
  isLoading: false,
  isSucceed: false,
  errors: {},
};

export const SchoolAuthStore = defineStore("SchoolAuthStore", {
  state: (): State => Object.assign(defaultState, getErrorObjectStore()),

  actions: {
    resetState() {
      this.$state = defaultState;
    },

    /**
     * Login User
     *
     * @param schoolEntity Object login
     */
    async login(schoolEntity: SchoolLoginEntity): Promise<any> {
      this.$state.isLoading = true;

      const lastWorkspace = getLastWorkspace(SCHOOL_LAST_WORKSPACE);

      await loginApi(schoolEntity)
        .then((result) => {
          const redirectUrl = lastWorkspace ?? SCHOOL_ROUTE.DASHBOARD;

          setToken(SCHOOL_TOKEN, result.token);
          navigateTo(redirectUrl, { external: true });
        })
        .catch((err) => {
          this.$state.errors = handleApiErrors(err);
        })
        .finally(() => {
          this.$state.isLoading = false;
        });
    },

    /**
     * Logout
     */
    async logout(): Promise<any> {
      this.$state.isLoading = true;

      setToken(SCHOOL_TOKEN, "");

      const router = useRouter();
      await router.push("/");
      this.$state.isLoading = false;
    },
  },
});
