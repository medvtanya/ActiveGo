
import type { UserType } from '@/entities/user/model/index'


export interface ChatMessage {
  id: number;
  message: string;
  userId: number;
  userName: string;
  createdAt: Date | string;
  isTemp?: boolean;
  user?: UserType
}

