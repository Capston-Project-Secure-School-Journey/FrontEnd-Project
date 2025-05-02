import { ALLOW_SIZE_IMAGE, ALLOW_TYPE_IMAGE } from "~/constants/common";
import {
  SCHEDULE_SESSION_COLOR_ENUM,
  SCHEDULE_SESSION_ENUM,
} from "~/constants/school";
import type {
  EventDisplayEntity,
  ScheduleMonthEntity,
} from "~/entities/school/schedule";

/**
 * Delay function
 * @param {countTime} number of milisecond
 * @returns
 */
export const delayFunc = (countTime: number) => {
  return new Promise((resolve) => setTimeout(resolve, countTime));
};

/**
 * Sleep
 *
 * @param ms
 * @returns
 */
export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

/**
 * parse object to options select
 * @param object object need to parse
 * @returns
 */
export const convertOptions = (object: Object) => {
  return Object.keys(object).map((_) => {
    return { id: _, name: String(object[_ as keyof Object]) };
  });
};

/**
 * format type string
 * @param dateStr dateTime type string
 * @returns dateTime format
 */
export const convertDateTimeServer = (dateStr: string) => {
  const date = new Date(dateStr);
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Intl.DateTimeFormat("en-CA", options).format(date);
};

export const convertDateTimeHours = (dateStr: string) => {};

/**
 * Create required message by field
 *
 * @param field field name
 * @returns string
 */
export const createRequireMessageByField = (field: string) => {
  return {
    message: `${field} là trường bắt buộc`,
  };
};

export function useCountdown(initialTime = 30 * 60) {
  const timeLeft = ref(initialTime);
  let timer: ReturnType<typeof setInterval> | null = null;

  // Format thời gian thành mm:ss
  const formattedTime = computed(() => {
    const minutes = Math.floor(timeLeft.value / 60);
    const seconds = timeLeft.value % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  });

  // Bắt đầu countdown
  const start = () => {
    if (timer) return; // Nếu đang chạy thì không khởi động lại
    timer = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--;
      } else {
        stop();
      }
    }, 1000);
  };

  // Dừng countdown
  const stop = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  // Reset countdown về giá trị ban đầu
  const reset = () => {
    stop();
    timeLeft.value = initialTime;
  };

  // Dọn dẹp khi component bị hủy
  onUnmounted(() => stop());

  return { timeLeft, formattedTime, start, stop, reset };
}

export const getSuffixImage = () => {
  return ALLOW_TYPE_IMAGE.map((_) => `.${_.split("/")[1]}`);
};

/**
 * Validate image
 *
 * @param file file image
 * @returns true | false
 */
export const imageValidation = (file: File) => {
  // validate size
  const fileUploadedSize = Number(file.size) / 1024; // Convert Bytes to KB
  const maxSizeUpload = Number(ALLOW_SIZE_IMAGE) * 1024; // Convert MB to KB

  if (fileUploadedSize > maxSizeUpload) {
    return false;
  }

  // validate type
  // 1. Check file extension
  if (!ALLOW_TYPE_IMAGE.includes(file.type)) {
    return false;
  }
  // 2. Check MINE
  const fileName = file.name.toLowerCase();
  const imageSuffix = ALLOW_TYPE_IMAGE.map((_) => `.${_.split("/")[1]}`);
  let isValidSuffix = false;
  imageSuffix.forEach((suffix) => {
    if (fileName.endsWith(suffix)) {
      isValidSuffix = true;
      return;
    }
  });

  return isValidSuffix;
};

/**
 * get current index week
 * @param date input date
 * @returns index of week
 */
export const getWeekNumber = (date: Date = new Date()): number => {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - startOfYear.getTime(); // Lấy timestamp
  const oneWeek = 1000 * 60 * 60 * 24 * 7;

  return Math.ceil(diff / oneWeek + startOfYear.getDay() / 7);
};

export const getMinDate = (
  date: Date = new Date(),
  range: number = 0,
  today: boolean = true
): string => {
  const targetDate = new Date(date);

  if (!today) {
    targetDate.setDate(date.getDate() + ((8 - date.getDay()) % 7 || 7));
  }
  targetDate.setDate(targetDate.getDate() + range);

  return targetDate.toISOString().split("T")[0];
};

export const getMaxDate = (
  date: Date = new Date(),
  range: number = 6
): string => {
  const minDate = new Date(getMinDate(date));
  minDate.setDate(minDate.getDate() + range);

  return minDate.toISOString().split("T")[0];
};

export const mappingSchedule = (scheduleMonth: ScheduleMonthEntity) => {
  if (scheduleMonth.classSchedules) {
    const eventsMonth: EventDisplayEntity[] = [];
    Object.entries(scheduleMonth.classSchedules).forEach(([date, events]) => {
      events.forEach((event) => {
        let start = new Date();
        let end = new Date();
        if (event.sessionType === SCHEDULE_SESSION_ENUM.MORNING) {
          start = new Date(`${event.date} 7:00`);
          end = new Date(`${event.date} 12:00`);
        } else if (event.sessionType === SCHEDULE_SESSION_ENUM.AFTERNOON) {
          start = new Date(`${event.date} 13:00`);
          end = new Date(`${event.date} 17:00`);
        } else {
          start = new Date(event.date);
          end = new Date(event.date);
        }

        eventsMonth.push({
          title: event.textDisplay,
          start,
          end,
          allDay: event.sessionType === SCHEDULE_SESSION_ENUM.FULL_DAY,
          color:
            SCHEDULE_SESSION_COLOR_ENUM[
              event.sessionType as keyof typeof SCHEDULE_SESSION_COLOR_ENUM
            ],
          note: event.note,
        });
      });
    });

    return eventsMonth;
  }
};
