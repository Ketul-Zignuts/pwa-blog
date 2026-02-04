import { deleteRequest, getRequest, postRequest, putRequest } from "@/lib/api-request";
import { adminCategoryFilterParam, CategoryDataType } from "@/types/categoryTypes";

export const adminCategoryListAction = (params: adminCategoryFilterParam) => getRequest('/admin/categories', params);
export const adminCategoryDeleteAction = (id: string) => deleteRequest('/admin/categories', id);
export const adminCategoryCreateAction = (payload: CategoryDataType) => postRequest('/admin/categories', payload);
export const adminCategoryUpdateAction = (formData: CategoryDataType) => putRequest('/admin/categories', formData, formData?.id);
export const adminPostCategoryListDropDownAction = (params:adminCategoryFilterParam) => getRequest('/admin/dropdown/categories', params);