import type { MenuItemEntity } from "~/entities/common";

/**
 * Admin Routes
 */
export const ADMIN_ROUTE = {
  LOGIN: "/admin/login",
  DASHBOARD: "/admin/dashboard",
  SCHOOLS: "/admin/schools",
  SCHOOLS_CREATE: "/admin/schools/create",
};

export const ADMIN_MENU: MenuItemEntity[] = [
  {
    icon: "mdi-view-dashboard",
    label: "Tổng quan",
    url: ADMIN_ROUTE.DASHBOARD,
  },
  {
    icon: "mdi-town-hall",
    label: "Quản lý trường học",
    url: ADMIN_ROUTE.SCHOOLS,
  },
];

/**
 * School Routes
 */
export const SCHOOL_ROUTE = {
  INDEX: "/",
  LOGIN: "/login",
  SIGN_UP: "/sign-up",
  DASHBOARD: "/dashboard",
  STUDENTS: "/students",
  CLASSES: "/classes",
  DRIVERS: "/drivers",
  TEACHERS: "/teachers",
  SCHEDULE: "/schedule",
};

export const SCHOOL_MENU: MenuItemEntity[] = [
  {
    key: "DASHBOARD",
    active: false,
    icon: "mdi-view-dashboard",
    label: "Tổng quan",
    url: SCHOOL_ROUTE.DASHBOARD,
  },
  {
    key: "STUDENTS",
    active: false,
    icon: "mdi-account-school",
    label: "Quản lý Học sinh",
    url: SCHOOL_ROUTE.STUDENTS,
  },
  {
    key: "DRIVERS",
    active: false,
    icon: "mdi-card-account-details",
    label: "Quản lý Tài xế",
    url: SCHOOL_ROUTE.DRIVERS,
  },
  {
    key: "TEACHERS",
    active: false,
    icon: "mdi-human-male-board",
    label: "Quản lý Giáo viên",
    url: SCHOOL_ROUTE.TEACHERS,
  },
  {
    key: "CLASSES",
    active: false,
    icon: "mdi-google-classroom",
    label: "Quản lý Lớp học",
    url: SCHOOL_ROUTE.CLASSES,
  },
  {
    key: "SCHEDULE",
    active: false,
    icon: "mdi-calendar-blank-multiple",
    label: "Quản lý Lịch học",
    url: SCHOOL_ROUTE.SCHEDULE,
  },
];
