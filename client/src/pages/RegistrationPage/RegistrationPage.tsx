import React, { useState, useEffect } from 'react';
import { registerUserThunk } from '@/entities/user/api/userApi';
import { validateRegisterUser } from '@/entities/user/validation/validation';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/reduxHooks';
import TelegramAuthModal from '@/entities/user/ui/TelegramAuthModal';
import { useNavigate } from 'react-router';
import { CLIENT_ROUTES } from '@/shared/enums/clientRoutes';
import { refreshTokenThunk } from '@/entities/user/api/userApi';
import ToggleAuth from '@/shared/ui/ToggleAuth';
import './RegistrationPage.css';

const RegistrationPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.user);
  const [showTelegramModal, setShowTelegramModal] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    cityId: '',
  });
  const [formError, setFormError] = useState<string | null>(null);

  const [fieldErrors, setFieldErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    cityId: '',
  });

  const [cityQuery, setCityQuery] = useState('');
  const [cityOptions, setCityOptions] = useState<
    { id: number; city: string }[]
  >([]);
  const [citySelected, setCitySelected] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const isFormValid = () => {
    return (
      form.firstName.trim() !== '' &&
      form.lastName.trim() !== '' &&
      form.email.trim() !== '' &&
      form.password.trim() !== '' &&
      form.cityId !== ''
    );
  };

  const validateField = (name: string, value: string) => {
    let error = '';

    switch (name) {
      case 'firstName':
        if (!value.trim()) {
          error = 'Имя обязательно';
        }
        break;
      case 'lastName':
        if (!value.trim()) {
          error = 'Фамилия обязательна';
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = 'Email обязателен';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          error = 'Некорректный формат email';
        }
        break;
      case 'password':
        if (!value.trim()) {
          error = 'Пароль обязателен';
        } else if (value.length < 6) {
          error = 'Пароль должен быть не менее 6 символов';
        }
        break;
      case 'cityId':
        if (!value) {
          error = 'Город обязателен';
        }
        break;
    }

    return error;
  };

  useEffect(() => {
    if (cityQuery.length < 2) {
      setCityOptions([]);
      setCitySelected(false);
      return;
    }

    if (citySelected && form.cityId) {
      return;
    }

    let ignore = false;
    setCitySelected(false);
    fetch(`/api/city/cities?search=${encodeURIComponent(cityQuery)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) {
          const allCities = data.data || [];
          const filteredCities = allCities.filter(
            (city: { id: number; city: string }) =>
              city.city.toLowerCase().includes(cityQuery.toLowerCase())
          );
          setCityOptions(filteredCities);
        }
      });
    return () => {
      ignore = true;
    };
  }, [cityQuery, citySelected, form.cityId]);

  const handleCitySelect = (city: { id: number; city: string }) => {
    setForm((f) => ({ ...f, cityId: city.id.toString() }));
    setCityQuery(city.city);
    setCityOptions([]);
    setCitySelected(true);

    setFieldErrors((prev) => ({ ...prev, cityId: '' }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    const error = validateField(name, value);
    setFieldErrors((prev) => ({ ...prev, [name]: error }));

    if (formError) {
      setFormError(null);
    }

    if (error) {
      dispatch({ type: 'user/resetUserError' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newFieldErrors = {
      firstName: validateField('firstName', form.firstName),
      lastName: validateField('lastName', form.lastName),
      email: validateField('email', form.email),
      password: validateField('password', form.password),
      cityId: validateField('cityId', form.cityId),
    };

    setFieldErrors(newFieldErrors);

    const hasErrors = Object.values(newFieldErrors).some(
      (error) => error !== ''
    );
    if (hasErrors) {
      return;
    }

    const validationError = validateRegisterUser({
      ...form,
      cityId: Number(form.cityId),
    });
    if (validationError) {
      setFormError(validationError);
      return;
    }
    setFormError(null);

    dispatch({ type: 'user/resetUserError' });

    const userData = {
      ...form,
      cityId: Number(form.cityId),
      photo: '/images/default-avatar.png',
      telegram_photo: '/images/default-avatar.png',
    };

    const resultAction = await dispatch(registerUserThunk(userData));

    if (registerUserThunk.rejected.match(resultAction)) {
      const serverError =
        resultAction.payload?.data || resultAction.payload?.error;
      if (serverError) {
        console.log(
          'RegistrationPage - получена ошибка от сервера:',
          serverError
        );

        if (
          serverError.toLowerCase().includes('email') ||
          serverError.toLowerCase().includes('почта') ||
          serverError.toLowerCase().includes('пользователь') ||
          serverError.toLowerCase().includes('user') ||
          serverError.toLowerCase().includes('существует')
        ) {
          setFieldErrors((prev) => ({ ...prev, email: serverError }));
        } else {
          setFormError(serverError);
        }
      }
      return;
    }

    if (registerUserThunk.fulfilled.match(resultAction)) {
      navigate(CLIENT_ROUTES.MAIN);
    }
  };

  return (
    <div className="dark-registration-container">
      <div className="dark-registration-card">
        <h2 className="dark-registration-title">Регистрация</h2>

        <form
          onSubmit={handleSubmit}
          className="dark-registration-form"
          autoComplete="off"
        >
          <div className="dark-input-group">
            <input
              className={`dark-registration-input ${
                fieldErrors.firstName ? 'error' : ''
              }`}
              name="firstName"
              placeholder="Имя"
              value={form.firstName}
              onChange={handleChange}
            />
            {fieldErrors.firstName && (
              <div className="field-error">{fieldErrors.firstName}</div>
            )}
          </div>

          <div className="dark-input-group">
            <input
              className={`dark-registration-input ${
                fieldErrors.lastName ? 'error' : ''
              }`}
              name="lastName"
              placeholder="Фамилия"
              value={form.lastName}
              onChange={handleChange}
            />
            {fieldErrors.lastName && (
              <div className="field-error">{fieldErrors.lastName}</div>
            )}
          </div>

          <div className="dark-input-group">
            <input
              className={`dark-registration-input ${
                fieldErrors.email ? 'error' : ''
              }`}
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />
            {fieldErrors.email && (
              <div className="field-error">{fieldErrors.email}</div>
            )}
          </div>

          <div className="dark-input-group">
            <input
              className={`dark-registration-input ${
                fieldErrors.password ? 'error' : ''
              }`}
              name="password"
              type="password"
              placeholder="Пароль"
              value={form.password}
              onChange={handleChange}
            />
            {fieldErrors.password && (
              <div className="field-error">{fieldErrors.password}</div>
            )}
          </div>

          <div className="dark-input-group">
            <div className="city-selector">
              <input
                className={`dark-registration-input ${
                  fieldErrors.cityId ? 'error' : ''
                }`}
                placeholder="Начните вводить город"
                value={cityQuery}
                onChange={(e) => {
                  setCityQuery(e.target.value);
                  setForm((f) => ({ ...f, cityId: '' }));
                  setCitySelected(false);
                  setFieldErrors((prev) => ({ ...prev, cityId: '' }));
                }}
                onFocus={() => setShowCityDropdown(true)}
                onBlur={() => setTimeout(() => setShowCityDropdown(false), 200)}
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
                  {cityOptions.length > 0 ? (
                    cityOptions.map((city) => (
                      <div
                        key={city.id}
                        className={`dropdown-item ${
                          form.cityId === city.id.toString() ? 'selected' : ''
                        }`}
                        onClick={() => handleCitySelect(city)}
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
            {fieldErrors.cityId && (
              <div className="field-error">{fieldErrors.cityId}</div>
            )}
          </div>

          {formError && (
            <div className="dark-registration-error">{formError}</div>
          )}

          <button
            type="submit"
            className="dark-registration-submit-btn"
            disabled={loading || !isFormValid()}
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className="dark-divider">
          <span>или</span>
        </div>

        <button
          type="button"
          className="dark-telegram-auth-btn"
          onClick={() => setShowTelegramModal(true)}
        >
          Зарегистрироваться через Telegram
        </button>
        <ToggleAuth />
      </div>

      {showTelegramModal && (
        <TelegramAuthModal
          onSuccess={async () => {
            setShowTelegramModal(false);
            try {
              await dispatch(refreshTokenThunk());
            } catch (e) {
              console.warn('Ошибка refresh токена:', e);
            }
            navigate(CLIENT_ROUTES.MAIN);
          }}
          onClose={() => setShowTelegramModal(false)}
        />
      )}
    </div>
  );
};

export default RegistrationPage;
