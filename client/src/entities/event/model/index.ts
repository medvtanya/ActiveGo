import type { ComplaintType } from "@/entities/complaint/model";

export type EventLevelType = "beginner" | "middle" | "professional";

export type EventType = {
  id: number;
  photos: string[];
  sportId: number;
  title: string;
  location: string;
  content: string;
  member: number;
  level: EventLevelType[];
  date: string;
  userId: number;
  cityId: number;
  coords: number[];
  createdAt?: string;
  updatedAt?: string;
  sportType?: string;
  creatorId?: number;
  complaints?: ComplaintType[];
};

export type EventArrayType = EventType[];

export type EventStateType = {
  events: EventArrayType | [];
  event: EventType | null;
  myActiveEvents?: EventArrayType;
  error: string | null;
  isLoading: boolean;
};

export const initialState: EventStateType = {
  events: [],
  event: null,
  myActiveEvents: [],
  error: null,
  isLoading: false,
};
