export const getUnreadNotificationApi = (): Promise<any> => {
  return apiSchool.get("/notifications/unread-count");
};

export const getListNotificationApi = (currentPage: number): Promise<any> => {
  return apiSchool.get("/notifications", { currentPage });
};

export const markAsReadNotification = (id: string): Promise<any> => {
  return apiSchool.put(`/notifications/${id}/mark-read`);
};

export const markAllAsReadNotification = (): Promise<any> => {
  return apiSchool.put("/notifications/mark-read");
};
