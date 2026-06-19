import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxHooks";
import { useNavigate, useParams } from "react-router-dom";
import {
  getOneEventThunk,
  leaveEventThunk,
  getAllEventsThunk,
  getMyActiveEventsThunk,
} from "@/entities/event/api/eventApi";
import { createComplaintThunk } from "@/entities/complaint/api/complaintApi";
import { joinEventThunk } from "@/entities/event/api/eventApi";
import { deleteEventThunk } from "@/entities/event/api/eventApi";
import { Button } from "@/shared/ui/Button";
import { useEffect, useState } from "react";
import type {
  ComplaintChooseType,
  CreateComplaintDto,
} from "@/entities/complaint/model";
import { toast } from "react-toastify";
import "./DetailsEvemtPage.css";
import { EditEventModal } from "@/widgets/EditEventModal/EditEventModal";
import { OneEventMapWidget } from "@/widgets/mapWidgetes/getOneEventMap/OneEventMapWidget";

const DetailsEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { event } = useAppSelector((state) => state.event);
  const currentUser = useAppSelector((state) => state.user.user);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [complaintReason, setComplaintReason] = useState<ComplaintChooseType>(
    "оскорбительный контент"
  );
  const [complaintText, setComplaintText] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showComplaintDropdown, setShowComplaintDropdown] = useState(false);

  const complaintOptions = [
    { value: "оскорбительный контент", label: "Оскорбительный контент" },
    { value: "ненависть и преследование", label: "Ненависть и преследование" },
    {
      value: "опасные действия и челленджи",
      label: "Опасные действия и челленджи",
    },
    { value: "дезинформация", label: "Дезинформация" },
    { value: "мошенничество и обман", label: "Мошенничество и обман" },
    {
      value: "насилие, унижение и криминальная эксплуатация",
      label: "Насилие, унижение и криминальная эксплуатация",
    },
  ];

  const handleComplaintSelect = (value: string) => {
    setComplaintReason(value as ComplaintChooseType);
    setShowComplaintDropdown(false);
  };

  useEffect(() => {
    if (id) {
      dispatch(getOneEventThunk(Number(id)));
    }
  }, [dispatch, id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!event) {
    return <div className="loading-state">Загрузка события...</div>;
  }
  const eventDate = new Date(event.date);
  const isPastEvent = eventDate < new Date();
  const isCreator = currentUser?.id === event.userId;

  const handleDeleteEvent = async () => {
    try {
      await dispatch(deleteEventThunk(event.id)).unwrap();
      toast.success("Событие успешно удалено");
      dispatch(getAllEventsThunk());
      navigate("/events");
    } catch (error) {
      toast.error("Ошибка при удалении события");
      console.error("Ошибка при удалении события:", error);
    }
  };

  const handleEditEvent = () => {
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    if (id) {
      dispatch(getOneEventThunk(Number(id)));
    }
  };

  const handleJoinEvent = async () => {
    if (!currentUser) {
      toast.error("Необходимо авторизоваться");
      return;
    }

    try {
      await dispatch(
        joinEventThunk({
          eventId: event.id,
        })
      ).unwrap();

      toast.success("Вы успешно подписались на событие!");
      dispatch(getOneEventThunk(Number(id)));
      dispatch(getAllEventsThunk());
      dispatch(getMyActiveEventsThunk());
    } catch (error) {
      toast.error("Ошибка при подписке на событие");
      console.error("Ошибка при подписке на событие:", error);
    }
  };
  const handleViewGallery = () => {
    navigate(`/event/gallery/${event.id}`);
  };
  const handleComplaintSubmit = async () => {
    if (!currentUser) {
      toast.error("Необходимо авторизоваться");
      return;
    }
    if (!complaintText.trim()) {
      toast.error("Пожалуйста, опишите проблему");
      return;
    }
    try {
      const complaintData: CreateComplaintDto = {
        userId: currentUser.id,
        eventId: event.id,
        content: complaintText,
        type_Of_complaint: [complaintReason],
      };

      await dispatch(createComplaintThunk(complaintData)).unwrap();
      toast.success("Жалоба успешно отправлена!");
      setShowComplaintForm(false);
      setComplaintText("");
    } catch (error) {
      toast.error("Ошибка при отправке жалобы");
      console.error("Ошибка при отправке жалобы:", error);
    }
  };

  const handleLeaveEvent = async () => {
    if (!currentUser) {
      toast.error("Необходимо авторизоваться");
      return;
    }

    try {
      await dispatch(leaveEventThunk({ eventId: event.id })).unwrap();
      toast.success("Вы вышли из события");
      dispatch(getOneEventThunk(Number(id)));
      dispatch(getMyActiveEventsThunk());
    } catch {
      toast.error("Ошибка выхода");
    }
  };

  type Participant = { id: number };
  type EventWithParticipants = typeof event & { participants?: Participant[] };
  const eventWithParticipants = event as EventWithParticipants;

  const isParticipant =
    !!currentUser &&
    Array.isArray(eventWithParticipants.participants) &&
    eventWithParticipants.participants.some((p) => p.id === currentUser.id);

  const goToNextPhoto = () => {
    setCurrentPhotoIndex((prev) =>
      prev === event.photos.length - 1 ? 0 : prev + 1
    );
  };

  const goToPrevPhoto = () => {
    setCurrentPhotoIndex((prev) =>
      prev === 0 ? event.photos.length - 1 : prev - 1
    );
  };

  return (
    <div className="details-event-page">
      <div className="event-photos">
        <button
          className="back-button"
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

        {event.photos.length > 1 && (
          <>
            <button
              className="photo-nav-button prev-button"
              onClick={goToPrevPhoto}
              aria-label="Предыдущее фото"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              className="photo-nav-button next-button"
              onClick={goToNextPhoto}
              aria-label="Следующее фото"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="photo-counters">
              {currentPhotoIndex + 1} / {event.photos.length}
            </div>
          </>
        )}

        <img
          src={`${import.meta.env.VITE_API_URL}/api/${
            event.photos[currentPhotoIndex]
          }`}
          alt={`${event.title} ${currentPhotoIndex + 1}`}
          className="main-photo"
        />
      </div>

      <div className="event-content">
        <h1 className="event-title">{event.title}</h1>

        <div className="event-meta">
          <div className="meta-item">
            <span className="meta-label">Дата</span>
            <span className="meta-value">{eventDate.toLocaleDateString()}</span>
          </div>

          <div className="meta-item">
            <span className="meta-label">Время</span>
            <span className="meta-value">
              {eventDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <div className="meta-item">
            <span className="meta-label">Участники</span>
            <span className="meta-value">{event.member}</span>
          </div>

          <div className="meta-item">
            <span className="meta-label">Место проведения</span>
            <span className="meta-value">{event.location}</span>
          </div>
        </div>

        <div className="meta-item">
          <span className="meta-labels">Уровень подготовки</span>
          <div className="level-badges">
            {event.level?.map((level) => (
              <span
                key={level}
                className={`level-badge ${
                  level.toLowerCase() === "beginner"
                    ? "beginner"
                    : level.toLowerCase() === "middle"
                    ? "middle"
                    : "professional"
                }`}
              >
                {level}
              </span>
            ))}
          </div>
        </div>

        <div className="event-map-widget">
          <h3>Место проведения</h3>
          <div className="map-containerw">
            <OneEventMapWidget eventId={event.id} />
          </div>
        </div>

        <div className="event-description">
          <h3>Описание</h3>
          <p>{event.content}</p>
        </div>

        <div className="event-actions">
          {isCreator ? (
            <>
              <Button variant="secondary" onClick={handleEditEvent}>
                Редактировать
              </Button>
              <Button variant="danger" onClick={handleDeleteEvent}>
                Удалить
              </Button>
            </>
          ) : isPastEvent ? (
            isParticipant && (
              <Button variant="primary" onClick={handleViewGallery}>
                Посмотреть галерею
              </Button>
            )
          ) : isParticipant ? (
            <>
              <Button variant="danger" onClick={handleLeaveEvent}>
                Выйти из события
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowComplaintForm(true)}
              >
                Пожаловаться
              </Button>
            </>
          ) : (
            <>
              <Button variant="primary" onClick={handleJoinEvent}>
                Стать участником
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowComplaintForm(true)}
              >
                Пожаловаться
              </Button>
            </>
          )}
        </div>

        {showComplaintForm && (
          <div className="complaint-form">
            <h3>Пожаловаться на событие</h3>
            <div className="complaint-selector">
              <input
                type="text"
                placeholder="Выберите причину жалобы"
                value={
                  complaintReason.length > 25
                    ? complaintReason.substring(0, 25) + "..."
                    : complaintReason
                }
                onChange={(e) => {
                  setComplaintReason(e.target.value as ComplaintChooseType);
                  setShowComplaintDropdown(true);
                }}
                onFocus={() => setShowComplaintDropdown(true)}
                onBlur={() =>
                  setTimeout(() => setShowComplaintDropdown(false), 200)
                }
              />
              <svg
                className="dropdown-arrow"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="hsl(81deg 70% 65%)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {showComplaintDropdown && (
                <div className="dropdown-menu">
                  {complaintOptions.map((option) => (
                    <div
                      key={option.value}
                      className="dropdown-item"
                      onClick={() => handleComplaintSelect(option.value)}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="textarea-container">
              <textarea
                placeholder="Опишите проблему..."
                value={complaintText}
                onChange={(e) => {
                  if (e.target.value.length <= 250) {
                    setComplaintText(e.target.value);
                  }
                }}
                className={
                  complaintText.length >= 250 ? "textarea-limit-reached" : ""
                }
              />
              <div className="char-counter">{complaintText.length}/250</div>
            </div>
            <div className="complaint-actions">
              <Button
                variant="secondary"
                onClick={() => setShowComplaintForm(false)}
              >
                Отмена
              </Button>
              <Button
                variant="danger"
                onClick={handleComplaintSubmit}
                disabled={!complaintText.trim()}
              >
                Пожаловаться
              </Button>
            </div>
          </div>
        )}
      </div>

      {isEditModalOpen && event && (
        <EditEventModal
          event={event}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

export default DetailsEventPage;
