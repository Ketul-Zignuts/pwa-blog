import { deleteRequest, getRequest, postRequest, putRequest } from "@/lib/api-request";

export const commentPostAction = (params: any) => postRequest('/general/posts/comment', params);
export const commentEditAction = (formData: any) => putRequest('/general/posts/comment', formData, formData?.id);
export const commentDeleteAction = (id: string) => deleteRequest('/general/posts/comment', id);
export const commentGetAction = (params:any) => getRequest('/public/comment',params);
export const postDetailGetAction = (slug: any) => getRequest('/public/blog',undefined, slug);

export const likePostAction = (likeData: any) => postRequest('/general/posts/like', likeData);