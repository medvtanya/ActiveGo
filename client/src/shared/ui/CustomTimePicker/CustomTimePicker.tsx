import React, { useState, useRef, useEffect } from "react";
import "./CustomTimePicker.css";

interface CustomTimePickerProps {
  value: string;
  onChange: (time: string) => void;
  placeholder?: string;
  min?: string;
  max?: string;
}

export const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  value,
  onChange,
  placeholder = "Выберите время",
  min,
  max,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState<number | null>(
    value ? parseInt(value.split(":")[0]) : null
  );
  const [selectedMinute, setSelectedMinute] = useState<number | null>(
    value ? parseInt(value.split(":")[1]) : null
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
      const [hour, minute] = value.split(":");
      setSelectedHour(parseInt(hour));
      setSelectedMinute(parseInt(minute));
    }
  }, [value]);

  const formatTime = (hour: number, minute: number): string => {
    return `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  };

  const handleTimeSelect = (hour: number, minute: number) => {
    setSelectedHour(hour);
    setSelectedMinute(minute);
    onChange(formatTime(hour, minute));
    setIsOpen(false);
  };

  const handleNow = () => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    handleTimeSelect(hour, minute);
  };

  const isDisabled = (hour: number, minute: number): boolean => {
    const timeString = formatTime(hour, minute);
    if (min && timeString < min) return true;
    if (max && timeString > max) return true;
    return false;
  };

  const generateHours = (): number[] => {
    return Array.from({ length: 24 }, (_, i) => i);
  };

  const generateMinutes = (): number[] => {
    return Array.from({ length: 60 }, (_, i) => i);
  };

  return (
    <div className="custom-time-picker" ref={containerRef}>
      <div className="time-input" onClick={() => setIsOpen(!isOpen)}>
        <input
          type="text"
          value={
            selectedHour !== null && selectedMinute !== null
              ? formatTime(selectedHour, selectedMinute)
              : ""
          }
          placeholder={placeholder}
          readOnly
        />
        <svg
          className="clock-icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="hsl(81deg 70% 65%)"
            strokeWidth="2"
          />
          <polyline
            points="12,6 12,12 16,14"
            stroke="hsl(81deg 70% 65%)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="time-popup">
          <div className="time-header">
            <span className="time-title">Выберите время</span>
            <button className="now-button" onClick={handleNow}>
              Сейчас
            </button>
          </div>

          <div className="time-body">
            <div className="time-column">
              <div className="column-title">Часы</div>
              <div className="time-list">
                {generateHours().map((hour) => (
                  <button
                    key={hour}
                    className={`time-option ${
                      selectedHour === hour ? "selected" : ""
                    } ${
                      isDisabled(hour, selectedMinute || 0) ? "disabled" : ""
                    }`}
                    onClick={() => {
                      if (!isDisabled(hour, selectedMinute || 0)) {
                        handleTimeSelect(hour, selectedMinute || 0);
                      }
                    }}
                    disabled={isDisabled(hour, selectedMinute || 0)}
                  >
                    {hour.toString().padStart(2, "0")}
                  </button>
                ))}
              </div>
            </div>

            <div className="time-separator">:</div>

            <div className="time-column">
              <div className="column-title">Минуты</div>
              <div className="time-list">
                {generateMinutes().map((minute) => (
                  <button
                    key={minute}
                    className={`time-option ${
                      selectedMinute === minute ? "selected" : ""
                    } ${
                      isDisabled(selectedHour || 0, minute) ? "disabled" : ""
                    }`}
                    onClick={() => {
                      if (!isDisabled(selectedHour || 0, minute)) {
                        handleTimeSelect(selectedHour || 0, minute);
                      }
                    }}
                    disabled={isDisabled(selectedHour || 0, minute)}
                  >
                    {minute.toString().padStart(2, "0")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="time-footer">
            <button
              className="clear-button"
              onClick={() => {
                setSelectedHour(null);
                setSelectedMinute(null);
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
