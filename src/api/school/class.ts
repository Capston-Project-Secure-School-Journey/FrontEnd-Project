import type { ClassEntity } from "~/entities/school/class";

export const getGradeListApi = (): Promise<any> => {
  return apiSchool.get("/classes/grades");
};

export const getListClassApi = (params: Object): Promise<any> => {
  return apiSchool.get("/classes", params);
};

export const createClassApi = (data: ClassEntity): Promise<any> => {
  return apiSchool.post("/classes", data);
};

export const getDetailClassApi = (id: string): Promise<any> => {
  return apiSchool.get(`/classes/${id}`);
};

export const updateClassApi = (id: string, data: ClassEntity): Promise<any> => {
  return apiSchool.put(`/classes/${id}`, data);
};

export const getSearchNameClassApi = (name: string): Promise<any> => {
  return apiSchool.get("/classes/class-combobox", { name });
};
