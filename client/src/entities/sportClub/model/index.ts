export interface InitialStateType {
  title: string;
  sportId: number;
  openCommunity: boolean;
  cityId: number;
  content: string;
  ownerId: number;
  photo: string;
}

export interface SportClubType extends InitialStateType {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  sport: {
    id: number;
    type: string;
    sport_id: number;
    city_id: number;
    owner_id: number;
    photo: string;
    openCommunity: boolean;
  };
  city: {
    id: number;
    city: string;
  };
  owner: {
    id: number;
    name: string;
  };
}

export type SportClubArrayType = SportClubType[];

export type SportClubStateType = {
  sportClubs: SportClubArrayType;
  currentSportClub: SportClubType | null;
  error: string | null;
  loading: boolean;
};

export const initialState: SportClubStateType = {
  sportClubs: [],
  currentSportClub: null,
  error: null,
  loading: false,
};
