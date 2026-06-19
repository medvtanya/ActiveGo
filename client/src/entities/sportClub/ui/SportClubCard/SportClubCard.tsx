import { useNavigate } from "react-router";
import type { SportClubType } from "../../model";
import { CLIENT_ROUTES } from "@/shared/enums/clientRoutes";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxHooks";
import {
  createSportClubMemberThunk,
  getAllSportClubMembersThunk,
  deleteSportClubMemberThunk,
} from "@/entities/sportClubMemberes/api/sportClubMemberesApi";

import "./SportClubCard.css";

const CityIcon = () => (
  <svg width="23" height="23" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);

const SportIcon = () => (
  <svg width="23" height="23" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

type Props = {
  sportClub: SportClubType;
};

export default function SportClubCard({ sportClub }: Props) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const sportClubMembers = useAppSelector(
    (state) => state.sportClubMember.sportClubMembers
  );
  const user = useAppSelector((state) => state.user.user);

  const navigateHandler = () => {
    if (!sportClub.openCommunity) {
      const isUserMember = sportClubMembers.some(
        (member) =>
          member.sportClub_id === sportClub.id &&
          member.user_id === user?.id &&
          member.access
      );
      if (!isUserMember) {
        return;
      }
    }
    navigate(`${CLIENT_ROUTES.SPORT_CLUB}/${sportClub.id}`);
  };

  const memberCount = sportClubMembers.filter(
    (member) => member.sportClub_id === sportClub.id && member.access
  ).length;

  const isUserMember = sportClubMembers.some(
    (member) =>
      member.sportClub_id === sportClub.id &&
      member.user_id === user?.id &&
      member.access
  );

  const hasSubmittedRequest = sportClubMembers.some(
    (member) =>
      member.sportClub_id === sportClub.id &&
      member.user_id === user?.id &&
      !member.access
  );

  const handleJoinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user?.id) return;

    const access = sportClub.openCommunity;

    dispatch(
      createSportClubMemberThunk({
        sportClub_id: sportClub.id,
        user_id: user.id,
        access: access,
      })
    )
      .then(() => {
        dispatch(getAllSportClubMembersThunk());
      })
      .catch((error) => {
        console.error("Ошибка при вступлении в клуб:", error);
      });
  };

  const handleCancelRequest = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user?.id) return;

    const userRequest = sportClubMembers.find(
      (member) =>
        member.sportClub_id === sportClub.id &&
        member.user_id === user.id &&
        !member.access
    );

    if (!userRequest) return;

    dispatch(deleteSportClubMemberThunk(userRequest.id))
      .then(() => {
        dispatch(getAllSportClubMembersThunk());
      })
      .catch((error) => {
        console.error("Ошибка при отмене заявки:", error);
      });
  };

  return (
    <div className="sport-club-card" onClick={navigateHandler}>
      <img
        src={`${import.meta.env.VITE_API_URL}/images/${sportClub.photo}`}
        alt={sportClub.title}
      />
      <div className="card-content">
        <h3 data-title={sportClub.title}>
          {sportClub.title}
          <span
            className={`clubs-status ${
              sportClub.openCommunity ? "open" : "closed"
            }`}
          >
            {sportClub.openCommunity ? "Открытый" : "Закрытый"}
          </span>
        </h3>
        <p>
          <svg className="participants-icon" viewBox="0 0 24 24">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
          </svg>
          Кол-во участников: {memberCount}
        </p>
        <p>
          <CityIcon />
          {sportClub.city.city}
        </p>
        <p>
          <SportIcon />
          {sportClub.sport.type}
        </p>
        {!isUserMember && user && !hasSubmittedRequest && (
          <button onClick={handleJoinClick} className="join-button">
            {sportClub.openCommunity ? "Вступить в клуб" : "Подать заявку"}
          </button>
        )}
        {!isUserMember && user && hasSubmittedRequest && (
          <button
            onClick={handleCancelRequest}
            className="cancel-request-button"
          >
            {sportClub.openCommunity ? "Отменить заявку" : "Отменить заявку"}
          </button>
        )}
      </div>
    </div>
  );
}
