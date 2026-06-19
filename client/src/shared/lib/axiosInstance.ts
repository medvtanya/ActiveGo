import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  sent?: boolean;
}

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export let accessToken = localStorage.getItem('accessToken') || '';

console.log('axiosInstance - инициализация, токен из localStorage:', {
  hasToken: !!accessToken,
  tokenLength: accessToken.length,
  tokenPreview: accessToken
    ? accessToken.substring(0, 20) + '...'
    : 'нет токена',
});

export function setAccessToken(newToken: string): void {
  console.log('setAccessToken - устанавливаем новый токен:', {
    tokenLength: newToken.length,
    tokenPreview: newToken.substring(0, 20) + '...',
  });
  accessToken = newToken;
  localStorage.setItem('accessToken', newToken);
}

axiosInstance.interceptors.request.use(
  (config: ExtendedAxiosRequestConfig): ExtendedAxiosRequestConfig => {
    if (config.headers && !config.headers.authorization) {
      config.headers.authorization = `Bearer ${accessToken}`;
      console.log('axiosInstance - добавляем токен в заголовки:', {
        url: config.url,
        token: accessToken ? 'токен установлен' : 'токен отсутствует',
        tokenLength: accessToken.length,
      });
    }
    return config;
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError) => {
    const prevRequest: ExtendedAxiosRequestConfig | undefined = error.config;

    console.log('axiosInstance - response interceptor - error:', {
      status: error.response?.status,
      url: error.config?.url,
      hasToken: !!accessToken,
      message: error.message,
      code: error.code,
    });

    if (
      error.code === 'ERR_NETWORK' ||
      error.code === 'ERR_CONNECTION_REFUSED'
    ) {
      console.log(
        'axiosInstance - сервер недоступен, пропускаем обновление токена'
      );
      return Promise.reject(error);
    }

    if (error.response?.status === 403 && prevRequest && !prevRequest.sent) {
      try {
        console.log('axiosInstance - пытаемся обновить токен...');
        const response = await axiosInstance.get('/auth/refresh');
        accessToken = response.data.data.accessToken;
        console.log('axiosInstance - токен обновлен:', {
          tokenLength: accessToken.length,
          tokenPreview: accessToken.substring(0, 20) + '...',
        });
        prevRequest.sent = true;

        if (prevRequest.headers) {
          prevRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return axiosInstance(prevRequest);
      } catch (refreshError) {
        console.log('axiosInstance - ошибка обновления токена:', refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
