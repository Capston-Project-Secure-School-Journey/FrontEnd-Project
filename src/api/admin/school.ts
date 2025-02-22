import type { AdminSchoolEntity } from "~/entities/admin/school";

export const getListSchoolApi = (param: Object): Promise<any> => {
  console.log(param);

  return apiAdmin.get("/schools", param);
};

export const createSchoolApi = (data: AdminSchoolEntity): Promise<any> => {
  return apiAdmin.post("/schools", data);
};

export const getDetailSchoolApi = (id: string): Promise<any> => {
  return apiAdmin.get(`/schools/${id}`);
};

export const updateSchoolApi = (
  schoolId: string,
  data: AdminSchoolEntity
): Promise<any> => {
  return apiAdmin.put(`/schools/${schoolId}`, data);
};

export const updateSchoolAdminPasswordApi = (
  schoolId: string,
  data: FormData
): Promise<any> => {
  return apiAdmin.post(
    `/schools/${schoolId}/change-school-admin-password`,
    data
  );
};
