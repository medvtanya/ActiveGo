import { useParams, useNavigate } from "react-router";
import { useMemo, useState } from "react";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxHooks";
import {
  deleteSportClubThunk,
  getOneSportClubThunk,
} from "@/entities/sportClub/api/sportClubApi";
import {
  getAllSportClubMembersThunk,
  createSportClubMemberThunk,
  deleteSportClubMemberThunk,
} from "@/entities/sportClubMemberes/api/sportClubMemberesApi";
import { CLIENT_ROUTES } from "@/shared/enums/clientRoutes";
import { UpdateSportClub } from "@/widgets/UpdateSportClub/UpdateSportClub";
import "./OmeSportClubPage.css";

export default function OneSportClubPage() {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isSubscribersExpanded, setIsSubscribersExpanded] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentSportClub = useAppSelector(
    (state) => state.sportClub.currentSportClub
  );
  const sportClubMembers = useAppSelector(
    (state) => state.sportClubMember.sportClubMembers
  );

  const user = useAppSelector((state) => state.user.user);

  const numberParticipants = sportClubMembers.filter(
    (member) => member.sportClub_id === Number(id) && member.access
  ).length;

  const myMembership = sportClubMembers.find(
    (member) =>
      member.sportClub_id === Number(id) &&
      member.user_id === user?.id &&
      member.access
  );

  const isOwner = currentSportClub?.owner?.id === user?.id;

  const pendingRequestsCount = sportClubMembers.filter(
    (member) => member.sportClub_id === Number(id) && !member.access
  ).length;

  const isClubMember = useMemo(() => {
    if (!sportClubMembers.length || !user?.id) return false;

    return sportClubMembers.some(
      (member) =>
        member.sportClub_id === Number(id) && member.user_id === user?.id
    );
  }, [sportClubMembers, user?.id, id]);

  const handleChatClick = () => {
    if (!isClubMember) {
      alert("Чат доступен только участникам клуба");
      return;
    }
    navigate(CLIENT_ROUTES.CHAT + `?clubId=${id}`);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleJoin = () => {
    if (user && id && currentSportClub) {
      setIsJoining(true);
      console.log("Начинаем вступление в клуб:", { user: user.id, club: id });

      const access = currentSportClub.openCommunity;

      dispatch(
        createSportClubMemberThunk({
          sportClub_id: Number(id),
          user_id: user.id,
          access: access,
        })
      )
        .unwrap()
        .then((result) => {
          console.log("Успешно вступили в клуб:", result);
          return dispatch(getAllSportClubMembersThunk());
        })
        .then(() => {
          console.log("Данные участников обновлены после вступления");
        })
        .catch((error) => {
          console.error("Ошибка при вступлении в клуб:", error);
        })
        .finally(() => {
          setIsJoining(false);
        });
    }
  };

  const handleLeave = () => {
    if (myMembership) {
      setIsLeaving(true);
      dispatch(deleteSportClubMemberThunk(myMembership.id))
        .then(() => {
          dispatch(getAllSportClubMembersThunk());
          navigate(-1);
        })
        .catch((error) => {
          console.error("Ошибка при выходе из клуба:", error);
        })
        .finally(() => {
          setIsLeaving(false);
          setShowLeaveConfirm(false);
        });
    }
  };

  const handleDelete = async () => {
    if (currentSportClub) {
      try {
        await dispatch(deleteSportClubThunk(currentSportClub.id)).unwrap();
        navigate(CLIENT_ROUTES.SPORT_CLUB);
      } catch (error) {
        console.error("Ошибка при удалении клуба:", error);
      } finally {
        setShowDeleteConfirm(false);
      }
    }
  };

  const handleUpdateSuccess = () => {
    dispatch(getOneSportClubThunk(Number(id)));
    dispatch(getAllSportClubMembersThunk());
  };

  const handleAccessRequests = () => {
    navigate(CLIENT_ROUTES.ACCESS_SPORT_CLUB + `?clubId=${id}`);
  };

  const approvedSubscribers = sportClubMembers.filter(
    (member) =>
      member.sportClub_id === Number(id) && member.access && member.user
  );

  const sortedSubscribers = approvedSubscribers.sort((a, b) => {
    if (a.user_id === currentSportClub?.owner?.id) return -1;
    if (b.user_id === currentSportClub?.owner?.id) return 1;
    return 0;
  });

  const subscribersToShow = isSubscribersExpanded
    ? sortedSubscribers
    : sortedSubscribers.slice(0, 3);

  const hasMoreSubscribers = sortedSubscribers.length > 3;

  useEffect(() => {
    console.log("Загружаем данные клуба и участников");
    dispatch(getOneSportClubThunk(Number(id)));
    dispatch(getAllSportClubMembersThunk());
  }, [dispatch, id]);

  useEffect(() => {
    console.log("Участники клуба обновлены:", sportClubMembers.length);
    console.log("Текущий пользователь:", user?.id);
    console.log("Мое членство:", myMembership);
  }, [sportClubMembers, user?.id, myMembership]);

  if (!currentSportClub) {
    return (
      <div className="details-event-page">
        <div className="loading-state">Загрузка клуба...</div>
      </div>
    );
  }

  return (
    <div className="details-event-page">
      <div className="event-photos">
        <button className="back-button" onClick={handleGoBack}>
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

        <img
          className="main-photo"
          src={
            currentSportClub?.photo
              ? `${import.meta.env.VITE_API_URL}/images/${
                  currentSportClub.photo
                }`
              : "/placeholder-club.jpg"
          }
          alt={currentSportClub?.title}
        />

        <span
          className={`club-status ${
            currentSportClub?.openCommunity ? "open" : "closed"
          }`}
        >
          {currentSportClub?.openCommunity ? "Открытый" : "Закрытый"}
        </span>
      </div>

      <div className="event-content">
        <h1 className="event-title">{currentSportClub?.title}</h1>

        <div className="event-meta">
          <div className="meta-item">
            <span className="meta-label">Вид спорта</span>
            <span className="meta-value">{currentSportClub?.sport.type}</span>
          </div>

          <div className="meta-item">
            <span className="meta-label">Город</span>
            <span className="meta-value">{currentSportClub?.city.city}</span>
          </div>

          <div className="meta-item">
            <span className="meta-label">Участников</span>
            <span className="meta-value">{numberParticipants}</span>
          </div>

          <div className="meta-item">
            <span className="meta-label">Тип</span>
            <span className="meta-value">
              {currentSportClub?.openCommunity ? "Открытый" : "Закрытый"}
            </span>
          </div>
        </div>

        <div className="event-actions">
          <button
            className="club-button"
            onClick={handleChatClick}
            style={{ opacity: isClubMember ? 1 : 0.35 }}
          >
            Чат 💬
          </button>
        </div>

        <div className="event-description">
          <h3>Описание</h3>
          <p>{currentSportClub?.content}</p>
        </div>

        <div className="event-description">
          <h3>Участники клуба</h3>
          <div className="subscribers-list">
            {subscribersToShow.map((member) => (
              <div key={member.id} className="subscriber-item">
                <div className="subscriber-photo">
                  {member.user?.telegram_photo ? (
                    <img
                      src={
                        member.user.telegram_photo.startsWith("https")
                          ? member.user.telegram_photo
                          : `${import.meta.env.VITE_API_URL}${
                              member.user.telegram_photo
                            }`
                      }
                      alt={member.user?.userName || "Пользователь"}
                      className="subscriber-avatar"
                    />
                  ) : (
                    <div className="subscriber-avatar-placeholder">
                      {member.user?.userName?.charAt(0) || "?"}
                    </div>
                  )}
                </div>
                <div className="subscriber-info">
                  <button
                    className="subscriber-name-button"
                    onClick={() =>
                      member.user?.id && navigate(`/user/${member.user.id}`)
                    }
                    title="Посмотреть профиль"
                    disabled={!member.user?.id}
                  >
                    {member.user?.userName || "Без имени"}
                  </button>
                </div>
                {member.user_id === currentSportClub?.owner?.id && (
                  <span className="owner-badge">Организатор</span>
                )}
              </div>
            ))}
            {approvedSubscribers.length === 0 && (
              <p className="no-subscribers">Участники не найдены</p>
            )}
            {hasMoreSubscribers && (
              <button
                className="expand-subscribers-btn"
                onClick={() => setIsSubscribersExpanded(!isSubscribersExpanded)}
              >
                {isSubscribersExpanded ? (
                  <>
                    Свернуть
                    <svg
                      className="expand-icon"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M18 15L12 9L6 15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                ) : (
                  <>
                    Показать еще ({sortedSubscribers.length - 3})
                    <svg
                      className="expand-icon"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M6 9L12 15L18 9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="event-actions">
          {isOwner ? (
            <>
              <button
                className="club-button"
                onClick={() => setIsUpdateModalOpen(true)}
              >
                Редактировать
              </button>
              <button
                className="club-button delete"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Удалить
              </button>
              {pendingRequestsCount > 0 && (
                <button
                  className="club-button requests"
                  onClick={handleAccessRequests}
                >
                  Актуальные заявки
                  <span className="requests-badge">{pendingRequestsCount}</span>
                </button>
              )}
            </>
          ) : (
            <>
              {myMembership ? (
                <button
                  className="club-button"
                  onClick={() => setShowLeaveConfirm(true)}
                  disabled={isLeaving}
                >
                  {isLeaving ? "Выходим..." : "Выйти"}
                </button>
              ) : (
                <button
                  className="club-button"
                  onClick={handleJoin}
                  disabled={isJoining}
                >
                  {isJoining ? "Вступаем..." : "Вступить"}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {isUpdateModalOpen && currentSportClub && (
        <UpdateSportClub
          club={currentSportClub}
          onClose={() => setIsUpdateModalOpen(false)}
          onSuccess={handleUpdateSuccess}
        />
      )}

      {showLeaveConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Подтверждение выхода</h3>
            <p>Вы точно хотите выйти из клуба "{currentSportClub?.title}"?</p>
            <div className="modal-actions">
              <button
                onClick={() => setShowLeaveConfirm(false)}
                className="modal-button cancel"
              >
                Отмена
              </button>
              <button
                onClick={handleLeave}
                disabled={isLeaving}
                className="modal-button confirm"
              >
                {isLeaving ? "Выходим..." : "Выйти"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Удаление клуба</h3>
            <p>Вы точно хотите удалить клуб "{currentSportClub?.title}"?</p>
            <div className="modal-actions">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="modal-button cancel"
              >
                Отмена
              </button>
              <button onClick={handleDelete} className="modal-button confirm">
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
