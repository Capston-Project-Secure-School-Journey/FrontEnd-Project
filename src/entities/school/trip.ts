export interface BasicTripEntity {
  [date: string]: TripDetail[];
}

export interface TripDetail {
  date: string;
  schoolId: string;
  sessionType: number;
  numberOfStudents: number;
  numberOfTrips: number;
}
