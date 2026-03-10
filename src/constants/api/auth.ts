import { postRequest } from "@/lib/api-request";

export const loginAction = (credentials: any) => postRequest('/auth/login', credentials);
export const googleLoginAction = (credentials: any) => postRequest('/auth/oauth-login/google', credentials);
export const registerAction = (credentials: any) => postRequest('auth/register', credentials);
export const logoutAction = () => postRequest('/auth/logout');