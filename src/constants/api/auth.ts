import api from "@/components/api/api";

export const loginAction = async (credentials: any) => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};