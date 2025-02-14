/**
 * Set token authentication
 *
 * @param key Local storage key
 * @param token token
 */
export const setToken = (key: string, token: string) => {
  localStorage.setItem(key, token);
};

/**
 * Get local storage key authentication
 *
 * @param key Local storage key
 * @returns token
 */
export const getToken = (key: string) => {
  return localStorage.getItem(key);
};

/**
 * get last workspace by type
 *
 * @param type type of authentication
 * @returns
 */
export const getLastWorkspace = (type: string) => {
  return localStorage.getItem(type);
};

/**
 * Set last workspace user
 *
 * @param lastWorkspace Last workspace user
 */
export const setLastWorkspace = (type: string, lastWorkspace: string) => {
  localStorage.setItem(type, lastWorkspace);
};

/**
 * Check authentication of authenticator
 *
 * @param type type of authenticator
 * @returns true if have token, else false
 */
export const checkAuth = (type: string): Boolean => {
  return !!getToken(type);
};
