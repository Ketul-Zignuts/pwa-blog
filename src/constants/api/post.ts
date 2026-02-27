import { deleteRequest, getRequest, postRequest, putRequest } from "@/lib/api-request";


export const userPostCreateAction = (payload: any) => postRequest('/general/posts', payload);
export const userPostDetailGetAction = (id: string) => getRequest('/general/posts',undefined, id);
export const userPostUpdateAction = (formData: any) => putRequest('/admin/posts', formData, formData?.id);
export const userPostDeleteAction = (id: string) => deleteRequest('/general/posts',id);