import { defineStore } from "pinia";
import { loginApi } from "~/api/school/auth";
import {
  ADMIN_LAST_WORKSPACE,
  ADMIN_TOKEN,
  ENTITY_ID,
  SCHOOL_LAST_WORKSPACE,
  SCHOOL_TOKEN,
  USER_TYPE_ENUM,
} from "~/constants/authentication";
import { ADMIN_ROUTE, SCHOOL_ROUTE } from "~/constants/route";
import type { ResponseAuthEntity } from "~/entities/admin/auth";
import type { ErrorEntity } from "~/entities/api-error";
import type { SchoolLoginEntity } from "~/entities/school/auth";

interface State {
  isLoading: Boolean;
  isSucceed: Boolean;
  errors: ErrorEntity | null;
  me: ResponseAuthEntity;
}

const defaultState: State = {
  isLoading: false,
  isSucceed: false,
  errors: null,
  me: {},
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
      const router = useRouter();
      await loginApi(schoolEntity)
        .then((result) => {
          this.$state.errors = null;
          const userType = result.userType;
          this.$state.me = result as ResponseAuthEntity;
          if (userType === USER_TYPE_ENUM.ADMIN) {
            const lastWorkspace = getLastWorkspace(ADMIN_LAST_WORKSPACE);
            const redirectUrl = lastWorkspace ?? ADMIN_ROUTE.DASHBOARD;
            setToken(ADMIN_TOKEN, result.token);
            navigateTo(redirectUrl, { external: true });
            router.push(redirectUrl);
          } else if (userType === USER_TYPE_ENUM.SCHOOL_ADMIN) {
            const lastWorkspace = getLastWorkspace(SCHOOL_LAST_WORKSPACE);
            const redirectUrl = lastWorkspace ?? SCHOOL_ROUTE.DASHBOARD;
            setToken(SCHOOL_TOKEN, result.token);
            setToken(ENTITY_ID, result.id);
            navigateTo(redirectUrl, { external: true });
          }
        })
        .catch((err) => {
          this.$state.errors = err.message;
        })
        .finally(() => {
          this.$state.isLoading = false;
        });
    },

    /**
     * Logout
     */
    async logout(userType: number = USER_TYPE_ENUM.SCHOOL_ADMIN): Promise<any> {
      this.$state.isLoading = true;

      switch (userType) {
        case USER_TYPE_ENUM.SCHOOL_ADMIN:
          setToken(SCHOOL_TOKEN, "");
          setLastWorkspace(SCHOOL_LAST_WORKSPACE, "");
          break;
        case USER_TYPE_ENUM.ADMIN:
          setToken(ADMIN_TOKEN, "");
          setLastWorkspace(ADMIN_LAST_WORKSPACE, "");
        default:
          break;
      }

      const router = useRouter();
      await router.push("/");
      this.$state.isLoading = false;
    },
  },
});
