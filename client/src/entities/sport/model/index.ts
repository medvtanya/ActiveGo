export type SportType = {
  id: number;
  type: string;
  createdAt: string;
  updatedAt: string;
};

export type SportArrayType = SportType[];

export type SportStateType = {
  sports: SportArrayType | null;
  sport: SportType | null;
  error: string | null;
  isLoading: boolean;
};

export const initialState: SportStateType = {
  sports: [],
  sport: null,
  error: null,
  isLoading: false,
};
