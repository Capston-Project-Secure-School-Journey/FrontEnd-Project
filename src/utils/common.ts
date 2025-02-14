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
