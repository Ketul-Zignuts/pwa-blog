import { deleteRequest, getRequest, postRequest, putRequest } from "@/lib/api-request";
import { adminPostFilterParam, PostDataType } from "@/types/postTypes";

export const adminPostListAction = (params: adminPostFilterParam) => getRequest('/admin/posts', params);
export const adminPostUserListDropDownAction = (params:adminPostFilterParam) => getRequest('/admin/dropdown/users', params);
export const adminPostDeleteAction = (id: string) => deleteRequest('/admin/posts', id);
export const adminPostCreateAction = (payload: any) => postRequest('/admin/posts', payload);
export const adminPostGetAction = (id: string) => getRequest('/admin/posts',undefined, id);
export const adminPostUpdateAction = (formData: PostDataType) => putRequest('/admin/posts', formData, formData?.id);