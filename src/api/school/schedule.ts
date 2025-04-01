import type { CreateScheduleEntity } from "~/entities/school/schedule";

export const getScheduleApi = (date: string): Promise<any> => {
  return apiSchool.get("/schedules/schedule-view", { date });
};

export const createScheduleApi = (data: CreateScheduleEntity): Promise<any> => {
  return apiSchool.post("/schedules", data);
};
