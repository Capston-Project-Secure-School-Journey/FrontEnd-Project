import type { SchoolLoginEntity } from "~/entities/school/auth";

export const loginApi = (entity: SchoolLoginEntity): Promise<any> => {
  return apiAdmin.post("/auth/login", entity);
};
