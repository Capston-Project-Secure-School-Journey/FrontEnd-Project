import { defineStore } from "pinia";
import { loginApi } from "~/api/school/auth";
import {
  ADMIN_LAST_WORKSPACE,
  ADMIN_TOKEN,
  SCHOOL_LAST_WORKSPACE,
  SCHOOL_TOKEN,
  USER_TYPE_ENUM,
} from "~/constants/authentication";
import { ADMIN_ROUTE, SCHOOL_ROUTE } from "~/constants/route";
import type { ErrorEntity } from "~/entities/api-error";
import type { SchoolLoginEntity } from "~/entities/school/auth";

interface State {
  isLoading: Boolean;
  isSucceed: Boolean;
  errors: ErrorEntity | null;
}

const defaultState: State = {
  isLoading: false,
  isSucceed: false,
  errors: null,
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

      await loginApi(schoolEntity)
        .then((result) => {
          const userType = result.userType;
          if (userType === USER_TYPE_ENUM.ADMIN) {
            const lastWorkspace = getLastWorkspace(ADMIN_LAST_WORKSPACE);
            const redirectUrl = lastWorkspace ?? ADMIN_ROUTE.DASHBOARD;
            setToken(ADMIN_TOKEN, result.token);
            navigateTo(redirectUrl, { external: true });
          } else if (userType === USER_TYPE_ENUM.SCHOOL_ADMIN) {
            const lastWorkspace = getLastWorkspace(SCHOOL_LAST_WORKSPACE);
            const redirectUrl = lastWorkspace ?? SCHOOL_ROUTE.DASHBOARD;
            setToken(SCHOOL_TOKEN, result.token);
            navigateTo(redirectUrl, { external: true });
          }
        })
        .catch((err) => {
          this.$state.errors = err.data;
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
