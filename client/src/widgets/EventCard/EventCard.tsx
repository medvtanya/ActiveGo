import React from "react";
import type { EventType } from "@/entities/event/model";
import "./EventCard.css";

interface EventCardProps {
  event: EventType;
  onClick: () => void;
  isClickable: boolean;
  onLocationClick?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  onClick,
  isClickable,
  onLocationClick,
}) => {
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString();
  const formattedTime = eventDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`event-card ${isClickable ? "clickable" : ""}`}
      onClick={isClickable ? onClick : undefined}
      data-augmented-ui="
        tl-clip tr-clip bl-clip br-clip 
        border
      "
    >
      <div className="card-background" aria-hidden="true"></div>
      <div className="sport-badge" data-glow>
        {event.sportType}
        <span className="badge-pulse"></span>
      </div>
      <h3 className="event-title">{event.title}</h3>
      <div className="event-time">
        <span className="spandex">
          Дата: <span className="time-data">{formattedDate}</span>
        </span>
        <div className="time-separator"></div>
        <span className="spandex">
          Время: <span className="time-data">{formattedTime}</span>
        </span>
      </div>
      <div className="event-location">
        <svg
          className="location-icon"
          viewBox="0 0 24 24"
          onClick={(e) => {
            e.stopPropagation();
            onLocationClick?.();
          }}
          style={{ cursor: "pointer" }}
        >
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
        {event.location}
      </div>
      <div className="participants-count">
        <svg className="participants-icon" viewBox="0 0 24 24">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
        </svg>
        Участников: {event.member}
      </div>
      <div className="card-gradient-overlay" aria-hidden="true"></div>
    </div>
  );
};

export default EventCard;
