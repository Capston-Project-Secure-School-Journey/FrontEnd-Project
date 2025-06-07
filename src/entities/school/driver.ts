export interface DriverApplicationEntity {
  id?: string;
  schoolId?: string;
  requestedDate?: string;
  requestStatus?: number;
  driverId?: string;
  driverName?: string;
  approvedBy?: string;
  approvedByName?: string;
  vehicleType?: string;
  licenseNumber?: string;
  seatingCapacity: number;
  lastCheckDrivingLicense?: string;
  driverInformationImages: DriverInformationImageEntity[];
  vehicleImages: string[];
  driverRequestStatusHistoryResponse: HistoryRequest[];
}

export interface HistoryRequest {
  id?: string;
  fromStatus: number;
  toStatus: number;
  changedBy?: string;
  changedAt?: string;
  note?: string;
}

export interface DriverInformationImageEntity {
  id?: string;
  type?: number;
  url?: string;
}

export interface DriverTripEntity {
  id?: string;
  sessionType?: number;
  type?: number;
  date?: string;
  driverId?: string;
  driverName?: string;
  driverAvatar?: string;
  driverPhoneNumber?: string;
  vehicleType?: string;
  driverGender?: number;
  licenseNumber?: string;
  isAllNotesRead?: boolean;
  journeyStatus?: number;
  numberOfStudents?: number;
  numberOfPickedUpStudents?: number;
  numberOfDroppedOffStudents?: number;
  bestRoute: BestRoute;
  students: StudentInTripEntity[];
  startJourneyTime?: string;
  endJourneyTime?: string;
  pickupEndTime?: string;
  pickupStartTime?: string;
}

export interface BestRoute {
  origin: PointTripEntity;
  destination: PointTripEntity;
  wayPoints: PointTripEntity[];
}

export interface PointTripEntity {
  fullAddress?: string;
  latitude?: number;
  longitude?: number;
}

export interface StudentInTripEntity {
  studentId?: string;
  parents?: [];
  pickupAddress?: string;
  pickupLat?: number;
  pickupLng?: number;
  gender?: number;
  avatarUrl?: string;
  className?: string;
  classId?: string;
  fullName?: string;
  isPickedUp?: boolean;
  pickedUpTime?: string;
  isDroppedOff?: boolean;
  droppedOffTime?: string;
  skipPickup?: boolean;
  isSkipUpReason?: string;
}
