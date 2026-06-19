
export type UserSportType = {
    id: number;
    userId: number;
    sportId: number;
    createdAt?: string;
    updatedAt?: string;
}

export type UserSportArrayType = UserSportType[]


export type UserSportStateType = {
    userSports: UserSportArrayType;
    userSport: UserSportType | null;
    loading: boolean;
    error: string | null;
    isInizialized: boolean;
}

export const initialState: UserSportStateType = {
    userSports: [],
    userSport: null,
    loading: false,
    error: null,
    isInizialized: false,
}



