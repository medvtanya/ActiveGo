import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/reduxHooks';
import {
  getEventsWithComplaintsThunk,
  deleteEventThunk,
} from '@/entities/event/api/eventApi';
import { deleteComplaintThunk } from '@/entities/complaint/api/complaintApi';
import { logoutUserThunk } from '@/entities/user/api/userApi';
import { ConfirmationModal } from '@/shared/ui/ConfirmationModal';
import type { ComplaintType } from '@/entities/complaint/model';
import EventCard from '@/widgets/EventCard/EventCard';
import { Button } from '@/shared/ui/Button';
import './IsAdminPage.css';
import { CLIENT_ROUTES } from '@/shared/enums/clientRoutes';
import { useNavigate } from 'react-router-dom';

const IsAdminPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user.user);
  const isAuth = useAppSelector((state) => state.user.isAuth);
  const userLoading = useAppSelector((state) => state.user.loading);

  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteEventConfirm, setShowDeleteEventConfirm] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);

  const { events, isLoading, error } = useAppSelector((state) => state.event);

  useEffect(() => {
    if (isAuth && user && !userLoading) {
      dispatch(getEventsWithComplaintsThunk());
    }
  }, [dispatch, isAuth, user, userLoading]);

  useEffect(() => {
    const savedEventId = localStorage.getItem('adminSelectedEventId');
    if (savedEventId) {
      setSelectedEventId(parseInt(savedEventId));
    }
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      localStorage.setItem('adminSelectedEventId', selectedEventId.toString());
    } else {
      localStorage.removeItem('adminSelectedEventId');
    }
  }, [selectedEventId]);

  useEffect(() => {
    dispatch({
      type: 'user/getUserThunk/fulfilled',
      payload: {
        user: user,
        userIsAdmin: user?.isAdmin,
      },
    });
  }, [dispatch, user]);

  if (isAuth && user && !userLoading) {
    dispatch({
      type: 'user/getUserThunk/fulfilled',
      payload: {
        user: user,
        userIsAdmin: user?.isAdmin,
      },
    });
  }

  const handleEventClick = (eventId: number) => {
    setSelectedEventId(eventId);

    const eventWithComplaints = events?.find((event) => event.id === eventId);
    if (eventWithComplaints) {
      dispatch({
        type: 'event/getOneEventThunk/fulfilled',
        payload: eventWithComplaints,
      });
    }
  };

  const selectedEvent = selectedEventId
    ? events?.find((event) => event.id === selectedEventId)
    : null;

  const handleRejectComplaint = async (complaintId: number) => {
    try {
      await dispatch(deleteComplaintThunk(complaintId)).unwrap();

      dispatch(getEventsWithComplaintsThunk());
      setSelectedEventId(null);
      localStorage.removeItem('adminSelectedEventId');
    } catch (error) {
      console.error('Ошибка при отклонении жалобы:', error);
      alert('Ошибка при отклонении жалобы');
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    setEventToDelete(eventId);
    setShowDeleteEventConfirm(true);
  };

  const handleConfirmDeleteEvent = async () => {
    if (!eventToDelete) return;

    try {
      await dispatch(deleteEventThunk(eventToDelete)).unwrap();

      dispatch(getEventsWithComplaintsThunk());
      setSelectedEventId(null);
      localStorage.removeItem('adminSelectedEventId');
    } catch (error) {
      console.error('Ошибка при удалении события:', error);
      alert('Ошибка при удалении события');
    } finally {
      setShowDeleteEventConfirm(false);
      setEventToDelete(null);
    }
  };

  const handleCancelDeleteEvent = () => {
    setShowDeleteEventConfirm(false);
    setEventToDelete(null);
  };

  const handleLogout = async () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = async () => {
    try {
      await dispatch(logoutUserThunk()).unwrap();
      navigate(CLIENT_ROUTES.HOME);
    } catch (error) {
      console.error('Ошибка при выходе:', error);
      alert('Ошибка при выходе из системы');
    } finally {
      setShowLogoutConfirm(false);
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  if (isLoading || userLoading) {
    return <div className="admin-loading">Загрузка...</div>;
  }

  if (!isAuth || !user || !user.isAdmin) {
    return (
      <div className="admin-page">
        <div className="admin-header">
          <h1>Ошибка доступа</h1>
          <p>Недостаточно прав для доступа к панели администратора</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="admin-header">
          <h1>Ошибка доступа</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-header-content">
          <div className="admin-header-text">
            <h1>Панель администратора</h1>
            <p>События с жалобами пользователей</p>
          </div>
          <div style={{ position: 'relative' }}>
            <Button onClick={handleLogout} variant="secondary">
              Выйти
            </Button>
          </div>
        </div>
      </div>

      {selectedEventId && selectedEvent ? (
        <div className="admin-event-details">
          <div className="event-details-header">
            <Button
              onClick={() => {
                setSelectedEventId(null);
                localStorage.removeItem('adminSelectedEventId');
              }}
              variant="secondary"
            >
              ← Назад к списку
            </Button>
            <h2>Детали события</h2>
          </div>

          <div className="event-card-container">
            <EventCard
              event={selectedEvent}
              onClick={() => {}}
              isClickable={false}
            />
          </div>

          <div className="complaints-section">
            <h3>Жалобы на это событие:</h3>
            {selectedEvent.complaints && selectedEvent.complaints.length > 0 ? (
              <div className="complaints-list">
                {selectedEvent.complaints.map((complaint: ComplaintType) => (
                  <div key={complaint.id} className="complaint-item">
                    <div className="complaint-content">
                      <p>
                        <strong>Тип жалобы:</strong>{' '}
                        {complaint.type_Of_complaint?.join(', ')}
                      </p>
                      <p>
                        <strong>Описание:</strong> {complaint.content}
                      </p>
                      <p>
                        <strong>Дата:</strong>{' '}
                        {new Date(complaint.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="complaint-actions">
                      <Button
                        onClick={() => handleRejectComplaint(complaint.id)}
                        variant="secondary"
                        size="small"
                      >
                        Отклонить жалобу
                      </Button>
                      <Button
                        onClick={() => handleDeleteEvent(selectedEvent.id)}
                        variant="danger"
                        size="small"
                      >
                        Удалить событие
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Жалоб на это событие нет</p>
            )}
          </div>
        </div>
      ) : (
        <div className="events-list">
          {events && events.length > 0 ? (
            <div className="events-grid">
              {events.map((event) => (
                <div key={event.id} className="event-item">
                  <EventCard
                    event={event}
                    onClick={() => handleEventClick(event.id)}
                    isClickable={true}
                  />
                  <div className="event-complaints-count">
                    <span className="complaints-badge">
                      {event.complaints?.length || 0} жалоб
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-events">
              <p>Нет событий с жалобами</p>
            </div>
          )}
        </div>
      )}

      <ConfirmationModal
        isOpen={showLogoutConfirm}
        title="Подтверждение выхода"
        message="Вы точно хотите выйти из аккаунта?"
        confirmText="Выйти"
        cancelText="Отмена"
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
        variant="danger"
      />

      <ConfirmationModal
        isOpen={showDeleteEventConfirm}
        title="Подтверждение удаления события"
        message="Вы уверены, что хотите удалить это событие? Это действие нельзя отменить."
        confirmText="Удалить"
        cancelText="Отмена"
        onConfirm={handleConfirmDeleteEvent}
        onCancel={handleCancelDeleteEvent}
        variant="danger"
      />
    </div>
  );
};

export default IsAdminPage;
