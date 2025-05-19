import type { OptionSelect } from "~/entities/common";

/**
 * SCHOOL TYPE
 */
export const SCHOOL_TYPE_ENUM = {
  PRE_SCHOOL: 0,
  PRIMARY_SCHOOL: 1,
  MIDDLE_SCHOOL: 2,
  HIGH_SCHOOL: 3,
};

export const SCHOOL_TYPE = {
  [SCHOOL_TYPE_ENUM.PRE_SCHOOL]: "Mầm non",
  [SCHOOL_TYPE_ENUM.PRIMARY_SCHOOL]: "Tiểu học",
  [SCHOOL_TYPE_ENUM.MIDDLE_SCHOOL]: "Trung học cơ sở",
  [SCHOOL_TYPE_ENUM.HIGH_SCHOOL]: "Trung học phổ thông",
};

export const SCHOOL_TYPE_OPTIONS: OptionSelect[] = [
  {
    id: SCHOOL_TYPE_ENUM.PRE_SCHOOL,
    name: SCHOOL_TYPE[SCHOOL_TYPE_ENUM.PRE_SCHOOL],
  },
  {
    id: SCHOOL_TYPE_ENUM.PRIMARY_SCHOOL,
    name: SCHOOL_TYPE[SCHOOL_TYPE_ENUM.PRIMARY_SCHOOL],
  },
  {
    id: SCHOOL_TYPE_ENUM.MIDDLE_SCHOOL,
    name: SCHOOL_TYPE[SCHOOL_TYPE_ENUM.MIDDLE_SCHOOL],
  },
  {
    id: SCHOOL_TYPE_ENUM.HIGH_SCHOOL,
    name: SCHOOL_TYPE[SCHOOL_TYPE_ENUM.HIGH_SCHOOL],
  },
];

/**
 * For schedule
 */
export const SCHEDULE_TYPE_ENUM = {
  CLASS: 0,
  GRADE: 1,
  SCHOOL: 2,
};

export const SCHEDULE_TYPE_NAME = {
  [SCHEDULE_TYPE_ENUM.CLASS]: "Theo lớp",
  [SCHEDULE_TYPE_ENUM.GRADE]: "Theo khối",
  [SCHEDULE_TYPE_ENUM.SCHOOL]: "Toàn trường",
};

export const SCHEDULE_TYPE_OPTIONS: OptionSelect[] = [
  {
    id: SCHEDULE_TYPE_ENUM.CLASS,
    name: SCHEDULE_TYPE_NAME[SCHEDULE_TYPE_ENUM.CLASS],
  },
  {
    id: SCHEDULE_TYPE_ENUM.GRADE,
    name: SCHEDULE_TYPE_NAME[SCHEDULE_TYPE_ENUM.GRADE],
  },
  {
    id: SCHEDULE_TYPE_ENUM.SCHOOL,
    name: SCHEDULE_TYPE_NAME[SCHEDULE_TYPE_ENUM.SCHOOL],
  },
];

/**
 * For Session
 */
export const SCHEDULE_SESSION_ENUM = {
  MORNING: 0,
  AFTERNOON: 1,
  FULL_DAY: 2,
};

export const SCHEDULE_SESSION_NAME = {
  [SCHEDULE_SESSION_ENUM.MORNING]: "Sáng",
  [SCHEDULE_SESSION_ENUM.AFTERNOON]: "Chiều",
  [SCHEDULE_SESSION_ENUM.FULL_DAY]: "Cả ngày",
};

export const SCHEDULE_SESSION_OPTIONS: OptionSelect[] = [
  {
    id: SCHEDULE_SESSION_ENUM.MORNING,
    name: SCHEDULE_SESSION_NAME[SCHEDULE_SESSION_ENUM.MORNING],
  },
  {
    id: SCHEDULE_SESSION_ENUM.AFTERNOON,
    name: SCHEDULE_SESSION_NAME[SCHEDULE_SESSION_ENUM.AFTERNOON],
  },
  {
    id: SCHEDULE_SESSION_ENUM.FULL_DAY,
    name: SCHEDULE_SESSION_NAME[SCHEDULE_SESSION_ENUM.FULL_DAY],
  },
];

export const SCHEDULE_SESSION_COLOR_ENUM = {
  [SCHEDULE_SESSION_ENUM.MORNING]: "indigo",
  [SCHEDULE_SESSION_ENUM.AFTERNOON]: "orange",
  [SCHEDULE_SESSION_ENUM.FULL_DAY]: "green",
};

export const APPLICATION_STATUS_ENUMS = {
  Created: 0,
  Pending: 1,
  Rejected: 2,
  NeedMoreInfo: 3,
  Approved: 4,
  Cancelled: 5,
};

/**
 * Driver application
 */
export const APPLICATION_STATUS_NAMES = {
  [APPLICATION_STATUS_ENUMS.Created]: "Đã tạo đơn",
  [APPLICATION_STATUS_ENUMS.Pending]: "Chờ duyệt đơn",
  [APPLICATION_STATUS_ENUMS.Rejected]: "Từ chối đơn",
  [APPLICATION_STATUS_ENUMS.NeedMoreInfo]: "Cần thêm thông tin đơn",
  [APPLICATION_STATUS_ENUMS.Approved]: "Chấp nhận đơn",
  [APPLICATION_STATUS_ENUMS.Cancelled]: "Huỷ đơn",
};

export const APPLICATION_ACTION_ENUMS = {
  Submit: 1,
  Update: 2,
  Cancel: 3,
  Reject: 4,
  Approve: 5,
  RequestMoreInfo: 6,
  Delete: 7,
};

export const APPLICATION_ACTION_NAMES = {
  [APPLICATION_ACTION_ENUMS.Submit]: "Nộp hồ sơ",
  [APPLICATION_ACTION_ENUMS.Update]: "Cập nhập hồ sơ",
  [APPLICATION_ACTION_ENUMS.Cancel]: "Hủy hồ sơ",
  [APPLICATION_ACTION_ENUMS.Reject]: "Từ chối hồ sơ",
  [APPLICATION_ACTION_ENUMS.Approve]: "Chấp nhận hồ sơ",
  [APPLICATION_ACTION_ENUMS.RequestMoreInfo]: "Yêu cầu thêm thông tin",
  [APPLICATION_ACTION_ENUMS.Delete]: "Xóa hồ sơ",
};

export const TRIP_STATUS_ENUMS = {
  NotStarted: 0,
  InProgress: 1,
  Completed: 2,
  Cancelled: 3,
};

export const TRIP_STATUS_NAMES = {
  [TRIP_STATUS_ENUMS.NotStarted]: "Chưa xuất phát",
  [TRIP_STATUS_ENUMS.InProgress]: "Đang trong chuyến",
  [TRIP_STATUS_ENUMS.Completed]: "Hoàn thành",
  [TRIP_STATUS_ENUMS.Cancelled]: "Huỷ chuyến",
};
