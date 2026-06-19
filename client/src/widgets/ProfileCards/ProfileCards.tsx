import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/shared/hooks/reduxHooks';
import {
  getAllUserSportsThunk,
  createUserSportThunk,
  deleteUserSportThunk,
} from '@/entities/userSport/api/userSportApi';
import { getAllSportsThunk } from '@/entities/sport/api/sportApi';
import { SportEditModal } from '@/shared/ui/SportEditModal';
import './ProfileCards.css';
import '@/pages/ProfilePage/ProfilePage.css';

interface ProfileCardsProps {
  userId: number;
}

const ProfileCards: React.FC<ProfileCardsProps> = ({ userId }) => {
  const dispatch = useAppDispatch();
  const userSports = useAppSelector((state) => state.userSport.userSports);

  const sports = useAppSelector((state) => state.sport.sports);

  const [showSportEditModal, setShowSportEditModal] = useState(false);

  useEffect(() => {
    dispatch(getAllUserSportsThunk());
    dispatch(getAllSportsThunk());
  }, [dispatch]);

  const mySports = userSports?.filter((s) => s.userId === userId) || [];

  const handleAddSport = async (sportId: number) => {
    try {
      await dispatch(
        createUserSportThunk({
          userId,
          sportId,
        })
      ).unwrap();

      dispatch(getAllUserSportsThunk());
    } catch (error: unknown) {
      console.error('Ошибка при добавлении вида спорта:', error);

      let errorMessage = 'Неизвестная ошибка';
      if (error && typeof error === 'object' && 'payload' in error) {
        const payload = (error as { payload?: { message?: string } }).payload;
        if (payload && payload.message) {
          errorMessage = payload.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      alert(`Ошибка при добавлении вида спорта: ${errorMessage}`);
    }
  };

  const handleRemoveSport = async (userSportId: number) => {
    try {
      await dispatch(deleteUserSportThunk(userSportId)).unwrap();

      dispatch(getAllUserSportsThunk());
    } catch (error: unknown) {
      console.error('Ошибка при удалении вида спорта:', error);

      let errorMessage = 'Неизвестная ошибка';
      if (error && typeof error === 'object' && 'payload' in error) {
        const payload = (error as { payload?: { message?: string } }).payload;
        if (payload && payload.message) {
          errorMessage = payload.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      alert(`Ошибка при удалении вида спорта: ${errorMessage}`);
    }
  };

  return (
    <>
      <section className="dark-profile-sections">
        <div className="dark-profile-block">
          <div className="dark-profile-block-header">
            <h2 className="dark-profile-block-title">Мои виды спорта</h2>
            <button
              className="dark-profile-edit-button"
              onClick={() => setShowSportEditModal(true)}
            >
              <img src="/pencil.svg" alt="Редактировать" />
            </button>
          </div>
          <div className="dark-profile-sports-list">
            {mySports.length === 0 && (
              <div className="dark-profile-empty">
                Не выбраны мои виды спорта
              </div>
            )}
            {mySports.map((userSport) => {
              const sport = sports?.find((s) => s.id === userSport.sportId);
              return (
                <div key={userSport.id} className="dark-profile-sport-item">
                  <span>{sport?.type || `Спорт ${userSport.sportId}`}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <SportEditModal
        isOpen={showSportEditModal}
        onClose={() => setShowSportEditModal(false)}
        sports={sports || []}
        userSports={mySports}
        onAddSport={handleAddSport}
        onRemoveSport={handleRemoveSport}
      />
    </>
  );
};

export default ProfileCards;
