export interface AdminSchoolCommonEntity {
  id: string;
  schoolType: number;
  name: string;
  email: string;
  phoneNumber: string;
  // images: string;
}

export interface AdminSchoolEntity {
  id?: string;
  schoolType?: number;
  schoolName?: string;
  schoolDescription?: string;
  address?: string;
  morningStartTime?: string;
  morningEndTime?: string;
  afternoonEndTime?: string;
  afternoonStartTime?: string;
  email?: string;
  phoneNumber?: string;
  schoolAdminUserName?: string;
  schoolAdminPassword?: string;
}
