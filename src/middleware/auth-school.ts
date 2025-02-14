import {
  SCHOOL_LAST_WORKSPACE,
  SCHOOL_TOKEN,
} from "~/constants/authentication";
import { SCHOOL_ROUTE } from "~/constants/route";

export default defineNuxtRouteMiddleware(async (to) => {
  const token = getToken(SCHOOL_TOKEN);

  if (!token) {
    return navigateTo(SCHOOL_ROUTE.LOGIN);
  }

  setLastWorkspace(SCHOOL_LAST_WORKSPACE, to.fullPath);
});
