import React, { useState, useRef, useEffect } from "react";
import "./CustomDatePicker.css";

interface CustomDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  min?: string;
  max?: string;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  placeholder = "Выберите дату",
  min,
  max,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
    }
  }, [value]);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    // Преобразуем так, чтобы понедельник был 0, воскресенье было 6
    return day === 0 ? 6 : day - 1;
  };

  const getDaysArray = (date: Date): (Date | null)[] => {
    const daysInMonth = getDaysInMonth(date);
    const firstDay = getFirstDayOfMonth(date);
    const days: (Date | null)[] = [];

    for (let i = firstDay; i > 0; i--) {
      const prevDate = new Date(
        date.getFullYear(),
        date.getMonth() - 1,
        getDaysInMonth(new Date(date.getFullYear(), date.getMonth() - 1, 1)) - i + 1
      );
      days.push(prevDate);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(date.getFullYear(), date.getMonth(), i);
      days.push(currentDate);
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(date.getFullYear(), date.getMonth() + 1, i);
      days.push(nextDate);
    }

    return days;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    onChange(formatDate(date));
    setIsOpen(false);
  };

  const handlePrevMonth = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleToday = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
    onChange(formatDate(today));
    setIsOpen(false);
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date): boolean => {
    return selectedDate
      ? date.toDateString() === selectedDate.toDateString()
      : false;
  };

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentDate.getMonth();
  };

  const isDisabled = (date: Date): boolean => {
    if (min && date < new Date(min)) return true;
    if (max && date > new Date(max)) return true;
    return false;
  };

  const monthNames = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];

  const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  return (
    <div className="custom-date-picker" ref={containerRef}>
      <div className="date-input" onClick={() => setIsOpen(!isOpen)}>
        <input
          type="text"
          value={selectedDate ? formatDate(selectedDate) : ""}
          placeholder={placeholder}
          readOnly
        />
        <svg
          className="calendar-icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 2V5M16 2V5M3 8H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z"
            stroke="hsl(81deg 70% 65%)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="calendar-popup">
          <div className="calendar-header">
            <button className="nav-button" onClick={(e) => handlePrevMonth(e)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="month-year">
              <span className="month">
                {monthNames[currentDate.getMonth()]}
              </span>
              <span className="year">{currentDate.getFullYear()}</span>
            </div>

            <button className="nav-button" onClick={(e) => handleNextMonth(e)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="calendar-body">
            <div className="days-header">
              {dayNames.map((day) => (
                <div key={day} className="day-name">
                  {day}
                </div>
              ))}
            </div>

            <div className="days-grid">
              {getDaysArray(currentDate).map((date, index) => (
                <button
                  key={index}
                  className={`day-button ${
                    date && isToday(date) ? "today" : ""
                  } ${date && isSelected(date) ? "selected" : ""} ${
                    date && !isCurrentMonth(date) ? "other-month" : ""
                  } ${date && isDisabled(date) ? "disabled" : ""}`}
                  onClick={() =>
                    date && !isDisabled(date) && handleDateSelect(date)
                  }
                  disabled={!date || isDisabled(date)}
                >
                  {date ? date.getDate() : ""}
                </button>
              ))}
            </div>
          </div>

          <div className="calendar-footer">
            <button className="today-button" onClick={(e) => handleToday(e)}>
              Сегодня
            </button>
            <button
              className="clear-button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedDate(null);
                onChange("");
                setIsOpen(false);
              }}
            >
              Очистить
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
