import { useAppDispatch, useAppSelector } from '@/shared/hooks/reduxHooks';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllEventsThunk,
  getMyActiveEventsThunk,
} from '@/entities/event/api/eventApi';
import type { EventType } from '@/entities/event/model';
import './EventPage.css';
import EventCard from '@/widgets/EventCard/EventCard';
import { CLIENT_ROUTES } from '@/shared/enums/clientRoutes';

const EventPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { events, isLoading, error } = useAppSelector((state) => state.event);
  const currentUser = useAppSelector((state) => state.user.user);
  const myActiveEvents = useAppSelector((state) => state.event.myActiveEvents);
  const { cities } = useAppSelector((state) => state.city);
  const { sports } = useAppSelector((state) => state.sport);

  const [activeTab, setActiveTab] = useState<'active' | 'past' | 'my' | 'all'>(
    'active'
  );
  const [filteredEvents, setFilteredEvents] = useState<EventType[]>([]);

  useEffect(() => {
    dispatch(getAllEventsThunk());
    dispatch(getMyActiveEventsThunk());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getMyActiveEventsThunk());
  }, [events, currentUser, dispatch]);

  useEffect(() => {
    filterEvents();
  }, [events, activeTab, currentUser]);

  const filterEvents = () => {
    const now = new Date();
    let result = [...(events || [])];

    switch (activeTab) {
      case 'active':
        result = myActiveEvents || [];
        break;
      case 'past':
        result = result.filter(
          (event) => new Date(event.date) < now && event.member > 0
        );
        break;
      case 'my':
        result = currentUser
          ? result.filter((event) => event.userId === currentUser.id)
          : [];
        break;
      case 'all':
        break;
    }

    setFilteredEvents(result);
  };

  const handleEventClick = (eventId: number) => {
    navigate(`${CLIENT_ROUTES.EVENT}/${eventId}`);
  };

  const getCityName = (cityId: number) => {
    const city = cities.find((c) => c.id === cityId);
    return city ? city.city : `Город #${cityId}`;
  };

  if (isLoading) return <div className="loading-state">Загрузка...</div>;
  if (error) return <div className="error-state">Ошибка: {error}</div>;

  return (
    <div className="event-page">
      <h1 className="page-title">Мои события</h1>

      <div className="tab-menu">
        <button
          className={`tab-button ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
          data-count={myActiveEvents?.length || 0}
        >
          Активные
        </button>
        <button
          className={`tab-button ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}
          data-count={
            events?.filter((e) => new Date(e.date) < new Date() && e.member > 0)
              .length || 0
          }
        >
          Прошедшие
        </button>
        <button
          className={`tab-button ${activeTab === 'my' ? 'active' : ''}`}
          onClick={() => setActiveTab('my')}
          data-count={
            currentUser
              ? events?.filter((e) => e.userId === currentUser.id).length || 0
              : 0
          }
        >
          Мои события
        </button>
        <button
          className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
          data-count={events?.length || 0}
        >
          Все события
        </button>
      </div>

      <div className="events-list">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={{
                ...event,
                location: `${event.location}, ${getCityName(event.cityId)}`,
                sportType:
                  (sports || []).find((s) => s.id === event.sportId)?.type ||
                  "",
              }}
              onClick={() => handleEventClick(event.id)}
              isClickable={true}
            />
          ))
        ) : (
          <div className="no-events">
            {activeTab === 'active'
              ? 'Нет активных событий'
              : activeTab === 'past'
              ? 'Нет прошедших событий'
              : activeTab === 'my'
              ? 'Вы еще не создавали событий'
              : 'События не найдены'}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventPage;
