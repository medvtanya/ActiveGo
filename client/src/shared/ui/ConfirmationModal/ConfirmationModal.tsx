import React from 'react';
import { Button } from '@/shared/ui/Button';
import './ConfirmationModal.css';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  variant?: 'danger' | 'primary' | 'secondary';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  isLoading = false,
  variant = 'danger',
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirmation-modal-overlay">
      <div className="confirmation-modal">
        <div className="confirmation-modal-header">
          <h3 className="confirmation-modal-title">{title}</h3>
        </div>
        <div className="confirmation-modal-body">
          <p className="confirmation-modal-message">{message}</p>
        </div>
        <div className="confirmation-modal-footer">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
            className="confirmation-modal-cancel-btn"
          >
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            disabled={isLoading}
            className="confirmation-modal-confirm-btn"
            style={variant === 'danger' ? { color: 'white' } : undefined}
          >
            {isLoading ? (
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span>Загрузка...</span>
              </div>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
