import { useAppDispatch } from "@/shared/hooks/reduxHooks";
import { updateEventThunk } from "@/entities/event/api/eventApi";
import { Button } from "@/shared/ui/Button";
import { toast } from "react-toastify";
import type { EventLevelType, EventType } from "@/entities/event/model";
import { useState } from "react";
import { YandexMap } from "@/widgets/mapWidgetes/updateMark/updateMark";
import { CustomDatePicker } from "@/shared/ui/CustomDatePicker/CustomDatePicker";
import { CustomTimePicker } from "@/shared/ui/CustomTimePicker/CustomTimePicker";
import "./EditEventModal.css";

type EditEventModalProps = {
  event: EventType;
  onClose: () => void;
  onSuccess: () => void;
};

type EditEventFormData = {
  title: string;
  location: string;
  content: string;
  level: EventLevelType[];
  date: string;
  time: string;
  coords: number[];
};

const levelOptions: EventLevelType[] = ["beginner", "middle", "professional"];

export const EditEventModal = ({
  event,
  onClose,
  onSuccess,
}: EditEventModalProps) => {
  const dispatch = useAppDispatch();
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Разделяем дату и время из event.date
  const eventDate = new Date(event.date);
  const eventDateString = eventDate.toISOString().split("T")[0];
  const eventTimeString = eventDate.toTimeString().slice(0, 5);

  const [formData, setFormData] = useState<EditEventFormData>({
    title: event.title,
    location: event.location,
    content: event.content,
    level: [...event.level],
    date: eventDateString,
    time: eventTimeString,
    coords: event.coords,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLevelChange = (level: EventLevelType) => {
    setFormData((prev) => {
      const newLevels = prev.level.includes(level)
        ? prev.level.filter((l) => l !== level)
        : [...prev.level, level];
      return { ...prev, level: newLevels };
    });
  };

  const handleMapCoordsSelect = async (coords: [number, number]) => {
    try {
      const res = await window.ymaps.geocode(coords, { results: 1 });
      if (res.geoObjects.getLength() > 0) {
        const firstGeoObject = res.geoObjects.get(0);
        try {
          const address = (
            firstGeoObject as unknown as { getAddressLine: () => string }
          ).getAddressLine();
          setFormData((prev) => ({
            ...prev,
            coords: coords,
            location: address,
          }));
        } catch (error) {
          console.error("Ошибка получения адреса:", error);
          setFormData((prev) => ({
            ...prev,
            coords: coords,
          }));
        }
      } else {
        setFormData((prev) => ({
          ...prev,
          coords: coords,
        }));
      }
    } catch (error) {
      console.error("Ошибка получения адреса:", error);
      setFormData((prev) => ({
        ...prev,
        coords: coords,
      }));
    }
    setIsMapOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const form = new FormData();

      // Объединяем дату и время
      const combinedDateTime =
        formData.date && formData.time
          ? `${formData.date}${formData.time}`
          : event.date;

      // Добавляем поля формы
      form.append("title", formData.title);
      form.append("location", formData.location);
      form.append("content", formData.content);
      form.append("level", JSON.stringify(formData.level));
      form.append("date", combinedDateTime);
      form.append("coords", JSON.stringify(formData.coords));
      form.append("existingPhotos", JSON.stringify(event.photos));
      await dispatch(updateEventThunk({ id: event.id, data: form })).unwrap();
      toast.success("Событие успешно обновлено");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Ошибка при обновлении события");
      console.error("Update event error:", error);
    }
  };

  return (
    <>
      <div className="modal-overlays">
        <div className="modal-contents">
          <h2>Редактирование события</h2>
          <form onSubmit={handleSubmit} className="modal-forms">
            <div className="modal-scrollables">
              <div className="form-groups">
                <input
                  type="text"
                  name="title"
                  placeholder="Название"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-groups">
                <textarea
                  name="content"
                  placeholder="Описание"
                  value={formData.content}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-groups">
                <input
                  type="text"
                  name="location"
                  placeholder="Место проведения"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  readOnly
                />
              </div>

              <div
                className="form-groups"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <button
                  type="button"
                  onClick={() => setIsMapOpen(true)}
                  style={{
                    background: "hsl(81deg 70% 55%)",
                    color: "#23262a",
                    border: "none",
                    borderRadius: "10px",
                    padding: "12px 24px",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    minWidth: "200px",
                  }}
                >
                  Изменить местоположение
                </button>
              </div>

              <div className="form-groups">
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div style={{ flex: 3 }}>
                    <CustomDatePicker
                      value={formData.date || ""}
                      onChange={(date) =>
                        setFormData((prev) => ({ ...prev, date }))
                      }
                      placeholder="Выберите дату*"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div style={{ flex: 2 }}>
                    <CustomTimePicker
                      value={formData.time || ""}
                      onChange={(time) =>
                        setFormData((prev) => ({ ...prev, time }))
                      }
                      placeholder="Выберите время*"
                    />
                  </div>
                </div>
              </div>

              <div className="form-groups">
                <div className="levels-buttons">
                  {levelOptions.map((level) => (
                    <button
                      key={level}
                      type="button"
                      className={`levels-button ${
                        formData.level.includes(level) ? "active" : ""
                      }`}
                      onClick={() => handleLevelChange(level)}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

            </div>
            <div className="modals-actions">
              <Button variant="secondary" onClick={onClose} type="button">
                Отмена
              </Button>
              <Button variant="primary" type="submit">
                Сохранить
              </Button>
            </div>
          </form>
        </div>
      </div>

      {isMapOpen && (
        <div className="modal-overlay">
          <div className="modal-content map-modal">
            <div className="modal-header">
              <h3>Выберите новое местоположение</h3>
              <button
                className="close-btn"
                onClick={() => setIsMapOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                ×
              </button>
            </div>
            <div className="map-container">
              <YandexMap
                onCoordsSelect={handleMapCoordsSelect}
                initialCoords={
                  formData.coords && formData.coords.length === 2
                    ? (formData.coords as [number, number])
                    : undefined
                }
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};