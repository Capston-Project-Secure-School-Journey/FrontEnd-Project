export interface TeacherCommonEntity {
  id: string;
  schoolId?: string;
  firstName?: string;
  lastName?: string;
  gender?: number;
  phoneNumber?: string;
  email?: string;
}

export interface TeacherEntity {
  id?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: number;
  phoneNumber?: string;
  email?: string;
}
