export const getListTripCalendarApi = (date: string): Promise<any> => {
  return apiSchool.get("/pickup-schedules/pickup-schedule-view", { date });
};

export const getDetailPickupScheduleApi = (date: string): Promise<any> => {
  return apiSchool.get("/pickup-schedules", { date });
};

export const getDetailTripHasListStudentApi = (id: string): Promise<any> => {
  return apiSchool.get(`/pickup-schedules/${id}`);
};
