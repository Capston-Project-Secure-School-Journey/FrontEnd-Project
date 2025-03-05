import type { OptionSelect } from "../common";

export interface GradeEntity extends OptionSelect {}

export interface ClassCommonEntity {
  id?: string;
  grade?: number;
  className: string;
  numberOfStudent?: number;
}

export interface ClassEntity {
  id?: string;
  grade?: number;
  gradeName?: string;
  managedTeachers?: ManagerTeacher[];
  className?: string;
  numberOfStudent?: number;
}

export interface ManagerTeacher {
  managedTeacherId?: string;
  id?: string;
  name?: string;
}
