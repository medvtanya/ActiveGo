import React from "react";
import { Link, useLocation } from "react-router-dom";
import { CLIENT_ROUTES } from "@/shared/enums/clientRoutes";
import "./ToggleAuth.css";

const ToggleAuth: React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === CLIENT_ROUTES.LOGIN;
  const isRegistrationPage = location.pathname === CLIENT_ROUTES.REGISTRATION;

  return (
    <div className="toggle-auth-container">
      <div className="toggle-auth-wrapper">
        <Link
          to={CLIENT_ROUTES.LOGIN}
          className={`toggle-auth-btn ${isLoginPage ? "active" : ""}`}
        >
          Вход
        </Link>
        <Link
          to={CLIENT_ROUTES.REGISTRATION}
          className={`toggle-auth-btn ${isRegistrationPage ? "active" : ""}`}
        >
          Регистрация
        </Link>
        <div
          className={`toggle-auth-slider ${
            isRegistrationPage ? "slide-right" : "slide-left"
          }`}
        ></div>
      </div>
    </div>
  );
};

export default ToggleAuth;
