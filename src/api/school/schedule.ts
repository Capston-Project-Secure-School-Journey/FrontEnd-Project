import type {
  CreateScheduleEntity,
  EventDetailEntity,
} from "~/entities/school/schedule";

export const getScheduleApi = (date: string): Promise<any> => {
  return apiSchool.get("/schedules/schedule-view", { date });
};

export const createScheduleApi = (data: CreateScheduleEntity): Promise<any> => {
  return apiSchool.post("/schedules", data);
};

export const getDetailScheduleDateApi = (date: string): Promise<any> => {
  return apiSchool.get("/schedules", { date });
};

export const updateDetailScheduleDateApi = (
  data: EventDetailEntity
): Promise<any> => {
  return apiSchool.put(`/schedules/${data.id}`, data);
};

export const deleteDetailScheduleDateApi = (id: string): Promise<any> => {
  return apiSchool.delete(`/schedules/${id}`);
};
