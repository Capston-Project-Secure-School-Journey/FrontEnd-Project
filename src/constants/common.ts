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
