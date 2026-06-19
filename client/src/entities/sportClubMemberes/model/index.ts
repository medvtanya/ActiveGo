export interface InitialStateType {
  sportClub_id: number;
  user_id: number;
}

export interface SportClubMemberType extends InitialStateType {
  id: number;
  sportClub_id: number;
  user_id: number;
  access: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    userName: string;
    photo: string;


    telegram_photo: string;
  };
  sportClub: {
    id: number;
    title: string;

  };
}

export type SportClubMemberArrayType = SportClubMemberType[];

export type SportClubStateType = {
  sportClubMembers: SportClubMemberArrayType;
  currentSportClubMember: SportClubMemberType | null;
  error: string | null;
  loading: boolean;
};

export const initialState: SportClubStateType = {
  sportClubMembers: [],
  currentSportClubMember: null,
  error: null,
  loading: false,
};
