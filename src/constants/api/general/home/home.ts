import { getRequest, postRequest } from "@/lib/api-request";

export const getFeaturedPostAction = (params: any) => getRequest('/public/home/featured', params);
export const getTrendingPostAction = (params:any) => getRequest('/public/home/trending', params);
export const getCategoryTabListAction = (params:any) => getRequest('/public/categories',params);
export const getMainFeedAction = (params:any) => getRequest('/public/home/feed',params);
export const postCommentAction = (postData:any) => postRequest('/public/home/feed',postData);
// /public/home/feed