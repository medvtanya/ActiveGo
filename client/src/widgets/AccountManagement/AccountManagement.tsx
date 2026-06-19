import React, { useState } from "react";
import { Button } from "@/shared/ui/Button";
import { ConfirmationModal } from "@/shared/ui/ConfirmationModal";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxHooks";
import { logoutUserThunk, deleteUserThunk } from "@/entities/user/api/userApi";
import { setAccessToken } from "@/shared/lib/axiosInstance";
import { useNavigate } from "react-router-dom";
import { CLIENT_ROUTES } from "@/shared/enums/clientRoutes";
import "./AccountManagement.css";

const AccountManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user.user);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = async () => {
    try {
      setIsLoading(true);
      await dispatch(logoutUserThunk()).unwrap();
      navigate(CLIENT_ROUTES.HOME);
    } catch (error) {
      console.error("Ошибка при выходе из аккаунта:", error);
      alert("Ошибка при выходе из аккаунта. Попробуйте снова.");
    } finally {
      setIsLoading(false);
      setShowLogoutConfirm(false);
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleDeleteAccount = async () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!user?.id) {
      alert("Ошибка: не удалось получить ID пользователя");
      return;
    }

    try {
      setIsLoading(true);
      await dispatch(deleteUserThunk(user.id)).unwrap();
      console.log("Аккаунт успешно удален");

      setAccessToken("");
      localStorage.removeItem("accessToken");

      navigate(CLIENT_ROUTES.HOME);
    } catch (error) {
      console.error("Ошибка при удалении аккаунта:", error);
      alert("Ошибка при удалении аккаунта. Попробуйте снова.");
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div style={{ position: "relative" }}>
        <Button variant="danger" onClick={handleLogout} disabled={isLoading}>
          Выйти из аккаунта
        </Button>
      </div>

      <div style={{ position: "relative" }}>
        <Button
          variant="danger"
          onClick={handleDeleteAccount}
          disabled={isLoading}
          className="delete-account-btn"
          style={{ color: "white" }}
        >
          Удалить аккаунт
        </Button>
      </div>

      <ConfirmationModal
        isOpen={showLogoutConfirm}
        title="Подтверждение выхода"
        message="Вы точно хотите выйти из аккаунта?"
        confirmText="Выйти"
        cancelText="Отмена"
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
        isLoading={isLoading}
        variant="danger"
      />

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        title="Подтверждение удаления"
        message="Вы уверены, что хотите удалить аккаунт? Это действие нельзя отменить."
        confirmText="Удалить"
        cancelText="Отмена"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={isLoading}
        variant="danger"
      />
    </>
  );
};

export default AccountManagement;
