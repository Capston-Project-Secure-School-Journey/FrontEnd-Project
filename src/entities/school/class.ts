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
  managedTeachers?: ManagerTeacher[];
  className?: string;
  numberOfStudent?: number;
}

export interface ManagerTeacher {
  managedTeacherId?: string;
}
