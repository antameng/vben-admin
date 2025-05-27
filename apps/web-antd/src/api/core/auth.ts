import { baseRequestClient, requestClient } from '#/api/request';

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    password?: string;
    username?: string;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    token_type: string;
  }

  export interface RefreshTokenResult {
    data: string;
    status: number;
  }
}

/**
 * 登录
 */
export async function loginApi(data: AuthApi.LoginParams) {
  return requestClient.post<AuthApi.LoginResult>('/auth/login', data);
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi() {
  return baseRequestClient.post<AuthApi.RefreshTokenResult>('/auth/refresh', {
    withCredentials: true,
  });
}

/**
 * 退出登录
 */
export async function logoutApi() {
  return baseRequestClient.post('/auth/logout', {
    withCredentials: true,
  });
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  return requestClient.get<string[]>('/auth/codes');
}

/**
 * 获取用户权限 即后端路由
 */
export async function getAccessMeumApi() {
  return requestClient.get<string[]>('/menu/tree/list');
}

/**
 *  获取公司
 */

export interface CompList {
  comp: string;
  dsca: string;
  ctyp: number;
}
export interface CompListResult {
  success: boolean;
  compList: CompList[];
  message: string;
}
export async function getComps() {
  return requestClient.get<CompListResult>('/comp/list');
}
export interface CaptchaImageResult {
  img: string;
  uuid: string;
}
export async function getCaptchaImage() {
  return requestClient.get<CaptchaImageResult>('/auth/captchaImage');
}
