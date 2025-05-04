export interface CreateScheduleEntity {
  date?: string;
  note?: string;
  sessionType?: number;
  scheduleType?: number;
  classId?: string;
  grade?: number;
  classException?: string[];
}

export interface ScheduleMonthEntity {
  classSchedules?: Record<string, EventDetailEntity[]>;
}

export interface EventDetailEntity {
  id?: string;
  classId?: string;
  className?: string;
  date?: string;
  grade?: number;
  note?: string;
  scheduleType?: number;
  sessionType?: number;
  textDisplay?: string[];
}

export interface EventDisplayEntity {
  title?: string[];
  start?: Date;
  end?: Date;
  allDay?: boolean;
  color?: string;
  note?: string;
}
