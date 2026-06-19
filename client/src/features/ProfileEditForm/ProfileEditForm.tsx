import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { IMaskInput } from 'react-imask';
import { updateUserThunk } from '@/entities/user/api/userApi';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/reduxHooks';
import { CustomDatePicker } from '@/shared/ui/CustomDatePicker/CustomDatePicker';
import './ProfileEditForm.css';

import type { UserType } from '@/entities/user/model';

interface ProfileEditFormProps {
  user: UserType;
  cities: { id: number; city: string }[];
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  onCancel: () => void;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  user,
  cities,
  editMode,
  setEditMode,
  onCancel,
}) => {
  const dispatch = useAppDispatch();
  const hasPassword = useAppSelector((state) => state.user.hasPassword);
  const userError = useAppSelector((state) => state.user.error);

  const [editForm, setEditForm] = useState(() => {
    const savedForm = localStorage.getItem('profileEditForm');
    if (savedForm) {
      try {
        const parsedForm = JSON.parse(savedForm);
        return {
          firstName: parsedForm.firstName || user?.firstName || '',
          lastName: parsedForm.lastName || user?.lastName || '',
          userName: parsedForm.userName || user?.userName || '',
          email: parsedForm.email || user?.email || '',
          iphone: parsedForm.iphone || user?.iphone || '',
          cityId:
            parsedForm.cityId || (user?.cityId ? String(user.cityId) : ''),
          content: parsedForm.content || user?.content || '',
          link: parsedForm.link || user?.link || '',
          birth: parsedForm.birth || user?.birth || '',
          photo: parsedForm.photo || user?.photo || user?.telegram_photo || '',
          telegram_photo:
            parsedForm.telegram_photo || user?.telegram_photo || '',
        };
      } catch (error) {
        console.error('Ошибка при парсинге сохраненной формы:', error);
      }
    }

    return {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      userName: user?.userName || '',
      email: user?.email || '',
      iphone: user?.iphone || '',
      cityId: user?.cityId ? String(user.cityId) : '',
      content: user?.content || '',
      link: user?.link || '',
      birth: user?.birth || '',
      photo: user?.photo || user?.telegram_photo || '',
      telegram_photo: user?.telegram_photo || '',
    };
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [userNameError, setUserNameError] = useState('');
  const [passwordFieldError, setPasswordFieldError] = useState('');
  const [cityInput, setCityInput] = useState(() => {
    const savedForm = localStorage.getItem('profileEditForm');
    if (savedForm) {
      try {
        const parsedForm = JSON.parse(savedForm);
        if (parsedForm.cityInput) {
          return parsedForm.cityInput;
        }
      } catch (error) {
        console.error('Ошибка при парсинге сохраненной формы:', error);
      }
    }

    const found = cities.find((c) => c.id === Number(user?.cityId));
    return found ? found.city : '';
  });
  const [cityOptions, setCityOptions] = useState<
    { id: number; city: string }[]
  >([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [citySelected, setCitySelected] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [selectedTelegramPhoto, setSelectedTelegramPhoto] =
    useState<File | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (user && !editMode) {
      setEditForm((prev) => ({
        ...prev,
        photo: user.photo || user.telegram_photo || '',
      }));
    }
  }, [user, editMode]);

  useEffect(() => {
    if (user && cities.length > 0) {
      const found = cities.find((c) => c.id === Number(user.cityId));
      if (found) {
        setCityInput(found.city);
      }
    }
  }, [user, cities]);

  useEffect(() => {
    if (cityInput.length < 2) {
      setCityOptions([]);
      setCityLoading(false);
      setCitySelected(false);
      return;
    }
    if (citySelected && editForm.cityId) {
      return;
    }
    let ignore = false;
    setCityLoading(true);
    setCitySelected(false);
    fetch(`/api/city/cities`)
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) {
          const allCities = data.data || [];
          const filteredCities = allCities.filter(
            (city: { id: number; city: string }) =>
              city.city.toLowerCase().includes(cityInput.toLowerCase())
          );
          setCityOptions(filteredCities);
        }
      })
      .finally(() => {
        if (!ignore) setCityLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [cityInput, citySelected, editForm.cityId]);

  useEffect(() => {
    localStorage.setItem(
      'profileEditForm',
      JSON.stringify({
        ...editForm,
        cityInput: cityInput,
      })
    );
  }, [editForm, cityInput]);

  const handleCitySelect = (city: { id: number; city: string }) => {
    setEditForm((f) => ({ ...f, cityId: city.id.toString() }));
    setCityInput(city.city);
    setCityOptions([]);
    setCitySelected(true);
  };
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const telegramPhotoInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'email' && emailError) {
      setEmailError('');
    }

    if (name === 'userName' && userNameError) {
      setUserNameError('');
    }

    if (name === 'photo') {
      setEditForm({
        ...editForm,
        photo: value || '',
      });
    } else if (name === 'link') {
      setEditForm({ ...editForm, link: value.slice(0, 255) });
    } else {
      setEditForm({ ...editForm, [name]: value });
    }
  };

  const checkForChanges = () => {
    const initialData = {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      userName: user?.userName || '',
      email: user?.email || '',
      iphone: user?.iphone || '',
      cityId: user?.cityId ? String(user.cityId) : '',
      content: user?.content || '',
      link: user?.link || '',
      birth: user?.birth || '',
    };

    const hasFormChanges = Object.keys(initialData).some(
      (key) =>
        editForm[key as keyof typeof editForm] !==
        initialData[key as keyof typeof initialData]
    );

    const hasPasswordChanges = !!(password || confirmPassword || oldPassword);
    const hasFileChanges = !!(selectedPhoto || selectedTelegramPhoto);

    const hasChanges = hasFormChanges || hasPasswordChanges || hasFileChanges;

    console.log('ProfileEditForm - проверка изменений:', {
      hasFormChanges,
      hasPasswordChanges,
      hasFileChanges,
      hasChanges,
      editForm,
      initialData,
    });

    setHasChanges(hasChanges);
  };

  useEffect(() => {
    checkForChanges();
  }, [
    editForm,
    password,
    confirmPassword,
    oldPassword,
    selectedPhoto,
    selectedTelegramPhoto,
  ]);

  // Обработка ошибок от Redux
  useEffect(() => {
    if (userError) {
      if (
        userError.includes('userName уже существует') ||
        userError.includes('Пользователь с таким userName уже существует')
      ) {
        setUserNameError('Пользователь с таким именем уже существует');
      } else if (userError.includes('email')) {
        setEmailError(userError);
      } else {
        setPasswordError(userError);
      }
    }
  }, [userError]);

  // Отслеживаем изменения editMode
  useEffect(() => {
    console.log('ProfileEditForm - editMode изменился:', editMode);
  }, [editMode]);

  const handleSave = (e?: React.FormEvent) => {
    console.log('ProfileEditForm - handleSave вызван');
    if (e) e.preventDefault();

    if (editForm.email && editForm.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editForm.email.trim())) {
        setEmailError('Некорректный формат email');
        return;
      }
    }
    setEmailError('');

    setPasswordFieldError('');

    if (password && password.trim()) {
      if (password.length < 6) {
        setPasswordError('Пароль должен быть не менее 6 символов');
        return;
      }
      if (password !== confirmPassword) {
        setPasswordError('Пароли не совпадают');
        return;
      }
      if (hasPassword && !oldPassword) {
        setPasswordError('Введите старый пароль');
        return;
      }
    }

    if (
      hasPassword &&
      showPasswordForm &&
      (password || confirmPassword || oldPassword)
    ) {
      if (password && password.trim() && password.length < 6) {
        setPasswordError('Пароль должен быть не менее 6 символов');
        return;
      }
      if (password && password.trim() && password !== confirmPassword) {
        setPasswordError('Пароли не совпадают');
        return;
      }
      if (password && password.trim() && !oldPassword) {
        setPasswordError('Введите старый пароль');
        return;
      }
    }

    const cleanPhone = editForm.iphone.trim();
    if (cleanPhone.includes('_')) {
      setPasswordError('Заполните телефон полностью');
      return;
    }
    setPasswordError('');

    const dataToSend: Record<string, string | number> = {
      ...editForm,
      iphone: cleanPhone,
      ...(password && password.trim() ? { password } : {}),
      ...(oldPassword && oldPassword.trim() ? { oldPassword } : {}),
    };

    // Правильная обработка cityId
    if (editForm.cityId && editForm.cityId.trim() !== '') {
      const cityIdNum = Number(editForm.cityId);
      if (!isNaN(cityIdNum) && cityIdNum > 0) {
        dataToSend.cityId = cityIdNum;
      }
    }

    Object.keys(dataToSend).forEach((key) => {
      if (
        dataToSend[key] === '' ||
        dataToSend[key] === null ||
        dataToSend[key] === undefined ||
        dataToSend[key] === 0
      ) {
        delete dataToSend[key];
      }
    });

    delete dataToSend.photo;
    delete dataToSend.telegram_photo;

    console.log('ProfileEditForm - отправляем данные для обновления:', {
      id: user.id,
      data: dataToSend,
      files: {
        photo: selectedPhoto?.name,
        telegram_photo: selectedTelegramPhoto?.name,
      },
    });

    dispatch(
      updateUserThunk({
        id: user.id,
        data: dataToSend,
        files: {
          photo: selectedPhoto || undefined,
          telegram_photo: selectedTelegramPhoto || undefined,
        },
      })
    )
      .unwrap()
      .then((result) => {
        console.log('ProfileEditForm - успешное обновление:', result);
        console.log('ProfileEditForm - вызываем setEditMode(false)');

        // Очищаем все состояния формы
        setPassword('');
        setConfirmPassword('');
        setOldPassword('');
        setPasswordError('');
        setPasswordFieldError('');
        setEmailError('');
        setUserNameError('');
        setShowPasswordForm(false);
        setSelectedPhoto(null);
        setSelectedTelegramPhoto(null);

        // Очищаем localStorage
        localStorage.removeItem('profileEditForm');

        // Вызываем setEditMode для закрытия формы
        setEditMode(false);

        console.log('ProfileEditForm - setEditMode(false) вызван');
      })
      .catch((error) => {
        console.error('ProfileEditForm - ошибка при обновлении:', error);
        // Ошибка уже обрабатывается в useEffect через userError
      });
  };

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      console.log('ProfileEditForm - загружен файл для фона:', {
        name: file.name,
        size: file.size,
        type: file.type,
      });
      setSelectedPhoto(file);
      setEditForm((f) => ({
        ...f,
        photo: URL.createObjectURL(file),
      }));
    }
  };
  const handleTelegramPhotoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      console.log('ProfileEditForm - загружен файл для аватара:', {
        name: file.name,
        size: file.size,
        type: file.type,
      });
      setSelectedTelegramPhoto(file);
      setEditForm((f) => ({
        ...f,
        telegram_photo: URL.createObjectURL(file),
      }));
    }
  };

  return (
    <div className="profile-edit-container">
      <div className="profile-header-wrapper">
        <div
          className="profile-header-image"
          style={{
            backgroundImage: selectedPhoto
              ? `url(${URL.createObjectURL(selectedPhoto)})`
              : user.photo
              ? user.photo.startsWith('http')
                ? `url(${user.photo})`
                : `url(${import.meta.env.VITE_API_URL}${user.photo})`
              : 'linear-gradient(135deg, hsl(240deg 15% 12%), hsl(240deg 15% 8%))',
          }}
        >
          <button
            className="change-background-btn"
            onClick={() => backgroundInputRef.current?.click()}
            aria-label="Change background"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M3 16l7-7 4 4 5-5m-3-3l2-2 3 3" />
            </svg>
            <span>Изменить фон</span>
          </button>
          <input
            type="file"
            accept="image/*"
            ref={backgroundInputRef}
            className="hidden-file-input"
            onChange={handleBackgroundChange}
          />
        </div>
      </div>

      <div className="profile-edit-content-wrapper">
        <div className="profile-edit-content">
          <form onSubmit={handleSave} className="profile-edit-form">
            <div className="avatar-upload-section">
              <div className="avatar-container">
                <img
                  src={
                    selectedTelegramPhoto
                      ? URL.createObjectURL(selectedTelegramPhoto)
                      : user.telegram_photo
                      ? user.telegram_photo.startsWith('http')
                        ? user.telegram_photo
                        : `${import.meta.env.VITE_API_URL}${
                            user.telegram_photo
                          }`
                      : user.photo
                      ? user.photo.startsWith('http')
                        ? user.photo
                        : `${import.meta.env.VITE_API_URL}${user.photo}`
                      : `${
                          import.meta.env.VITE_API_URL
                        }/images/default-avatar.png`
                  }
                  alt="avatar"
                  className="profile-avatar"
                />
                <Button
                  size="small"
                  variant="secondary"
                  onClick={() => telegramPhotoInputRef.current?.click()}
                  className="change-avatar-btn"
                >
                  Сменить аватар
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  ref={telegramPhotoInputRef}
                  className="hidden-file-input"
                  onChange={handleTelegramPhotoChange}
                />
              </div>
            </div>

            <div className="form-section">
              <Input
                name="firstName"
                value={editForm.firstName}
                onChange={handleChange}
                placeholder="Имя"
              />
            </div>

            <div className="form-section">
              <Input
                name="lastName"
                value={editForm.lastName}
                onChange={handleChange}
                placeholder="Фамилия"
              />
            </div>

            <div className="form-section">
              <Input
                name="userName"
                value={editForm.userName}
                onChange={handleChange}
                placeholder="Имя пользователя"
                className={userNameError ? 'error' : ''}
              />
              {userNameError && (
                <div className="form-error">{userNameError}</div>
              )}
            </div>

            <div className="form-section">
              <div className="city-selector">
                <input
                  name="city"
                  value={cityInput}
                  onChange={(e) => {
                    setCityInput(e.target.value);
                    setEditForm((f) => ({ ...f, cityId: '' }));
                    setCitySelected(false);
                    if (passwordError) {
                      setPasswordError('');
                    }
                  }}
                  placeholder="Город"
                  className="city-input"
                />
                {!editForm.cityId && !citySelected && cityInput.length >= 2 && (
                  <ul className="city-dropdown-menu">
                    {cityLoading && (
                      <li className="dropdown-loading">Загрузка...</li>
                    )}
                    {!cityLoading &&
                      cityOptions.length === 0 &&
                      cityInput.length >= 2 && (
                        <li className="dropdown-no-results">Нет совпадений</li>
                      )}
                    {cityOptions.map((city) => (
                      <li
                        key={city.id}
                        className="dropdown-item"
                        onMouseDown={() => handleCitySelect(city)}
                      >
                        {city.city}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="form-section">
              <Input
                name="email"
                value={editForm.email}
                onChange={handleChange}
                placeholder="Email"
                className={emailError ? 'error' : ''}
              />
              {emailError && <div className="form-error">{emailError}</div>}
            </div>

            <div className="form-section">
              <CustomDatePicker
                value={editForm.birth}
                onChange={(date) => {
                  setEditForm((f) => ({ ...f, birth: date }));
                  if (passwordError) {
                    setPasswordError('');
                  }
                }}
                placeholder="Выберите дату рождения"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-section">
              <IMaskInput
                mask={'+7 (000) 000-00-00'}
                value={editForm.iphone}
                onAccept={(value: string) => {
                  setEditForm((f) => ({ ...f, iphone: value }));
                  if (passwordError) {
                    setPasswordError('');
                  }
                }}
                name="iphone"
                placeholder="Телефон"
                className={`phone-input ${passwordError ? 'error' : ''}`}
              />
            </div>

            <div className="form-section">
              <Input
                name="link"
                value={editForm.link}
                onChange={handleChange}
                placeholder="Ссылка"
              />
              {editForm.link.length > 200 && (
                <div
                  className={`character-count ${
                    editForm.link.length > 255 ? 'error' : ''
                  }`}
                >
                  {editForm.link.length}/255 символов
                  {editForm.link.length > 255 && ' (превышен лимит!)'}
                </div>
              )}
            </div>

            <div className="form-section">
              <textarea
                name="content"
                value={editForm.content}
                onChange={handleChange}
                placeholder="О себе..."
                maxLength={255}
                className="bio-textarea"
              />
              {editForm.content.length > 200 && (
                <div
                  className={`character-count ${
                    editForm.content.length > 255 ? 'error' : ''
                  }`}
                >
                  {editForm.content.length}/255 символов
                  {editForm.content.length > 255 && ' (превышен лимит!)'}
                </div>
              )}
            </div>

            <div className="form-section password-section">
              <div className="section-label">
                {hasPassword ? 'Сменить пароль' : 'Создать пароль'}
              </div>

              {!hasPassword ? (
                <>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (e.target.value.trim()) {
                        setPasswordFieldError('');
                      }
                      if (passwordError) {
                        setPasswordError('');
                      }
                    }}
                    placeholder="Создайте пароль"
                    autoComplete="new-password"
                    className={`password-input ${
                      passwordFieldError || passwordError ? 'error' : ''
                    }`}
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (passwordError) {
                        setPasswordError('');
                      }
                    }}
                    placeholder="Повторите пароль"
                    autoComplete="new-password"
                    className={`password-input ${
                      passwordFieldError || passwordError ? 'error' : ''
                    }`}
                  />
                  {passwordFieldError && (
                    <div className="form-error">{passwordFieldError}</div>
                  )}
                  {passwordError && (
                    <div
                      className={`password-message ${
                        passwordError === 'Пароль успешно сохранён'
                          ? 'success'
                          : 'error'
                      }`}
                    >
                      {passwordError}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {!showPasswordForm ? (
                    <Button
                      type="button"
                      onClick={() => setShowPasswordForm(true)}
                      size="small"
                      variant="secondary"
                    >
                      Сменить пароль
                    </Button>
                  ) : (
                    <>
                      <input
                        type="password"
                        name="oldPassword"
                        value={oldPassword}
                        onChange={(e) => {
                          setOldPassword(e.target.value);
                          if (passwordError) {
                            setPasswordError('');
                          }
                        }}
                        placeholder="Старый пароль"
                        autoComplete="current-password"
                        className={`password-input ${
                          passwordError ? 'error' : ''
                        }`}
                      />
                      <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (passwordError) {
                            setPasswordError('');
                          }
                        }}
                        placeholder="Новый пароль"
                        autoComplete="new-password"
                        className={`password-input ${
                          passwordError ? 'error' : ''
                        }`}
                      />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (passwordError) {
                            setPasswordError('');
                          }
                        }}
                        placeholder="Повторите новый пароль"
                        autoComplete="new-password"
                        className={`password-input ${
                          passwordError ? 'error' : ''
                        }`}
                      />
                      {passwordError && (
                        <div
                          className={`password-message ${
                            passwordError === 'Пароль успешно сохранён'
                              ? 'success'
                              : 'error'
                          }`}
                        >
                          {passwordError}
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>

            <div className="form-actions">
              <Button
                type="submit"
                disabled={!hasChanges}
                className={
                  !hasChanges ? 'save-button-disabled' : 'save-button-active'
                }
                onClick={() =>
                  console.log(
                    'ProfileEditForm - кнопка Сохранить нажата, hasChanges:',
                    hasChanges
                  )
                }
              >
                Сохранить
              </Button>
              <Button type="button" onClick={onCancel} variant="secondary">
                Отмена
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditForm;
