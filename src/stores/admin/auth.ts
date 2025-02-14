import { defineStore } from "pinia";
import { loginApi } from "~/api/admin/auth";
import { ADMIN_LAST_WORKSPACE, ADMIN_TOKEN } from "~/constants/authentication";
import { ADMIN_ROUTE } from "~/constants/route";
import type { AdminLoginEntity } from "~/entities/admin/auth";
import type { ErrorData } from "~/entities/api-error";

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

export const AdminAuthStore = defineStore("AdminAuthStore", {
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
    async login(schoolEntity: AdminLoginEntity): Promise<any> {
      this.$state.isLoading = true;

      const lastWorkspace = getLastWorkspace(ADMIN_LAST_WORKSPACE);

      await loginApi(schoolEntity)
        .then((result) => {
          const redirectUrl = lastWorkspace ?? ADMIN_ROUTE.DASHBOARD;
          console.log(result);

          setToken(ADMIN_TOKEN, result.token);
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

      setToken(ADMIN_TOKEN, "");

      const router = useRouter();
      await router.push("/");
      this.$state.isLoading = false;
    },
  },
});
