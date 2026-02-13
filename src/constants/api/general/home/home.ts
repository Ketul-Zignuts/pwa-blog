import { getRequest } from "@/lib/api-request";

export const getFeaturedPostAction = (params: any) => getRequest('/public/home/featured', params);
export const getTrendingPostAction = (params:any) => getRequest('/public/home/trending', params);
export const getCategoryTabListAction = (params:any) => getRequest('/public/categories',params);
export const getMainFeedAction = async (params: { page?: number; category_id?: string }) => {
  const cleanedParams: Record<string, string> = {
    page: (params.page ?? 1).toString(), // required
  }

  if (params.category_id) cleanedParams.category = params.category_id

  console.log('cleanedParams: ', cleanedParams)

  // ✅ return the result of getRequest
  return getRequest('/public/home/feed', cleanedParams)
}

// /public/home/feed