import { deleteRequest, getRequest, postRequest, putRequest } from "@/lib/api-request";

export const commentPostAction = (params: any) => postRequest('/general/posts/comment', params);
export const commentEditAction = (formData: any) => putRequest('/general/comment', formData, formData?.id);
export const commentDeleteAction = (id: string) => deleteRequest('/general/comment', id);
export const commentGetAction = (params:any) => getRequest('/public/comment',params);