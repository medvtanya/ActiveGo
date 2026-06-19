import type {
  RegisterUserType,
  LoginUserType,
  TelegramRegisterType,
  TelegramLoginType,
} from '../model';

export function validateRegisterUser(data: RegisterUserType): string | null {
  if (!data.firstName?.trim()) return 'Имя обязательно';
  if (!data.lastName?.trim()) return 'Фамилия обязательна';
  if (!data.email?.trim()) return 'Email обязателен';
  if (!data.password?.trim()) return 'Пароль обязателен';
  if (!data.cityId) return 'Город обязателен';

  if (!/^\S+@\S+\.\S+$/.test(data.email)) return 'Некорректный email';

  if (
    !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=]{8,}$/.test(
      data.password!
    )
  ) {
    return 'Пароль должен быть не менее 8 символов и содержать буквы и цифры';
  }

  if (!/[!@#$%^&*()_+\-=]/.test(data.password!)) {
    return 'Пароль должен содержать хотя бы один специальный символ (!@#$%^&*()_+-=)';
  }
  return null;
}

export function validateLoginUser(data: LoginUserType): string | null {
  if (!data.email?.trim()) return 'Email обязателен';
  if (!data.password?.trim()) return 'Пароль обязателен';
  return null;
}

export function validateTelegramRegister(
  data: TelegramRegisterType
): string | null {
  if (!data.id?.trim())
    return 'Ошибка авторизации через Telegram. Попробуйте ещё раз.';
  if (!data.username?.trim()) return 'Telegram username обязателен';
  if (!data.first_name?.trim()) return 'Имя обязательно';

  if (!data.hash?.trim()) return 'Hash обязателен';
  return null;
}

export function validateTelegramLogin(data: TelegramLoginType): string | null {
  if (!data.id?.trim())
    return 'Ошибка авторизации через Telegram. Попробуйте ещё раз.';
  if (!data.iphone?.trim()) return 'Телефон обязателен';
  if (!/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(data.iphone))
    return 'Телефон должен быть в формате +7 (999) 999-99-99';
  if (!data.hash?.trim()) return 'Hash обязателен';
  return null;
}
