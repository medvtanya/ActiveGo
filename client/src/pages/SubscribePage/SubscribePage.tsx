import { useLocation, useNavigate } from "react-router";
import { useAppSelector, useAppDispatch } from "@/shared/hooks/reduxHooks";
import { useEffect } from "react";
import { getAllSportClubMembersThunk } from "@/entities/sportClubMemberes/api/sportClubMemberesApi";
import { getOneSportClubThunk } from "@/entities/sportClub/api/sportClubApi";
import "./SubscribePage.css";

export default function SubscribePage() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const searchParams = new URLSearchParams(location.search);
  const clubId = Number(searchParams.get("clubId"));
  const currentSportClub = useAppSelector(
    (state) => state.sportClub.currentSportClub
  );
  const sportClubMembers = useAppSelector(
    (state) => state.sportClubMember.sportClubMembers
  );

  useEffect(() => {
    if (clubId) {
      dispatch(getOneSportClubThunk(clubId));
      dispatch(getAllSportClubMembersThunk());
    }
  }, [dispatch, clubId]);

  const clubMembers = sportClubMembers.filter(
    (member) => member.sportClub_id === clubId
  );
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="dark-subscribe-page">
      <div className="subscribe-header">
        <button
          className="dark-back-button"
          onClick={handleGoBack}
          aria-label="Назад"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 12H5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 19L5 12L12 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="club-title-container">
          <span className="club-subtitle">Подписчики клуба</span>
          <h1 className="club-name">{currentSportClub?.title}</h1>
        </div>
      </div>
      <div className="dark-members-list">
        {clubMembers.length === 0 ? (
          <p className="dark-no-members">Участники не найдены</p>
        ) : (
          clubMembers.map((member) => (
            <div key={member.id} className="dark-member-item">
              <div className="dark-member-photo">
                {member.user?.photo ? (
                  <img
                    src={
                      member.user.photo.startsWith("http")
                        ? member.user.photo
                        : `${import.meta.env.VITE_API_URL}/images/${
                            member.user.photo
                          }`
                    }
                    alt={member.user.userName}
                    className="dark-member-avatar"
                  />
                ) : (
                  <div className="dark-member-avatar-placeholder">
                    {member.user?.userName?.charAt(0) || "?"}
                  </div>
                )}
              </div>
              <div className="dark-member-info">
                <span className="dark-member-name">
                  {member.user?.userName || "Без имени"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
