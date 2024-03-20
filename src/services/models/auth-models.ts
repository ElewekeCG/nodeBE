export interface UserCreationParams {
  email: string;
  name: string;
  username: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
}

export interface UserAndCredentials {
  user: User;
  token: string;
  refresh: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface RefreshParams {
  email: string;
  refreshToken: string;
}