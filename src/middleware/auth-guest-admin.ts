import { ADMIN_LAST_WORKSPACE, ADMIN_TOKEN } from "~/constants/authentication";
import { ADMIN_ROUTE } from "~/constants/route";

export default defineNuxtRouteMiddleware((to) => {
  const token = getToken(ADMIN_TOKEN);

  if (token) {
    return navigateTo(
      getLastWorkspace(ADMIN_LAST_WORKSPACE) ?? ADMIN_ROUTE.DASHBOARD
    );
  }
});
