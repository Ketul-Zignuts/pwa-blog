import api from '@/lib/api';

/* -------------------- helpers -------------------- */

const preparePayload = (payload: any) => {
  if (!payload) return payload;

  // If already FormData → send as-is
  if (payload instanceof FormData) return payload;

  let hasFile = false;
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]: any) => {
    if (value instanceof File || value instanceof Blob) {
      hasFile = true;
      formData.append(key, value);
    } else if (Array.isArray(value) || typeof value === 'object') {
      formData.append(key, JSON.stringify(value));
    } else if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  // If no file present → send JSON
  return hasFile ? formData : payload;
};

const buildUrl = (url: string, id?: string | number | undefined | null) =>
  id ? `${url}/${id}` : url;

/* -------------------- request methods -------------------- */

export const postRequest = async (
  url: string,
  payload?: any,
  id?: string | number
) => {
  const finalUrl = buildUrl(url, id);
  const data = preparePayload(payload);

  const res = await api.post(finalUrl, data, {
    headers:
      data instanceof FormData
        ? { 'Content-Type': 'multipart/form-data' }
        : undefined,
  });

  return res.data;
};

export const putRequest = async (
  url: string,
  payload?: any,
  id?: string | number | undefined | null
) => {
  const finalUrl = buildUrl(url, id);
  const data = preparePayload(payload);

  const res = await api.put(finalUrl, data, {
    headers:
      data instanceof FormData
        ? { 'Content-Type': 'multipart/form-data' }
        : undefined,
  });

  return res.data;
};

export const patchRequest = async (
  url: string,
  payload?: any,
  id?: string | number
) => {
  const finalUrl = buildUrl(url, id);
  const data = preparePayload(payload);

  const res = await api.patch(finalUrl, data, {
    headers:
      data instanceof FormData
        ? { 'Content-Type': 'multipart/form-data' }
        : undefined,
  });

  return res.data;
};

export const deleteRequest = async (
  url: string,
  id?: string | number
) => {
  const finalUrl = buildUrl(url, id);
  const res = await api.delete(finalUrl);
  return res.data;
};

export const getRequest = async (
  url: string,
  query?: Record<string, any>,
  id?: string | number
) => {
  const finalUrl = buildUrl(url, id);

  console.log('query: ', query);
  const res = await api.get(finalUrl, {
    params: query,
    paramsSerializer: {
      serialize: (params) => {
        const searchParams = new URLSearchParams();

        Object.entries(params || {}).forEach(([key, value]: any) => {
          if (Array.isArray(value) || typeof value === 'object') {
            searchParams.append(key, JSON.stringify(value));
          } else if (value !== undefined && value !== null) {
            searchParams.append(key, value);
          }
        });

        return searchParams.toString();
      },
    },
  });

  return res.data;
};
