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
