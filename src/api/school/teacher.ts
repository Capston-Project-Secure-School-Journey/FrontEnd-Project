import { SCHOOL_TOKEN } from "~/constants/authentication";
import type { TeacherEntity } from "~/entities/school/teacher";
const config = useRuntimeConfig();

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

export const uploadAvatarTeacherApi = (
  idTeacher: string,
  formData: FormData
): Promise<any> => {
  return fetch(
    `${config.public.API_BASE_URL}/teachers/${idTeacher}/upload-avatar`,
    {
      method: "POST",
      body: formData,
      headers: {
        Authorization: getToken(SCHOOL_TOKEN),
      },
    }
  );
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

export const downloadTemplateUploadTeacherApi = (): Promise<any> => {
  return apiSchool.get("/teachers/template-excel-file");
};
