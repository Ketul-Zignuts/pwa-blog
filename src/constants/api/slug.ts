import { postRequest } from "@/lib/api-request";

export const slugGetAction = (name: {name:string}) => postRequest('/slug', name);