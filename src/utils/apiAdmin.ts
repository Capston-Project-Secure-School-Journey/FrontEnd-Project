import { ADMIN_TOKEN } from "~/constants/authentication";
import { ADMIN_ROUTE } from "~/constants/route";
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
          console.error(`Log status code ${StatusCode.INTERNAL_SERVER_ERROR}`);
          navigateTo("/500");
        } else if (response.status === StatusCode.NOT_FOUND) {
          navigateTo("/404");
        } else if (response.status === StatusCode.UNAUTHENTICATED) {
          console.log(`Log status code ${StatusCode.UNAUTHENTICATED}`);
          setToken(ADMIN_TOKEN, "");
          navigateTo(ADMIN_ROUTE.LOGIN, { external: true });

          return Promise.reject({
            statusCode: response._data.statuscode,
            message: response._data.message,
          });
        } else if (response.status === StatusCode.BAD_REQUEST) {
          const message = response._data.message;
          const statusCode = response._data.statuscode;
          return Promise.reject({ message, statusCode });
        } else if (
          [StatusCode.UNPROCESSABLE_CONTENT, StatusCode.FORBIDDEN].includes(
            response.status
          )
        ) {
          console.error(`Log status code ${response.status}`);
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
