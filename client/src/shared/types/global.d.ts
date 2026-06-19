import type { TelegramRegisterType } from '@/entities/user/model';

export {};

declare global {
  interface Window {
    TelegramLoginWidget?: unknown; 
    onTelegramAuth?: (user: TelegramRegisterType) => void;
  }
}
