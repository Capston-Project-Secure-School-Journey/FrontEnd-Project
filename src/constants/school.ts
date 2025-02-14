import type { OptionSelect } from "~/entities/common";

/**
 * SCHOOL TYPE
 */
export const PRE_SCHOOL: number = 1;
export const PRIMARY_SCHOOL: number = 2;
export const MIDDLE_SCHOOL: number = 3;
export const HIGH_SCHOOL: number = 4;

export const SCHOOL_TYPE = {
  [PRE_SCHOOL]: "Mầm non",
  [PRIMARY_SCHOOL]: "Tiểu học",
  [MIDDLE_SCHOOL]: "Trung học cơ sở",
  [HIGH_SCHOOL]: "Trung học phổ thông",
};

export const SCHOOL_TYPE_OPTIONS: OptionSelect[] = [
  { id: PRE_SCHOOL, name: SCHOOL_TYPE[PRE_SCHOOL] },
  { id: PRIMARY_SCHOOL, name: SCHOOL_TYPE[PRIMARY_SCHOOL] },
  { id: MIDDLE_SCHOOL, name: SCHOOL_TYPE[MIDDLE_SCHOOL] },
  { id: HIGH_SCHOOL, name: SCHOOL_TYPE[HIGH_SCHOOL] },
];
