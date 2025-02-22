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
