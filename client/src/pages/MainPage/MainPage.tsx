import { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxHooks";
import { getAllEventsThunk } from "@/entities/event/api/eventApi";
import { getAllCitiesThunk } from "@/entities/city/api/cityApi";
import { getAllSportsThunk } from "@/entities/sport/api/sportApi";
import { useNavigate } from "react-router-dom";
import { CLIENT_ROUTES } from "@/shared/enums/clientRoutes";
import EventCard from "@/widgets/EventCard/EventCard";
import { CustomDatePicker } from "@/shared/ui/CustomDatePicker/CustomDatePicker";
import "./MainPage.css";

const MainPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { events } = useAppSelector((state) => state.event);
  const { cities } = useAppSelector((state) => state.city);
  const { sports } = useAppSelector((state) => state.sport);
  const [filteredEvents, setFilteredEvents] = useState(events);
  console.log("events =======>>>>", events);

  const [cityInput, setCityInput] = useState("");
  const [sportInput, setSportInput] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showSportDropdown, setShowSportDropdown] = useState(false);
  const cityInputRef = useRef<HTMLInputElement>(null);
  const sportInputRef = useRef<HTMLInputElement>(null);

  const filteredCities = cities.filter((city) =>
    city.city.toLowerCase().includes(cityInput.toLowerCase())
  );

  const filteredSports = (sports || []).filter((sport) =>
    sport.type.toLowerCase().includes(sportInput.toLowerCase())
  );

  useEffect(() => {
    dispatch(getAllEventsThunk());
    dispatch(getAllCitiesThunk());
    dispatch(getAllSportsThunk());
  }, [dispatch]);

  useEffect(() => {
    setFilteredEvents(events);
  }, [events]);

  useEffect(() => {
    let result = [...events];

    if (cityInput) {
      const selectedCity = cities.find(
        (c) => c.city.toLowerCase() === cityInput.toLowerCase()
      );
      if (selectedCity) {
        result = result.filter((event) => event.cityId === selectedCity.id);
      }
    }

    if (sportInput) {
      const selectedSport = sports?.find(
        (s) => s.type.toLowerCase() === sportInput.toLowerCase()
      );
      if (selectedSport) {
        result = result.filter((event) => event.sportId === selectedSport.id);
      }
    }

    if (dateFilter) {
      const filterDate = new Date(dateFilter).toDateString();
      result = result.filter((event) => {
        const eventDate = new Date(event.date).toDateString();
        return eventDate === filterDate;
      });
    }

    setFilteredEvents(result);
  }, [cityInput, sportInput, dateFilter, events, cities, sports]);

  const handleCardClick = (eventId: number) => {
    navigate(`${CLIENT_ROUTES.EVENT}/${eventId}`);
  };

  const handleMapButtonClick = () => {
    navigate(CLIENT_ROUTES.ALL_EVENTS_MAP);
  };

  const resetFilters = () => {
    setCityInput("");
    setSportInput("");
    setDateFilter("");
  };

  const hasActiveFilters = cityInput || sportInput || dateFilter;

  const handleCitySelect = (cityName: string) => {
    setCityInput(cityName);
    setShowCityDropdown(false);
  };

  const handleSportSelect = (sportName: string) => {
    setSportInput(sportName);
    setShowSportDropdown(false);
  };

  const getCityName = (cityId: number) => {
    const city = cities.find((c) => c.id === cityId);
    return city ? city.city : `Город #${cityId}`;
  };

  return (
    <div className="main-page">
      <div className="filters-container">
        <h2>Фильтры событий</h2>

        <div className="filter-group">
          <div className="city-selector">
            <input
              type="text"
              id="city"
              placeholder="Начните вводить город"
              value={cityInput}
              onChange={(e) => {
                setCityInput(e.target.value);
                setShowCityDropdown(true);
              }}
              onFocus={() => setShowCityDropdown(true)}
              onBlur={() => setTimeout(() => setShowCityDropdown(false), 200)}
              ref={cityInputRef}
              required
            />
            {showCityDropdown && (
              <div className="dropdown-menu">
                {filteredCities.length > 0 ? (
                  filteredCities.map((city) => (
                    <div
                      key={city.id}
                      className="dropdown-item"
                      onClick={() => handleCitySelect(city.city)}
                    >
                      {city.city}
                    </div>
                  ))
                ) : (
                  <div className="dropdown-no-results">Город не найден</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="filter-group">
          <div className="sport-selector">
            <input
              type="text"
              id="sport"
              placeholder="Начните вводить вид спорта"
              value={sportInput}
              onChange={(e) => {
                setSportInput(e.target.value);
                setShowSportDropdown(true);
              }}
              onFocus={() => setShowSportDropdown(true)}
              onBlur={() => setTimeout(() => setShowSportDropdown(false), 200)}
              ref={sportInputRef}
            />
            {showSportDropdown && (
              <div className="dropdown-menu">
                {filteredSports.length > 0 ? (
                  filteredSports.map((sport) => (
                    <div
                      key={sport.id}
                      className="dropdown-item"
                      onClick={() => handleSportSelect(sport.type)}
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

        <div className="filter-group">
          <CustomDatePicker
            value={dateFilter}
            onChange={(date) => setDateFilter(date)}
            placeholder="Выберите дату"
          />
        </div>

        <div className="filter-actions">
          <button
            className="filter-reset-btn"
            onClick={resetFilters}
            disabled={!hasActiveFilters}
          >
            Сбросить фильтры
          </button>

          <button className="filter-map-btn" onClick={handleMapButtonClick}>
            Показать на карте
          </button>
        </div>
      </div>

      <div className="events-container">
        <h2>События ({filteredEvents.length})</h2>

        {filteredEvents.length === 0 ? (
          <div className="no-events">
            {events.length === 0
              ? "Событий пока нет"
              : "Событий не найдено. Попробуйте изменить параметры фильтрации."}
          </div>
        ) : (
          <div className="events-grid">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={{
                  ...event,
                  location: `${event.location}, ${getCityName(event.cityId)}`,
                  sportType:
                    (sports || []).find((s) => s.id === event.sportId)?.type ||
                    "",
                }}
                onClick={() => handleCardClick(event.id)}
                isClickable={true}
                onLocationClick={() => navigate(`/eventmap/${event.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;
