import { postRequest } from "@/lib/api-request";

export const tempFileUploadAction = (credentials: any) => postRequest('upload', credentials);