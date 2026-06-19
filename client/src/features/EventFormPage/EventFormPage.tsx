import React, { useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxHooks";
import { createEventThunk } from "@/entities/event/api/eventApi";
import { getAllSportsThunk } from "@/entities/sport/api/sportApi";
import {
  getAllCitiesThunk,
  createCityThunk,
} from "@/entities/city/api/cityApi";
import "./EventFormPage.css";
import { useNavigate } from "react-router";
import { CLIENT_ROUTES } from "@/shared/enums/clientRoutes";
import { YandexMap } from "@/widgets/mapWidgetes/map/map";
import { CustomDatePicker } from "@/shared/ui/CustomDatePicker/CustomDatePicker";
import { CustomTimePicker } from "@/shared/ui/CustomTimePicker/CustomTimePicker";
import { ConfirmationModal } from "@/shared/ui/ConfirmationModal";

type EventFormValues = {
  photos: File[];
  sportId: number | "";
  cityId: number | "";
  title: string;
  location: string;
  content: string;
  member: number;
  level: string[];
  date: string;
  time: string;
  userId: number;
  coords: [number, number];
};

const LEVELS = ["beginner", "middle", "professional"];
const MAX_PHOTOS = 10;

const EventFormPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const sports = useAppSelector((state) => state.sport.sports) || [];
  const cities = useAppSelector((state) => state.city.cities) || [];
  const userId = useAppSelector((state) => state.user.user?.id);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const [form, setForm] = useState<EventFormValues>({
    photos: [],
    sportId: "",
    cityId: "",
    title: "",
    location: "",
    content: "",
    member: 0,
    level: [],
    date: "",
    time: "",
    userId: userId ?? 0,
    coords: [0, 0],
  });

  useEffect(() => {
    if (userId) {
      setForm((prev) => ({ ...prev, userId }));
    }
  }, [userId]);

  const [cityInput, setCityInput] = useState("");
  const [sportInput, setSportInput] = useState("");
  const [addingCity, setAddingCity] = useState(false);
  const [levelModal, setLevelModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showSportDropdown, setShowSportDropdown] = useState(false);
  const cityInputRef = useRef<HTMLInputElement>(null);
  const sportInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!sports.length) dispatch(getAllSportsThunk());
    if (!cities.length) dispatch(getAllCitiesThunk());
  }, [dispatch, sports.length, cities.length]);

  useEffect(() => {
    if (cityInput.trim()) {
      const foundCity = cities.find(
        (city) => city.city.toLowerCase() === cityInput.trim().toLowerCase()
      );
      if (foundCity) {
        setForm((f) => ({ ...f, cityId: foundCity.id }));
      } else {
        setForm((f) => ({ ...f, cityId: "" }));
      }
    }
  }, [cityInput, cities]);

  useEffect(() => {
    if (sportInput.trim()) {
      const foundSport = sports.find(
        (sport) => sport.type.toLowerCase() === sportInput.trim().toLowerCase()
      );
      if (foundSport) {
        setForm((f) => ({ ...f, sportId: foundSport.id }));
      } else {
        setForm((f) => ({ ...f, sportId: "" }));
      }
    }
  }, [sportInput, sports]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png"] },
    maxFiles: MAX_PHOTOS,
    onDrop: (acceptedFiles) => {
      setForm((prev) => ({
        ...prev,
        photos: [...prev.photos, ...acceptedFiles].slice(0, MAX_PHOTOS),
      }));
    },
  });

  const removePhoto = (index: number) => {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleLevelSelect = (lvl: string) => {
    setForm((prev) => ({
      ...prev,
      level: prev.level.includes(lvl)
        ? prev.level.filter((l) => l !== lvl)
        : [...prev.level, lvl],
    }));
  };

  const filteredCities = cities.filter((city) =>
    city.city.toLowerCase().includes(cityInput.toLowerCase())
  );

  const filteredSports = sports.filter((sport) =>
    sport.type.toLowerCase().includes(sportInput.toLowerCase())
  );

  const handleCitySelect = (cityId: number, cityName: string) => {
    setForm((f) => ({ ...f, cityId }));
    setCityInput(cityName);
    setShowCityDropdown(false);
  };

  const handleSportSelect = (sportId: number, sportName: string) => {
    setForm((f) => ({ ...f, sportId }));
    setSportInput(sportName);
    setShowSportDropdown(false);
  };

  const handleAddCity = async () => {
    if (!cityInput.trim()) return;

    setAddingCity(true);
    setError(null);
    try {
      const resultAction = await dispatch(
        createCityThunk({ city: cityInput.trim() })
      );

      if (createCityThunk.fulfilled.match(resultAction)) {
        setForm((prev) => ({ ...prev, cityId: resultAction.payload.id }));
        setCityInput("");
        setSuccess("Город успешно добавлен");
        setShowCityDropdown(false);
      } else {
        setError("Ошибка при добавлении города");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("=== НАЧАЛО ОТПРАВКИ ФОРМЫ ===");
    console.log("Форма данных:", form);

    setLoading(true);
    setError(null);
    setSuccess(null);

    if (
      !form.sportId ||
      !form.cityId ||
      !form.date ||
      !form.time ||
      !form.location ||
      (form.coords[0] === 0 && form.coords[1] === 0)
    ) {
      setError(
        "Заполните все обязательные поля и укажите местоположение на карте"
      );
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      form.photos.forEach((file) => {
        formData.append("photos", file);
      });

      formData.append("sportId", form.sportId.toString());
      formData.append("cityId", form.cityId.toString());
      formData.append("title", form.title);
      formData.append("location", form.location);
      formData.append("content", form.content);
      formData.append("member", form.member.toString());
      formData.append("level", JSON.stringify(form.level));
      formData.append("date", `${form.date}T${form.time}`);
      formData.append("userId", form.userId.toString());
      formData.append("coords", JSON.stringify(form.coords));

      console.log("Отправляемые данные:", {
        sportId: form.sportId,
        cityId: form.cityId,
        title: form.title,
        location: form.location,
        content: form.content,
        member: form.member,
        level: form.level,
        date: `${form.date}T${form.time}`,
        userId: form.userId,
        coords: form.coords,
      });

      const resultAction = await dispatch(createEventThunk(formData));

      if (createEventThunk.fulfilled.match(resultAction)) {
        setSuccess("Событие успешно создано!");
        setForm({
          photos: [],
          sportId: "",
          cityId: "",
          title: "",
          location: "",
          content: "",
          member: 0,
          level: [],
          date: "",
          time: "",
          userId: userId ?? 0,
          coords: [0, 0],
        });
        setCityInput("");
        setSportInput("");
        navigate(CLIENT_ROUTES.EVENT);
      } else {
        setError(resultAction.payload?.message || "Ошибка создания события");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
    } finally {
      setLoading(false);
    }
  };

  const handleMapCoordsSelect = async (coords: [number, number]) => {
    setForm((prev) => ({ ...prev, coords: coords }));

    try {
      if (window.ymaps && window.ymaps.geocode) {
        const res = await window.ymaps.geocode(coords, { results: 1 });
        if (res.geoObjects.getLength() > 0) {
          const firstGeoObject = res.geoObjects.get(0);
          if (firstGeoObject) {
            try {
              // @ts-expect-error: getAddressLine есть в API Яндекс.Карт
              const address = firstGeoObject.getAddressLine();
              if (address) {
                setForm((prev) => ({ ...prev, location: address }));
              }
            } catch (addressError) {
              console.warn("Не удалось получить адрес:", addressError);
            }
          }
        }
      }
    } catch (error) {
      console.warn("Ошибка получения адреса:", error);
    }

    setIsMapOpen(false);
  };

  return (
    <div className="event-form-container">
      <h2>Создать новое событие</h2>

      {success && <div className="alert success">{success}</div>}
      {error && <div className="alert error">{error}</div>}

      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-section">
          <div
            {...getRootProps()}
            className={`dropzone ${isDragActive ? "active" : ""}`}
          >
            <input {...getInputProps()} />
            {form.photos.length > 0 ? (
              <div className="preview-grid">
                {form.photos.map((file, idx) => (
                  <div key={idx} className="preview-item">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${idx}`}
                      className="preview-image"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removePhoto(idx);
                      }}
                      className="remove-photo-btn"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : isDragActive ? (
              <p>Отпустите файлы здесь...</p>
            ) : (
              <p>Кликните для выбора фото</p>
            )}
          </div>
        </div>

        <div className="form-section">
          <div className="sport-selector">
            <input
              type="text"
              placeholder="Начните вводить вид спорта*"
              value={
                form.sportId
                  ? sports.find((s) => s.id === form.sportId)?.type ||
                    sportInput
                  : sportInput
              }
              onChange={(e) => {
                setSportInput(e.target.value);
                setShowSportDropdown(true);
              }}
              onFocus={() => setShowSportDropdown(true)}
              onBlur={() => setTimeout(() => setShowSportDropdown(false), 200)}
              ref={sportInputRef}
              required
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
            {showSportDropdown && (
              <div className="dropdown-menu">
                {filteredSports.length > 0 ? (
                  filteredSports.map((sport) => (
                    <div
                      key={sport.id}
                      className={`dropdown-item ${
                        form.sportId === sport.id ? "selected" : ""
                      }`}
                      onClick={() => handleSportSelect(sport.id, sport.type)}
                    >
                      {sport.type}
                    </div>
                  ))
                ) : (
                  <div className="dropdown-no-results">
                    Вид спорта не найден
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <div className="city-selector">
            <input
              type="text"
              placeholder="Начните вводить город*"
              value={
                form.cityId
                  ? cities.find((c) => c.id === form.cityId)?.city || cityInput
                  : cityInput
              }
              onChange={(e) => {
                setCityInput(e.target.value);
                setShowCityDropdown(true);
              }}
              onFocus={() => setShowCityDropdown(true)}
              onBlur={() => setTimeout(() => setShowCityDropdown(false), 200)}
              ref={cityInputRef}
              required
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
            {showCityDropdown && (
              <div className="dropdown-menu">
                {filteredCities.length > 0 ? (
                  <>
                    {filteredCities.map((city) => (
                      <div
                        key={city.id}
                        className={`dropdown-item ${
                          form.cityId === city.id ? "selected" : ""
                        }`}
                        onClick={() => handleCitySelect(city.id, city.city)}
                      >
                        {city.city}
                      </div>
                    ))}
                    {!cities.some(
                      (c) =>
                        c.city.toLowerCase() === cityInput.trim().toLowerCase()
                    ) && (
                      <div
                        className="dropdown-add-item"
                        onClick={handleAddCity}
                      >
                        {addingCity ? (
                          "Добавление..."
                        ) : (
                          <>
                            Добавить город: <strong>{cityInput}</strong>
                          </>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="dropdown-no-results">
                    Город не найден. Нажмите, чтобы добавить:{" "}
                    <strong>{cityInput}</strong>
                    <button
                      type="button"
                      onClick={handleAddCity}
                      disabled={addingCity}
                      className="add-city-btn"
                    >
                      {addingCity ? "Добавление..." : "Добавить"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <input
            type="text"
            placeholder="Название события*"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
          />
        </div>

        <div className="form-section">
          <input
            type="text"
            placeholder="Место проведения укажите на карте"
            value={form.location}
            onChange={(e) =>
              setForm((f) => ({ ...f, location: e.target.value }))
            }
            readOnly
            required
          />
        </div>

        <div className="form-section">
          <div className="coords-section">
            <button
              type="button"
              className="map-btn"
              onClick={() => setIsMapOpen(true)}
            >
              Указать на карте
            </button>
          </div>
        </div>

        <div className="form-section">
          <textarea
            placeholder="Описание события..."
            value={form.content}
            onChange={(e) =>
              setForm((f) => ({ ...f, content: e.target.value }))
            }
            rows={4}
          />
        </div>

        <div className="form-row">
          <div className="form-section">
            <CustomDatePicker
              value={form.date}
              onChange={(date) => setForm((f) => ({ ...f, date }))}
              placeholder="Выберите дату*"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="form-section">
            <CustomTimePicker
              value={form.time}
              onChange={(time) => setForm((f) => ({ ...f, time }))}
              placeholder="Выберите время*"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-section">
            <input
              type="number"
              placeholder="Введите количество участников*"
              value={form.member || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, member: Number(e.target.value) || 0 }))
              }
              min={1}
            />
          </div>

          <div className="form-section">
            <button
              type="button"
              className="level-selector"
              onClick={() => setLevelModal(true)}
            >
              {form.level.length > 0
                ? form.level.join(", ")
                : "Выберите уровень подготовки"}
            </button>
          </div>
        </div>

        <button type="submit" className="submit-btny" disabled={loading}>
          {loading ? "Создание..." : "Создать событие"}
        </button>

        <button
          type="button"
          className="cancel-btn"
          disabled={loading}
          onClick={() => setIsConfirmationModalOpen(true)}
        >
          Отменить
        </button>
      </form>

      {levelModal && (
        <div className="modal-overlayy" onClick={() => setLevelModal(false)}>
          <div className="modal-contenty" onClick={(e) => e.stopPropagation()}>
            <h3>Выберите уровень подготовки</h3>
            <div className="level-optionsy">
              {LEVELS.map((lvl) => (
                <div
                  key={lvl}
                  className={`level-optiony ${
                    form.level.includes(lvl) ? "selected" : ""
                  }`}
                  onClick={() => handleLevelSelect(lvl)}
                >
                  {lvl}
                </div>
              ))}
            </div>
            <button
              className="confirm-btny"
              onClick={() => setLevelModal(false)}
            >
              Готово
            </button>
          </div>
        </div>
      )}

      {isMapOpen && (
        <div className="modal-overlay" onClick={() => setIsMapOpen(false)}>
          <div
            className="modal-content map-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Выберите местоположение на карте</h3>
              <button
                type="button"
                className="close-btn"
                onClick={() => setIsMapOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="map-container">
              <YandexMap onCoordsSelect={handleMapCoordsSelect} />
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onConfirm={() => {
          setIsConfirmationModalOpen(false);
          navigate(-1);
        }}
        onCancel={() => setIsConfirmationModalOpen(false)}
        title="Отмена создания события"
        message="Вы уверены, что хотите отменить создание события? Все введенные данные будут потеряны."
        confirmText="Отменить"
        cancelText="Продолжить"
        variant="danger"
      />
    </div>
  );
};

export default EventFormPage;
