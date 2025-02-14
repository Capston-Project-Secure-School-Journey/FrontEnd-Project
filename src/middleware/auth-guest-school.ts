import {
  SCHOOL_LAST_WORKSPACE,
  SCHOOL_TOKEN,
} from "~/constants/authentication";

export default defineNuxtRouteMiddleware((to) => {
  const token = getToken(SCHOOL_TOKEN);

  if (token) {
    return navigateTo(getLastWorkspace(SCHOOL_LAST_WORKSPACE));
  }
});
