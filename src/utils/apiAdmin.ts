import { ADMIN_TOKEN } from "~/constants/authentication";
import * as StatusCode from "~/constants/status-code";

const config = useRuntimeConfig();
const singletonEnforcer = Symbol();
const nuxtApp = useNuxtApp();

class ApiAdmin {
  private static inst: ApiAdmin;

  private admin: any;
  constructor(enforcer: any) {
    if (enforcer !== singletonEnforcer) {
      throw new Error("Cannot initialize client single instance");
    }
    this.admin = $fetch.create(this.makeClient());
  }

  static get instance(): ApiAdmin {
    if (this.inst) {
      return this.inst;
    }

    this.inst = new ApiAdmin(singletonEnforcer);

    return this.inst;
  }

  makeClient(): Object {
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
        } else if (response.status === StatusCode.NOT_FOUND) {
          navigateTo("/404");
        } else if (response.status === StatusCode.UNAUTHENTICATED) {
          console.log(`Log status code ${StatusCode.UNAUTHENTICATED}`);
          setToken(ADMIN_TOKEN, "");

          return {
            statusCode: response._data.statuscode,
            message: response._data.message,
          };
        } else if (
          [
            StatusCode.UNPROCESSABLE_CONTENT,
            StatusCode.BAD_REQUEST,
            StatusCode.FORBIDDEN,
          ].includes(response.status)
        ) {
          console.log(`Log status code ${response.status}`);
          return {
            statusCode: response._data.statuscode,
            message: response._data.message,
            errors: response._data.errors,
          };
        }
      },
    };
  }

  getHeaders(): Object {
    const token = getToken(ADMIN_TOKEN);

    let headers = {
      Accept: "text/plain",
    };

    if (token) {
      headers = Object.assign(headers, { Authorization: `${token}` });
    }

    return headers;
  }

  get(url: string, params: Object = {}): Promise<any> {
    return this.admin(url, {
      method: "GET",
      query: params,
    });
  }

  post(url: string, data: Object = {}): Promise<any> {
    return this.admin(url, {
      method: "POST",
      body: data,
    });
  }

  put(url: string, data: Object = {}): Promise<any> {
    return this.admin(url, {
      method: "PUT",
      body: data,
    });
  }

  patch(url: string, data: Object = {}): Promise<any> {
    return this.admin(url, {
      method: "PATCH",
      body: data,
    });
  }

  delete(url: string, data: Object = {}): Promise<any> {
    return this.admin(url, {
      method: "DELETE",
      body: data,
    });
  }
}

export const apiAdmin = ApiAdmin.instance;
