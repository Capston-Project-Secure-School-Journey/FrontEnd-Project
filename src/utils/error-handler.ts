import type { ApiError } from "~/entities/api-error";

/**
 * Get default error
 *
 * @returns {ApiError} defaultError
 */
export const getErrorObjectStore = (): ApiError => {
  return {
    error: {
      data: {},
      code: -1,
      status: false,
    },
  };
};

/**
 * Handle Api error data
 *
 * @param response Error response
 * @returns Format Error data
 */
export const handleApiErrors = (response: any): ErrorData => {
  return {
    data: formatDataError(response.data.errors),
    code: response.status,
    status: true,
  };
};

/**
 * Format data error follow array
 *
 * @param data Array data
 * @returns data
 */
export const formatDataError = (data: Array<any> = []) => {
  let result = {};

  if (data.length > 0) {
    data.forEach((value) => {
      result = Object.assign(result, {
        [value.name]: value.message,
      });
    });
  }

  return result;
};
