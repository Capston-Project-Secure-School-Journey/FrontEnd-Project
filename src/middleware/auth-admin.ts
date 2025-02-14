import { ADMIN_LAST_WORKSPACE, ADMIN_TOKEN } from "~/constants/authentication";
import { ADMIN_ROUTE } from "~/constants/route";

export default defineNuxtRouteMiddleware(async (to) => {
  const token = getToken(ADMIN_TOKEN);

  if (!token) {
    return navigateTo(ADMIN_ROUTE.LOGIN);
  }

  setLastWorkspace(ADMIN_LAST_WORKSPACE, to.fullPath);
});
