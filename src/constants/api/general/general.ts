import { deleteRequest, getRequest, postRequest, putRequest } from "@/lib/api-request";

export const commentPostAction = (params: any) => postRequest('/general/posts/comment', params);
export const commentEditAction = (formData: any) => putRequest('/general/posts/comment', formData, formData?.id);
export const commentDeleteAction = (id: string) => deleteRequest('/general/posts/comment', id);
export const commentGetAction = (params:any) => getRequest('/public/comment',params);
export const postDetailGetAction = (slug: any) => getRequest('/public/blog',undefined, slug);
export const postDetailMorePostGetAction = (params: any) => getRequest('/public/related',params);
export const likePostAction = (likeData: any) => postRequest('/general/posts/like', likeData);

export const rateReviewGetAction = (params:any) => getRequest('/public/blog/review',params);
export const rateReviewDeleteAction = (id:string) => deleteRequest(`/general/review?id=${id}`);
export const rateReviewUpdateAction = (formData:any) => putRequest('/general/review',formData);
export const rateReviewCreateAction = (formData:any) => postRequest('/general/review',formData);

export const followAuthorAction = (formData:any) => postRequest('/general/posts/follow',formData);