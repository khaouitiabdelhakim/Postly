import Cookies from 'js-cookie';

const TOKEN_KEY = 'postly_auth_token';

export const setToken = (token: string): void => {
  Cookies.set(TOKEN_KEY, token, { expires: 7 }); // 7 days
};

export const getToken = (): string | undefined => {
  return Cookies.get(TOKEN_KEY);
};

export const removeToken = (): void => {
  Cookies.remove(TOKEN_KEY);
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};
