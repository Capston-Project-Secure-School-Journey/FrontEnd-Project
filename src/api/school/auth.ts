import type { SchoolLoginEntity } from "~/entities/school/auth";

export const loginApi = (entity: SchoolLoginEntity): Promise<any> => {
  const school = {
    UserName: entity.username,
    password: entity.password,
  };

  return apiSchool.post("/authen/login", school);
};
