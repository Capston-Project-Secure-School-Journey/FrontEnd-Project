export const getListTripCalendarApi = (date: string): Promise<any> => {
  return apiSchool.get("/shuttle-schedules/pickup-schedule-view", { date });
};

export const getDetailPickupScheduleApi = (date: string): Promise<any> => {
  return apiSchool.get("/shuttle-schedules", { date });
};

export const getDetailTripHasListStudentApi = (id: string): Promise<any> => {
  return apiSchool.get(`/shuttle-schedules/${id}`);
};
