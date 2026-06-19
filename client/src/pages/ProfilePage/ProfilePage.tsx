import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/shared/hooks/reduxHooks';
import { Button } from '@/shared/ui/Button';

import { useEffect } from 'react';
import './ProfilePage.css';
import { getAllCitiesThunk } from '@/entities/city/api/cityApi';
import AccountManagement from '@/widgets/AccountManagement';
import ProfileCards from '@/widgets/ProfileCards';
import ProfileEditForm from '@/features/ProfileEditForm';

class ProfileErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: unknown }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, error };
  }
  componentDidCatch() {}
  render() {
    if (this.state.hasError) {
      return (
        <div className="dark-error-message">
          Ошибка: {String(this.state.error)}
        </div>
      );
    }
    return this.props.children;
  }
}

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const cities = useAppSelector((state) => state.city.cities);

  const [editMode, setEditMode] = useState(false);

  const [cityInput, setCityInput] = useState(() => {
    const found = cities.find((c) => c.id === Number(user?.cityId));
    return found ? found.city : '';
  });

  // Создаем обертку для setEditMode с отладочной информацией
  const setEditModeWithLog = (value: boolean) => {
    console.log('ProfilePage - setEditMode вызван с значением:', value);
    setEditMode(value);
  };

  useEffect(() => {
    console.log('ProfilePage - изменение editMode:', editMode);
  }, [editMode]);

  useEffect(() => {
    if (user && cities.length > 0) {
      const found = cities.find((c) => c.id === Number(user.cityId));
      if (found) {
        setCityInput(found.city);
      }
    }
  }, [user, cities]);

  useEffect(() => {
    dispatch(getAllCitiesThunk());
  }, [dispatch]);

  if (!user) {
    return (
      <div className="dark-loading">
        <span>Загрузка профиля...</span>
      </div>
    );
  }

  console.log('ProfilePage - данные пользователя:', {
    userPhoto: user.photo,
    userTelegramPhoto: user.telegram_photo,
    hasPhoto: !!user.photo,
    photoStartsWithHttp: user.photo?.startsWith('http'),
    apiUrl: import.meta.env.VITE_API_URL,
  });

  const handleEditMode = () => {
    console.log('ProfilePage - включаем режим редактирования');
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    console.log('ProfilePage - отменяем редактирование');
    setEditMode(false);
  };

  return (
    <ProfileErrorBoundary>
      <div className="dark-profile-container">
        <div className="dark-profile-page">
          {!editMode && (
            <div
              className="dark-profile-main"
              style={{
                backgroundImage: user.photo
                  ? user.photo.startsWith('http')
                    ? `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${user.photo})`
                    : `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${
                        import.meta.env.VITE_API_URL
                      }${user.photo})`
                  : 'none',
                backgroundSize: user.photo ? 'cover' : 'auto',
                backgroundPosition: user.photo ? 'center' : 'auto',
                backgroundRepeat: user.photo ? 'no-repeat' : 'auto',
                backgroundColor: user.photo ? 'transparent' : 'var(--dark)',
              }}
            >
              <div className="dark-profile-header">
                <div className="dark-profile-avatar-container">
                  <img
                    src={
                      user.telegram_photo
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
                    className="dark-profile-avatar"
                  />
                </div>

                <div className="dark-profile-info">
                  <div className="dark-profile-info-box">
                    <span className="dark-profile-info-label">
                      <img
                        src="/userFIO.svg"
                        alt="Имя"
                        style={{
                          width: '20px',
                          height: '20px',
                          marginRight: '2px',
                          filter: 'brightness(0) invert(1)',
                        }}
                      />
                    </span>
                    <span className="dark-profile-info-value">{`${user.firstName} ${user.lastName}`}</span>
                  </div>
                  <div className="dark-profile-info-box">
                    <span className="dark-profile-info-label">
                      <img
                        src="/avatar.svg"
                        alt="Логин"
                        style={{
                          width: '20px',
                          height: '20px',
                          marginRight: '2px',
                          filter: 'brightness(0) invert(1)',
                        }}
                      />
                    </span>
                    <span className="dark-profile-info-value">
                      {user.userName}
                    </span>
                  </div>
                  <div className="dark-profile-info-box">
                    <span className="dark-profile-info-label">
                      <img
                        src="/city.svg"
                        alt="Город"
                        style={{
                          width: '20px',
                          height: '20px',
                          marginRight: '2px',
                          filter: 'brightness(0) invert(1)',
                        }}
                      />
                    </span>
                    <span className="dark-profile-info-value">
                      {cityInput ||
                        cities.find((c) => c.id === Number(user.cityId))
                          ?.city ||
                        'Не указан'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="dark-profile-about-box">
                <span className="dark-profile-info-label">О себе:</span>
                <div className="dark-profile-about-value">
                  {user.content || '—'}
                </div>
              </div>

              <div className="dark-profile-actions">
                <Button
                  onClick={handleEditMode}
                  className="dark-profile-edit-btn"
                >
                  Изменить профиль
                </Button>
              </div>
            </div>
          )}
          {editMode && (
            <ProfileEditForm
              user={user}
              cities={cities}
              editMode={editMode}
              setEditMode={setEditModeWithLog}
              onCancel={handleCancelEdit}
            />
          )}

          <ProfileCards userId={user.id} />
          <div className="dark-account-management">
            <AccountManagement />
          </div>
        </div>
      </div>
    </ProfileErrorBoundary>
  );
};

export default ProfilePage;
