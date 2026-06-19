export interface UserType {
  id: number;
  firstName: string;
  lastName?: string;
  userName?: string;

  email?: string;
  password?: string;
  iphone?: string;
  cityId?: number;
  isAdmin?: boolean;
  telegram_id?: string;
  telegram_photo?: string;
  birth?: string;
  content?: string;
  link?: string;
  photo?: string;
  createdAt?: string;
  updatedAt?: string;
  city?: { city: string };
  hasPassword?: boolean;
}

export interface RegisterUserType {
  firstName: string;
  lastName?: string;
  email?: string;
  password?: string;
  iphone?: string;
  cityId: number;
  isAdmin?: boolean;
  telegram_id?: string;
  telegram_photo?: string;
  photo?: string;
}

export interface LoginUserType {
  email: string;
  password: string;
}

export interface TelegramRegisterType {
  id: string;
  username: string;
  first_name: string;
  last_name?: string;
  photo_url?: string;
  cityId: number;
  iphone: string;
  hash: string;
}

export interface TelegramLoginType {
  id: string;
  iphone: string;
  hash: string;
}

export type UserResponsType = {
  accessToken: string;
  user: UserType;
};
