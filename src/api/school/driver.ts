export const getListDriverApplicationApi = (params: Object): Promise<any> => {
  return apiSchool.get("/driver-approval-applications", params);
};

export const getDetailDriverApplicationApi = (id: string): Promise<any> => {
  return apiSchool.get(`/driver-approval-applications/${id}`);
};

export const getActionDriverApplicationApi = (id: string): Promise<any> => {
  return apiSchool.get(`/driver-approval-applications/${id}/action-can-do`);
};

export const actionApproveDriverApplicationApi = (
  id: string,
  reason: string
): Promise<any> => {
  return apiSchool.put(`/driver-approval-applications/${id}/approve`, {
    reason,
  });
};

export const actionCancelDriverApplicationApi = (
  id: string,
  reason: string
): Promise<any> => {
  return apiSchool.put(`/driver-approval-applications/${id}/cancel`, {
    reason,
  });
};

export const actionRejectDriverApplicationApi = (
  id: string,
  reason: string
): Promise<any> => {
  return apiSchool.put(`/driver-approval-applications/${id}/reject`, {
    reason,
  });
};

export const actionRequestMoreInfoDriverApplicationApi = (
  id: string,
  reason: string
): Promise<any> => {
  return apiSchool.put(
    `/driver-approval-applications/${id}/request-more-info`,
    {
      reason,
    }
  );
};
