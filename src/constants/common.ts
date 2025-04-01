import type { OptionSelect } from "~/entities/common";

/**
 * For mode action
 */
export const MODE_FORM_CREATE = "CREATE";
export const MODE_FORM_UPDATE = "UPDATE";

/**
 * Paginate
 */
export const PAGE_LIMIT_DEFAULT: number = 10;
export const SORT_DIRECTION = {
  ASC: "asc",
  DESC: "desc",
};
export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

/**
 * Gender
 */
export const GENDER_ENUM = {
  FEMALE: 0,
  MALE: 1,
};

export const GENDER_NAME = {
  [GENDER_ENUM.FEMALE]: "Nữ",
  [GENDER_ENUM.MALE]: "Nam",
};

export const GENDER_OPTIONS: OptionSelect[] = [
  { id: GENDER_ENUM.MALE, name: GENDER_NAME[GENDER_ENUM.MALE] },
  { id: GENDER_ENUM.FEMALE, name: GENDER_NAME[GENDER_ENUM.FEMALE] },
];

/**
 * Snackbar Prop
 */
export const SNACKBAR_SUCCESS_STATUS = 1;
export const SNACKBAR_DANGER_STATUS = 2;
export const SNACKBAR_WARNING_STATUS = 3;
export const SNACKBAR_INFO_STATUS = 4;

export const SNACKBAR_COLOR = {
  [SNACKBAR_SUCCESS_STATUS]: "#22bb33",
  [SNACKBAR_DANGER_STATUS]: "#bb2124",
  [SNACKBAR_WARNING_STATUS]: "#f0ad4e",
  [SNACKBAR_INFO_STATUS]: "#5bc0de",
};

/**
 * For image
 */
export const ALLOW_TYPE_IMAGE = ["image/jpg", "image/jpeg", "image/png"];
export const ALLOW_SIZE_IMAGE = 5; // type: Mb

export const UNKNOWN_ERROR = "Something went wrong!!";
