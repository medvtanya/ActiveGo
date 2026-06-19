import React, { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxHooks";
import { getAllSportsThunk } from "@/entities/sport/api/sportApi";
import {
  getAllCitiesThunk,
  createCityThunk,
} from "@/entities/city/api/cityApi";
import "./SportClubForm.css";
import { useNavigate } from "react-router";
import { CLIENT_ROUTES } from "@/shared/enums/clientRoutes";
import {
  createSportClubThunk,
  getAllSportClubsThunk,
} from "@/entities/sportClub/api/sportClubApi";
import { ConfirmationModal } from "@/shared/ui/ConfirmationModal";

type EventFormValues = {
  photo: File | null;
  sportId: number | "";
  cityId: number | "";
  title: string;
  content: string;
  openCommunity: boolean;
  userId: number;
};

const SportClubForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const sports = useAppSelector((state) => state.sport.sports) || [];
  const cities = useAppSelector((state) => state.city.cities) || [];
  const userId = useAppSelector((state) => state.user.user?.id);

  const [form, setForm] = useState<EventFormValues>({
    photo: null,
    sportId: "",
    cityId: "",
    title: "",
    content: "",
    openCommunity: true,
    userId: userId || 1,
  });

  const [cityInput, setCityInput] = useState("");
  const [sportInput, setSportInput] = useState("");
  const [addingCity, setAddingCity] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showSportDropdown, setShowSportDropdown] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const cityInputRef = useRef<HTMLInputElement>(null);
  const sportInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    setShowCancelModal(false);
    navigate(-1);
  };

  const handleCancelModalClose = () => {
    setShowCancelModal(false);
  };

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

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm((prev) => ({ ...prev, photo: e.target.files![0] }));
    } else {
      setForm((prev) => ({ ...prev, photo: null }));
    }
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
    } finally {
      setAddingCity(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (
      !form.sportId ||
      !form.cityId ||
      !form.title ||
      !form.content ||
      !form.photo
    ) {
      setError("Заполните все обязательные поля и добавьте фото");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("photo", form.photo);
      formData.append("title", form.title);
      formData.append("content", form.content);
      formData.append("sportId", String(form.sportId));
      formData.append("cityId", String(form.cityId));
      formData.append("openCommunity", String(form.openCommunity));
      formData.append("ownerId", String(form.userId));

      for (const [key, value] of formData.entries()) {
        console.log("SEND:", key, value);
      }

      const resultAction = await dispatch(createSportClubThunk(formData));

      if (createSportClubThunk.fulfilled.match(resultAction)) {
        setSuccess("Клуб успешно создан!");
        setForm({
          photo: null,
          sportId: "",
          cityId: "",
          title: "",
          content: "",
          openCommunity: true,
          userId: form.userId,
        });
        setCityInput("");
        setSportInput("");

        await dispatch(getAllSportClubsThunk());

        navigate(CLIENT_ROUTES.SPORT_CLUB);
      } else {
        setError(resultAction.payload?.message || "Ошибка создания клуба");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="event-form-container">
      <h2>Создать новый клуб</h2>

      {success && <div className="alert success">{success}</div>}
      {error && <div className="alert error">{error}</div>}

      <form
        onSubmit={handleSubmit}
        className="event-form"
        encType="multipart/form-data"
      >
        <div className="form-section">
          <label className="photo-upload">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              required
              style={{ display: "none" }}
            />
            {form.photo ? (
              <div className="preview-item">
                <img
                  src={URL.createObjectURL(form.photo)}
                  alt="Preview"
                  className="preview-image"
                />
              </div>
            ) : (
              <span>Кликните для выбора фото</span>
            )}
          </label>
        </div>

        <div className="form-section">
          <div className="sport-selector">
            <input
              className="sport-input"
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
              className="sport-input"
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
          <label>Тип клуба *</label>
          <div className="club-type-buttons">
            <button
              type="button"
              className={`type-button ${form.openCommunity ? "active" : ""}`}
              onClick={() =>
                setForm((prev) => ({ ...prev, openCommunity: true }))
              }
            >
              Открытый
            </button>
            <button
              type="button"
              className={`type-button ${!form.openCommunity ? "active" : ""}`}
              onClick={() =>
                setForm((prev) => ({ ...prev, openCommunity: false }))
              }
            >
              Закрытый
            </button>
          </div>
        </div>

        <div className="form-section">
          <input
            type="text"
            placeholder="Название клуба*"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
          />
        </div>

        <div className="form-section">
          <textarea
            value={form.content}
            onChange={(e) =>
              setForm((f) => ({ ...f, content: e.target.value }))
            }
            placeholder="Опишите ваш клуб, его цели и особенности..."
            required
            rows={4}
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Создание..." : "Создать клуб"}
        </button>

        <button
          type="button"
          className="cancel-btn"
          disabled={loading}
          onClick={handleCancel}
        >
          Отменить
        </button>
      </form>

      <ConfirmationModal
        isOpen={showCancelModal}
        onCancel={handleCancelModalClose}
        onConfirm={handleConfirmCancel}
        title="Отмена создания клуба"
        message="Вы уверены, что хотите отменить создание клуба? Все введенные данные будут потеряны."
        confirmText="Отменить"
        cancelText="Продолжить"
        variant="danger"
      />
    </div>
  );
};

export default SportClubForm;
