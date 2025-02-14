import type { AdminSchoolEntity } from "~/entities/admin/school";

export const getListSchoolApi = (param: Object): Promise<any> => {
  return apiAdmin.get("/schools", param);
};

export const createSchoolApi = (data: AdminSchoolEntity): Promise<any> => {
  return apiAdmin.post("/schools", data);
};

export const getDetailSchoolApi = (id: string): Promise<any> => {
  return apiAdmin.get(`/schools/${id}`);
};
