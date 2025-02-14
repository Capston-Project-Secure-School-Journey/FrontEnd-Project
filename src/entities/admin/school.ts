export interface AdminSchoolCommonEntity {
  id: string;
  schooltype: number;
  name: string;
  email: string;
  phonenumber: string;
  // images: string;
}

export interface AdminSchoolEntity {
  id?: string;
  schooltype?: number;
  name?: string;
  schooldescription?: string;
  address?: string;
  morningstarttime?: string;
  morningendtime?: string;
  afternoonendtime?: string;
  afternoonstarttime?: string;
  email?: string;
  phonenumber?: string;
  // images: string;
}
