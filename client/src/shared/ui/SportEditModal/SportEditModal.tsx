import React from 'react';
import { Button } from '@/shared/ui/Button';
import './SportEditModal.css';

interface Sport {
  id: number;
  type: string;
}

interface UserSport {
  id: number;
  userId: number;
  sportId: number;
}

interface SportEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  sports: Sport[];
  userSports: UserSport[];
  onAddSport: (sportId: number) => void;
  onRemoveSport: (userSportId: number) => void;
  isLoading?: boolean;
}

export const SportEditModal: React.FC<SportEditModalProps> = ({
  isOpen,
  onClose,
  sports,
  userSports,
  onAddSport,
  onRemoveSport,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="sport-edit-modal-overlay" onClick={onClose}>
      <div className="sport-edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sport-edit-modal-header">
          <h3 className="sport-edit-modal-title">Редактировать виды спорта</h3>
        </div>

        <div className="sport-edit-modal-content">
          <div className="sport-edit-section">
            <h5 className="sport-edit-section-title">Мои виды спорта:</h5>
            {userSports.length === 0 ? (
              <div className="sport-edit-empty">
                Нет добавленных видов спорта
              </div>
            ) : (
              <div className="sport-tags-container">
                {userSports.map((userSport) => {
                  const sport = sports?.find((s) => s.id === userSport.sportId);
                  return (
                    <div key={userSport.id} className="sport-tag">
                      <span className="sport-tag-text">
                        {sport?.type || `Спорт ${userSport.sportId}`}
                      </span>
                      <button
                        className="sport-tag-remove"
                        onClick={() => onRemoveSport(userSport.id)}
                        disabled={isLoading}
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="sport-edit-section">
            <h5 className="sport-edit-section-title">Добавить вид спорта:</h5>
            {sports ? (
              <div className="sport-buttons-container">
                {sports.map((sport) => {
                  const isAlreadyAdded = userSports.some(
                    (userSport) => userSport.sportId === sport.id
                  );
                  return (
                    <button
                      key={sport.id}
                      className={`sport-add-button ${
                        isAlreadyAdded ? 'disabled' : ''
                      }`}
                      onClick={() => !isAlreadyAdded && onAddSport(sport.id)}
                      disabled={isAlreadyAdded || isLoading}
                    >
                      {sport.type}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="sport-edit-loading">Загрузка видов спорта...</div>
            )}
          </div>
        </div>

        <div className="sport-edit-modal-footer">
          <Button variant="secondary" onClick={onClose}>
            Закрыть
          </Button>
        </div>
      </div>
    </div>
  );
};
