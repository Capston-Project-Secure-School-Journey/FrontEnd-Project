import { SCHOOL_TOKEN } from "~/constants/authentication";
import type { StudentEntity } from "~/entities/school/student";
const config = useRuntimeConfig();

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
  return fetch(
    `${config.public.API_BASE_URL}/students/${idStudent}/upload-avatar`,
    {
      method: "POST",
      body: formData,
      headers: {
        Authorization: getToken(SCHOOL_TOKEN),
      },
    }
  );
};

export const downloadTemplateUploadStudentApi = (): Promise<any> => {
  return apiSchool.get("/students/template-excel-file");
};

export const deleteStudentApi = (id: string): Promise<any> => {
  return apiSchool.delete(`/students/${id}`);
};

export const deleteListStudentApi = (ids: string[]): Promise<any> => {
  return apiSchool.delete("/students", ids);
};
