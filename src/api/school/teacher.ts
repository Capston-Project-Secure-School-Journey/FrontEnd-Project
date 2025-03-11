import type { TeacherEntity } from "~/entities/school/teacher";

export const getTeacherListApi = (param: Object): Promise<any> => {
  return apiSchool.get("/teachers", param);
};

export const createTeacherApi = (data: TeacherEntity): Promise<any> => {
  return apiSchool.post("/teachers", data);
};

export const updateTeacherApi = (
  id: string,
  data: TeacherEntity
): Promise<any> => {
  return apiSchool.put(`/teachers/${id}`, data);
};

export const getDetailTeacherApi = (id: string): Promise<any> => {
  return apiSchool.get(`/teachers/${id}`);
};

export const deleteTeacherApi = (id: string): Promise<any> => {
  return apiSchool.delete(`/teachers/${id}`);
};

export const deleteListTeacherApi = (ids: string[]): Promise<any> => {
  return apiSchool.delete("/teachers", ids);
};
