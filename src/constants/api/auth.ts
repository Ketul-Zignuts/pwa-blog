import api from "@/components/api/api";

export const loginAction = async (credentials: any) => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};

// FIXED - No Content-Type header for FormData
export const registerAction = async (credentials: any) => {
  const formData = new FormData()
  
  Object.keys(credentials).forEach((key) => {
    if (credentials[key]) {
      formData.append(key, credentials[key])
    }
  })
  
  const { data } = await api.post('auth/register', formData, {
    transformRequest: [(data) => data],
  })
  
  return data
}

export const logoutAction = async () => {
  const { data } = await api.post('/auth/logout');
  return data;
};