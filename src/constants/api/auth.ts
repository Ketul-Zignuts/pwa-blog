import { postRequest } from "@/lib/api-request";

export const loginAction = (credentials: any) => postRequest('/auth/login', credentials);
export const registerAction = (credentials: any) => postRequest('auth/register', credentials);
export const logoutAction = () => postRequest('/auth/logout');