export type ComplaintChooseType =
  | "оскорбительный контент"
  | "ненависть и преследование"
  | "опасные действия и челленджи"
  | "дезинформация"
  | "мошенничество и обман"
  | "насилие, унижение и криминальная эксплуатация";

export type ComplaintType = {
  id: number;
  userId: number;
  eventId: number;
  content: string;
  type_Of_complaint: ComplaintChooseType[];
  createdAt: string;
  updatedAt: string;
};

export type CreateComplaintDto = {
  userId: number;
  eventId: number;
  content: string;
  type_Of_complaint: ComplaintChooseType[];
};

export type UpdateComplaintDto = Partial<CreateComplaintDto>;

export type ComplaintArrayType = ComplaintType[];

export type ComplaintStateType = {
  complains: ComplaintArrayType | null;
  complain: ComplaintType | null;
  error: string | null;
  isLoading: boolean;
};

export const initialState: ComplaintStateType = {
  complains: [],
  complain: null,
  error: null,
  isLoading: false,
};
