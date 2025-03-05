export interface StudentCommonEntity {
  id?: string;
  schoolId?: string;
  schoolName?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  classId?: string;
  className?: string;
  gender?: number;
  avatarUrl?: string;
  qrImageUrl?: string;
  pickUpLocation?: string;
  pickUpLat?: number;
  pickUpLng?: number;
}

export interface StudentEntity {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  classId?: string;
  gender?: number;
  qrImageUrl?: string;
}
