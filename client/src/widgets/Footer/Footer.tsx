import { useState } from "react";
import { logoutUserThunk } from "@/entities/user/api/userApi";
import { ConfirmationModal } from "@/shared/ui/ConfirmationModal";
import { CLIENT_ROUTES } from "@/shared/enums/clientRoutes";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxHooks";
import { NavLink, useNavigate } from "react-router";
import {
  SearchIcon,
  EventsIcon,
  LogoutIcon,
  ProfileIcon,
  GroupIcon,
  ChatIcon,
  BurgerIcon,
} from "./icons";
import "./Footer.css";

export default function Footer() {
  const user = useAppSelector((state) => state.user.user);
  const loading = useAppSelector((state) => state.user.loading);
  const isAuth = useAppSelector((state) => state.user.isAuth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const logoutHandler = async () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = async () => {
    try {
      await dispatch(logoutUserThunk()).unwrap();
      navigate(CLIENT_ROUTES.HOME);
      setIsMenuOpen(false);
      setShowLogoutConfirm(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleMenuToggle = () => {
    if (isMenuOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsMenuOpen(false);
        setIsClosing(false);
      }, 450);
    } else {
      setIsMenuOpen(true);
    }
  };

  const handleMenuItemClick = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsMenuOpen(false);
      setIsClosing(false);
    }, 450);
  };

  if (loading || !user || !isAuth) {
    return null;
  }

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-nav">
          <NavLink to={CLIENT_ROUTES.MAIN} className="nav-item">
            <span className="nav-icon">
              <SearchIcon />
            </span>
            <span className="nav-text">Поиск</span>
          </NavLink>

          <NavLink to={CLIENT_ROUTES.EVENT} className="nav-item">
            <span className="nav-icon">
              <EventsIcon />
            </span>
            <span className="nav-text">События</span>
          </NavLink>

          <NavLink to={CLIENT_ROUTES.EVENTFORM} className="nav-item add-btn">
            <span className="nav-text">+</span>
          </NavLink>

          <NavLink to={CLIENT_ROUTES.SPORT_CLUB} className="nav-item">
            <span className="nav-icon">
              <GroupIcon />
            </span>
            <span className="nav-text">Клубы</span>
          </NavLink>

          <button
            className="nav-item burger-menu-btn"
            onClick={handleMenuToggle}
          >
            <span className="nav-icon">
              <BurgerIcon />
            </span>
            <span className="nav-text">Меню</span>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div
          className={`burger-menu-overlay ${isClosing ? "closing" : ""}`}
          onClick={handleMenuToggle}
        >
          <div
            className={`burger-menu ${isClosing ? "closing" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="burger-menu-header">
              <h3>Меню</h3>
              <button className="close-btn" onClick={handleMenuToggle}>
                ✕
              </button>
            </div>

            <nav className="burger-menu-nav">
              <NavLink
                to={CLIENT_ROUTES.PROFILE}
                className="burger-menu-item"
                onClick={handleMenuItemClick}
              >
                <span className="menu-icon">
                  <ProfileIcon />
                </span>
                <span>Мой профиль</span>
              </NavLink>

              <NavLink
                to={CLIENT_ROUTES.MY_CHATS}
                className="burger-menu-item"
                onClick={handleMenuItemClick}
              >
                <span className="menu-icon">
                  <ChatIcon />
                </span>
                <span>Мои чаты</span>
              </NavLink>

              <div className="burger-menu-divider"></div>

              <button
                className="burger-menu-item logout-btn"
                onClick={logoutHandler}
              >
                <span className="menu-icon">
                  <LogoutIcon />
                </span>
                <span>Выход</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={showLogoutConfirm}
        title="Подтверждение выхода"
        message="Вы точно хотите выйти из аккаунта?"
        confirmText="Выйти"
        cancelText="Отмена"
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
        variant="danger"
      />
    </footer>
  );
}
