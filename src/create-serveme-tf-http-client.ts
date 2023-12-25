import axios, { AxiosError } from 'axios';
import { ServemeTfApiError } from './errors/serveme-tf-api.error';

export const createServemeTfHttpClient = (endpoint: string, apiKey: string) => {
  const http = axios.create({
    baseURL: `https://${endpoint}/api`,
    params: {
      api_key: apiKey,
    },
  });

  http.interceptors.response.use(null, error => {
    if (error instanceof AxiosError) {
      throw new ServemeTfApiError();
    } else {
      throw error;
    }
  });

  return http;
};
