import {
  SCHOOL_LAST_WORKSPACE,
  SCHOOL_TOKEN,
} from "~/constants/authentication";
import * as StatusCode from "~/constants/status-code";

const config = useRuntimeConfig();
const singletonEnforcer = Symbol();
const nuxtApp = useNuxtApp();

class ApiSchool {
  private static inst: ApiSchool;
  private school: any;
  constructor(enforcer: any) {
    if (enforcer !== singletonEnforcer) {
      throw new Error("Cannot initialize client single instance");
    }
    this.school = $fetch.create(this.makeSchool());
  }

  static get instance(): ApiSchool {
    if (this.inst) {
      return this.inst;
    }

    this.inst = new ApiSchool(singletonEnforcer);

    return this.inst;
  }

  makeSchool(): Object {
    return {
      baseURL: config.public.API_BASE_URL,
      headers: this.getHeaders(),
      async onRequest() {
        nuxtApp.callHook("page:loading:start");
      },
      async onResponse() {
        nuxtApp.callHook("page:loading:end");
      },
      async onResponseError({ response }) {
        if (response.status === StatusCode.INTERNAL_SERVER_ERROR) {
          console.log(`Log status code ${StatusCode.INTERNAL_SERVER_ERROR}`);
          navigateTo("/500");
        } else if (
          [StatusCode.FORBIDDEN, StatusCode.FORBIDDEN].includes(response.status)
        ) {
          localStorage.setItem(SCHOOL_LAST_WORKSPACE, "");
          navigateTo("/404");
        } else if (response.status === StatusCode.UNAUTHENTICATED) {
          console.log(`Log status code ${StatusCode.UNAUTHENTICATED}`);
          setToken(SCHOOL_TOKEN, "");
          // navigateTo(SCHOOL_ROUTE.LOGIN, { external: true });
          return Promise.reject({
            statusCode: response._data.statuscode,
            message: response._data.message,
          });
        } else if (response.status === StatusCode.BAD_REQUEST) {
          const message = response._data.message;
          const statusCode = response._data.statuscode;
          return Promise.reject({ message, statusCode });
        } else if (
          [StatusCode.UNPROCESSABLE_CONTENT].includes(response.status)
        ) {
          console.log(`Log status code ${response.status}`);
          const message = response._data.errors
            ?.map((e: any) => e.message)
            .join("\n");

          const statusCode = response._data.statuscode;

          return Promise.reject({ message, statusCode });
        }
      },
    };
  }

  getHeaders(): Object {
    const token = getToken(SCHOOL_TOKEN);

    let headers = {
      Accept: "application/json",
      "Content-type": "application/json",
    };

    if (token) {
      headers = Object.assign(headers, { Authorization: `${token}` });
    }

    return headers;
  }

  get(url: string, params: Object = {}): Promise<any> {
    return this.school(url, {
      method: "GET",
      query: params,
    });
  }

  post(url: string, data: Object = {}): Promise<any> {
    return this.school(url, {
      method: "POST",
      body: data,
    });
  }

  put(url: string, data: Object = {}): Promise<any> {
    return this.school(url, {
      method: "PUT",
      body: data,
    });
  }

  patch(url: string, data: Object = {}): Promise<any> {
    return this.school(url, {
      method: "PATCH",
      body: data,
    });
  }

  delete(url: string, data: Object = {}): Promise<any> {
    return this.school(url, {
      method: "DELETE",
      body: data,
    });
  }
}

export const apiSchool = ApiSchool.instance;
