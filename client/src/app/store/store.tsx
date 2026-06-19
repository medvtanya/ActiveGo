import { cityReducer } from '@/entities/city/slice/citySlice';
import { complaintReducer } from '@/entities/complaint/slice/complaintSlice';
import { eventReducer } from '@/entities/event/slice/eventSlice';
import { userReducer } from '@/entities/user/slice/userSlice';
import { sportReducer } from '@/entities/sport/slice/sportSlice';
import { configureStore } from '@reduxjs/toolkit';
import { sportClubReducer } from '@/entities/sportClub/slice/sportClubSlice';
import { sportClubMemberReducer } from '@/entities/sportClubMemberes/slice/sportClubSlice';
import { userSportReducer } from '@/entities/userSport/slice/userSportSlice';

const store = configureStore({
  reducer: {
    event: eventReducer,
    complaint: complaintReducer,
    sportClub: sportClubReducer,
    sportClubMember: sportClubMemberReducer,
    user: userReducer,
    city: cityReducer,
    sport: sportReducer,
    userSport: userSportReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
