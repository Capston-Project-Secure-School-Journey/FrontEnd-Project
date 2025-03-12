import type { StudentEntity } from "~/entities/school/student";

export const getListStudentApi = (params: Object): Promise<any> => {
  return apiSchool.get("/students", params);
};

export const createStudentApi = (data: StudentEntity): Promise<any> => {
  return apiSchool.post("/students", data);
};

export const getDetailStudentApi = (id: string): Promise<any> => {
  return apiSchool.get(`/students/${id}`);
};

export const updateStudentApi = (
  id: string,
  data: StudentEntity
): Promise<any> => {
  return apiSchool.put(`/students/${id}`, data);
};

export const uploadAvatarStudentApi = (
  idStudent: string,
  formData: FormData
): Promise<any> => {
  return apiSchool.post(`students/${idStudent}/upload-avatar`, formData);
};

export const deleteStudentApi = (id: string): Promise<any> => {
  return apiSchool.delete(`/students/${id}`);
};

export const deleteListStudentApi = (ids: string[]): Promise<any> => {
  return apiSchool.delete("/students", ids);
};
