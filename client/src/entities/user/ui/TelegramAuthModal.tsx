import React, { useEffect, useRef, useState } from 'react';
import { telegramRegisterInitialThunk } from '../api/userApi';
import { useAppDispatch } from '@/shared/hooks/reduxHooks';
import type { TelegramRegisterType } from '../model';
import type { CityType } from '@/entities/city/model';
import { telegramLoginThunk } from '../api/userApi';
import { IMaskInput } from 'react-imask';
import { updateUserThunk } from '../api/userApi';
import './TelegramAuthModal.css';

interface Props {
  onSuccess: () => void;
  onClose: () => void;
  mode?: 'login' | 'register';
}

const TelegramAuthModal: React.FC<Props> = ({
  onSuccess,
  onClose,
  mode = 'register',
}) => {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState<'telegram' | 'form'>('telegram');
  const [phone, setPhone] = useState('');
  const [tgData, setTgData] = useState<TelegramRegisterType | null>(null);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    username: '',
    cityId: '',
  });
  const [cityQuery, setCityQuery] = useState('');
  const [cityOptions, setCityOptions] = useState<CityType[]>([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [citySelected, setCitySelected] = useState(false);
  const [selectedCity, setSelectedCity] = useState<CityType | null>(null);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const [modeState, setModeState] = useState<'login' | 'register'>(mode);
  const [submitted, setSubmitted] = useState(false);

  // Добавляем состояние для отслеживания полей, которые нужно заполнить
  const [requiredFields, setRequiredFields] = useState({
    first_name: false,
    last_name: false,
    username: false,
  });

  const isFormValid = () => {
    // Проверяем только те поля, которые действительно нужно заполнить
    const firstNameValid =
      !requiredFields.first_name || form.first_name.trim() !== '';
    const lastNameValid =
      !requiredFields.last_name || form.last_name.trim() !== '';
    const usernameValid =
      !requiredFields.username || form.username.trim() !== '';

    return (
      firstNameValid &&
      lastNameValid &&
      usernameValid &&
      phone.length >= 18 &&
      !phone.includes('_') &&
      form.cityId.trim() !== '' &&
      selectedCity !== null
    );
  };

  useEffect(() => {
    if (step !== 'telegram') return;
    if (window.TelegramLoginWidget === undefined) {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?7';
      script.setAttribute('data-telegram-login', 'MyActiveGoBot');
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-userpic', 'true');
      script.setAttribute('data-request-access', 'write');
      script.setAttribute('data-onauth', 'onTelegramAuth(user)');
      script.async = true;
      widgetRef.current?.appendChild(script);
      window.onTelegramAuth = async (user: TelegramRegisterType) => {
        const userWithStringId = { ...user, id: String(user.id) };
        console.log('onTelegramAuth вызван', userWithStringId);
        setTgData(userWithStringId);

        // Заполняем форму данными из Telegram
        const firstName = userWithStringId.first_name || '';
        const lastName = userWithStringId.last_name || '';
        const username = userWithStringId.username || '';

        setForm({
          first_name: firstName,
          last_name: lastName,
          username: username,
          cityId: '',
        });

        // Определяем, какие поля нужно заполнить пользователю
        setRequiredFields({
          first_name: !firstName.trim(),
          last_name: !lastName.trim(),
          username: !username.trim(),
        });

        if (modeState === 'login') {
          setLoading(true);
          try {
            await dispatch(telegramLoginThunk(userWithStringId)).unwrap();
            setLoading(false);
            onSuccess();
            return;
          } catch (err: unknown) {
            setLoading(false);
            if (
              typeof err === 'object' &&
              err !== null &&
              'statusCode' in err &&
              (err as { statusCode: number }).statusCode === 404
            ) {
              setFormError(
                'Пользователь не найден. Сначала зарегистрируйтесь.'
              );
            } else if (
              typeof err === 'object' &&
              err !== null &&
              'message' in err &&
              typeof (err as { message: unknown }).message === 'string'
            ) {
              setFormError((err as { message: string }).message);
            } else if (typeof err === 'string') {
              setFormError(err);
            } else {
              setFormError('Ошибка входа. Попробуйте снова.');
            }
            return;
          }
        } else {
          setLoading(true);
          try {
            console.log('Вызов telegramRegisterInitialThunk', userWithStringId);

            const registeredUser = await dispatch(
              telegramRegisterInitialThunk(userWithStringId)
            ).unwrap();
            console.log('Ответ telegramRegisterInitialThunk', registeredUser);
            setLoading(false);
            setStep('form');

            setTgData({
              ...userWithStringId,
              id: String(registeredUser.id),
              cityId: 0,
            });
          } catch (err: unknown) {
            setLoading(false);
            console.log('Ошибка telegramRegisterInitialThunk', err);
            if (
              typeof err === 'object' &&
              err !== null &&
              'statusCode' in err &&
              (err as { statusCode: number }).statusCode === 409
            ) {
              setModeState('login');
              setFormError(
                'Пользователь уже зарегистрирован. Выполняем вход...'
              );
              setLoading(true);
              try {
                await dispatch(telegramLoginThunk(userWithStringId)).unwrap();
                setLoading(false);
                onSuccess();
                return;
              } catch {
                setLoading(false);
                setFormError(
                  'Пользователь уже зарегистрирован, но вход не удался. Попробуйте войти через Telegram.'
                );
                return;
              }
            }
            setFormError(
              typeof err === 'object' &&
                err !== null &&
                'message' in err &&
                typeof (err as { message: unknown }).message === 'string'
                ? (err as { message: string }).message.includes(
                    'Валидация не прошла'
                  )
                  ? ''
                  : (err as { message: string }).message
                : 'Ошибка регистрации. Проверьте данные и попробуйте снова.'
            );
            return;
          }
        }
      };
    }
  }, [step, modeState, dispatch, onSuccess]);

  useEffect(() => {
    if (cityQuery.length < 2) {
      setCityOptions([]);
      setCityLoading(false);
      setCitySelected(false);
      return;
    }
    if (citySelected && form.cityId) {
      return;
    }
    let ignore = false;
    setCityLoading(true);
    setCitySelected(false);
    fetch(`/api/city/cities?search=${encodeURIComponent(cityQuery)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) {
          console.log('Ответ сервера:', data);
          if (!data.data || !Array.isArray(data.data)) {
            setCityOptions([]);
            return;
          }
          setCityOptions(data.data);
        }
      })
      .catch(() => {
        if (!ignore) setCityOptions([]);
      })
      .finally(() => {
        if (!ignore) setCityLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [cityQuery, citySelected, form.cityId]);

  useEffect(() => {
    if (tgData && tgData.iphone) {
      setPhone(tgData.iphone);
    }
  }, [tgData]);

  useEffect(() => {
    return () => {
      console.log('TelegramAuthModal размонтирован');
    };
  }, []);

  useEffect(() => {
    setStep('telegram');
    setForm({
      first_name: '',
      last_name: '',
      username: '',
      cityId: '',
    });
    setCityQuery('');
    setCityOptions([]);
    setCityLoading(false);
    setCitySelected(false);
    setSelectedCity(null);
    setFormError(null);
    setLoading(false);
    setSubmitted(false);
    setPhone('');
    setTgData(null);
    setRequiredFields({
      first_name: false,
      last_name: false,
      username: false,
    });
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === 'cityId') setCityQuery(value);

    // Очищаем ошибку формы при изменении полей
    if (formError) {
      setFormError(null);
    }
  };

  const handleCitySelect = (city: CityType) => {
    console.log('Выбран город:', city);
    console.log('ID города:', city.id, 'Тип:', typeof city.id);
    setForm((f) => {
      const newForm = { ...f, cityId: city.id.toString() };
      console.log('Обновляем form.cityId:', {
        oldCityId: f.cityId,
        newCityId: newForm.cityId,
        cityId: city.id,
      });
      return newForm;
    });
    setCityQuery(city.city);
    setCityOptions([]);
    setCitySelected(true);
    setSelectedCity(city);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tgData || submitted) return;

    if (!phone || phone.length < 18) {
      setFormError('Пожалуйста, введите корректный номер телефона.');
      return;
    }

    // Проверяем только те поля, которые нужно заполнить
    if (
      requiredFields.username &&
      (!form.username || form.username.trim() === '')
    ) {
      setFormError('Пожалуйста, введите имя пользователя.');
      return;
    }

    if (
      requiredFields.first_name &&
      (!form.first_name || form.first_name.trim() === '')
    ) {
      setFormError('Пожалуйста, введите имя.');
      return;
    }

    if (
      requiredFields.last_name &&
      (!form.last_name || form.last_name.trim() === '')
    ) {
      setFormError('Пожалуйста, введите фамилию.');
      return;
    }

    if (!form.cityId) {
      setFormError('Пожалуйста, выберите город из выпадающего списка.');
      return;
    }

    const cityIdNum = Number(form.cityId);
    if (isNaN(cityIdNum) || cityIdNum <= 0) {
      setFormError('Неверный ID города. Пожалуйста, выберите город из списка.');
      return;
    }

    if (selectedCity && selectedCity.id !== cityIdNum) {
      setFormError(
        'Выбранный город не соответствует. Пожалуйста, выберите город из списка.'
      );
      return;
    }

    setFormError(null);
    setLoading(true);
    try {
      const updateData: Record<string, unknown> = {
        iphone: phone,
        firstName: form.first_name,
        lastName: form.last_name || undefined,
        userName: form.username,
      };

      if (cityIdNum > 0) {
        updateData.cityId = cityIdNum;
      }

      Object.keys(updateData).forEach(
        (key) => updateData[key] === undefined && delete updateData[key]
      );

      await dispatch(
        updateUserThunk({
          id: Number(tgData.id),
          data: updateData,
        })
      ).unwrap();

      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        const { setAccessToken } = await import('@/shared/lib/axiosInstance');

        setAccessToken(accessToken);
      }

      setLoading(false);
      setSubmitted(true);
      setFormError(null);
      onSuccess();
      console.log('onSuccess вызван после обновления профиля');
    } catch (err: unknown) {
      setLoading(false);
      setSubmitted(false);
      console.log('Ошибка при обновлении профиля:', err);

      if (
        typeof err === 'object' &&
        err !== null &&
        'message' in err &&
        typeof (err as { message: unknown }).message === 'string'
      ) {
        const errorMessage = (err as { message: string }).message;
        console.log('Получена ошибка:', errorMessage);

        if (
          errorMessage.includes('foreign key constraint') ||
          errorMessage.includes('cityId')
        ) {
          console.log('Ошибка внешнего ключа для cityId:', {
            sentCityId: cityIdNum,
            selectedCity,
          });
          setFormError(
            'Выбранный город не существует в базе данных. Пожалуйста, выберите другой город.'
          );
        } else {
          setFormError(errorMessage);
        }
      } else if (typeof err === 'string') {
        setFormError(err);
      } else {
        setFormError(
          'Ошибка регистрации. Проверьте данные и попробуйте снова.'
        );
      }
    }
  };

  return (
    <div className="telegram-auth-modal-bg">
      <div className="telegram-auth-modal">
        <button onClick={onClose} className="telegram-auth-close-btn">
          ×
        </button>

        {step === 'telegram' && (
          <div className="telegram-auth-widget-container">
            <div ref={widgetRef} className="telegram-auth-widget" />
            {loading && (
              <div className="telegram-auth-loading">
                <span>Загрузка...</span>
              </div>
            )}
            {formError && (
              <div className="telegram-auth-error">{formError}</div>
            )}
          </div>
        )}

        {step === 'form' && tgData && (
          <form onSubmit={handleSubmit} className="telegram-auth-form">
            <div className="telegram-auth-form-profile">
              <img
                src={tgData.photo_url}
                alt="avatar"
                className="telegram-auth-form-avatar"
              />
              <span className="telegram-auth-form-username">
                {tgData.first_name || 'Пользователь'}
              </span>
            </div>

            <div className="telegram-auth-form-field">
              <label>
                Имя{' '}
                {requiredFields.first_name && (
                  <span style={{ color: 'red' }}>*</span>
                )}
              </label>
              <input
                name="first_name"
                value={form.first_name}
                onChange={handleFormChange}
                className="telegram-auth-input"
                placeholder={
                  requiredFields.first_name ? 'Введите имя' : 'Имя из Telegram'
                }
                disabled={!requiredFields.first_name}
              />
            </div>

            <div className="telegram-auth-form-field">
              <label>
                Фамилия{' '}
                {requiredFields.last_name && (
                  <span style={{ color: 'red' }}>*</span>
                )}
              </label>
              <input
                name="last_name"
                value={form.last_name}
                onChange={handleFormChange}
                className="telegram-auth-input"
                placeholder={
                  requiredFields.last_name
                    ? 'Введите фамилию'
                    : 'Фамилия из Telegram'
                }
                disabled={!requiredFields.last_name}
              />
            </div>

            <div className="telegram-auth-form-field">
              <label>
                Имя пользователя{' '}
                {requiredFields.username && (
                  <span style={{ color: 'red' }}>*</span>
                )}
              </label>
              <input
                name="username"
                value={form.username}
                onChange={handleFormChange}
                className="telegram-auth-input"
                placeholder={
                  requiredFields.username
                    ? 'Введите имя пользователя'
                    : 'Username из Telegram'
                }
                disabled={!requiredFields.username}
              />
            </div>

            <div className="telegram-auth-form-field">
              <label>
                Телефон <span style={{ color: 'red' }}>*</span>
              </label>
              <IMaskInput
                mask="+7 (000) 000-00-00"
                value={phone}
                onAccept={(value: string) => setPhone(value)}
                className="telegram-auth-input"
              />
            </div>

            <div className="telegram-auth-form-field">
              <label>
                Город <span style={{ color: 'red' }}>*</span>
              </label>
              <div className="city-selector">
                <input
                  name="cityId"
                  value={cityQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setCityQuery(e.target.value);
                    setForm((f) => ({ ...f, cityId: '' }));
                    setCitySelected(false);
                    setSelectedCity(null);
                  }}
                  onFocus={() => setShowCityDropdown(true)}
                  onBlur={() =>
                    setTimeout(() => setShowCityDropdown(false), 200)
                  }
                  className="telegram-auth-input"
                  placeholder="Начните вводить город*"
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
                    {cityLoading && (
                      <div className="dropdown-item">Загрузка...</div>
                    )}
                    {!cityLoading && cityOptions.length > 0 ? (
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
            </div>
            {formError && formError !== '' && (
              <div className="telegram-auth-error">{formError}</div>
            )}
            <button
              type="submit"
              disabled={loading || submitted || !isFormValid()}
              className={`telegram-auth-submit-btn ${
                !isFormValid() && !loading && !submitted ? 'disabled' : ''
              }`}
            >
              {modeState === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default TelegramAuthModal;
