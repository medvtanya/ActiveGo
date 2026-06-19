import React, { useState } from "react";
import { loginUserThunk } from "@/entities/user/api/userApi";
import { validateLoginUser } from "@/entities/user/validation/validation";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxHooks";
import { useNavigate, Link } from "react-router-dom";
import { CLIENT_ROUTES } from "@/shared/enums/clientRoutes";
import TelegramAuthModal from "@/entities/user/ui/TelegramAuthModal";
import ToggleAuth from "@/shared/ui/ToggleAuth";
import "./LoginPage.css";

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const [showTelegramModal, setShowTelegramModal] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState<string | null>(null);

  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  });

  const isFormValid = () => {
    return form.email.trim() !== "" && form.password.trim() !== "";
  };

  const validateField = (name: string, value: string) => {
    let error = "";

    switch (name) {
      case "email":
        if (!value.trim()) {
          error = "Email обязателен";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          error = "Некорректный формат email";
        }
        break;
      case "password":
        if (!value.trim()) {
          error = "Пароль обязателен";
        }
        break;
    }

    return error;
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
      dispatch({ type: "user/resetUserError" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newFieldErrors = {
      email: validateField("email", form.email),
      password: validateField("password", form.password),
    };

    setFieldErrors(newFieldErrors);

    const hasErrors = Object.values(newFieldErrors).some(
      (error) => error !== ""
    );
    if (hasErrors) {
      return;
    }

    const validationError = validateLoginUser(form);
    if (validationError) {
      setFormError(validationError);
      return;
    }
    setFormError(null);

    dispatch({ type: "user/resetUserError" });

    console.log("LoginPage - отправляем данные для входа:", form);

    const resultAction = await dispatch(loginUserThunk(form));

    console.log("LoginPage - результат входа:", resultAction);

    if (loginUserThunk.rejected.match(resultAction)) {
      const serverError =
        resultAction.payload?.data || resultAction.payload?.error;
      console.log("LoginPage - получена ошибка от сервера:", serverError);
      console.log("LoginPage - payload:", resultAction.payload);

      if (serverError) {
        if (
          serverError.toLowerCase().includes("email") ||
          serverError.toLowerCase().includes("почта") ||
          serverError.toLowerCase().includes("пользователь") ||
          serverError.toLowerCase().includes("user") ||
          serverError.toLowerCase().includes("не найден")
        ) {
          console.log("LoginPage - показываем ошибку в поле email");
          setFieldErrors((prev) => ({ ...prev, email: serverError }));
        } else if (
          serverError.toLowerCase().includes("пароль") ||
          serverError.toLowerCase().includes("password") ||
          serverError.toLowerCase().includes("неверный")
        ) {
          console.log("LoginPage - показываем ошибку в поле password");
          setFieldErrors((prev) => ({ ...prev, password: serverError }));
        } else {
          console.log("LoginPage - показываем общую ошибку");
          setFormError(serverError);
        }
      }
      return;
    }

    if (loginUserThunk.fulfilled.match(resultAction)) {
      navigate(CLIENT_ROUTES.MAIN);
    }
  };

  return (
    <div className="dark-login-container">
      <div className="dark-login-card">
        <h2 className="dark-login-title">Вход</h2>
        <form onSubmit={handleSubmit} className="dark-login-form">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className={`dark-login-input ${fieldErrors.email ? "error" : ""}`}
          />
          {fieldErrors.email && (
            <div className="field-error">{fieldErrors.email}</div>
          )}

          <input
            name="password"
            type="password"
            placeholder="Пароль"
            value={form.password}
            onChange={handleChange}
            className={`dark-login-input ${
              fieldErrors.password ? "error" : ""
            }`}
          />
          {fieldErrors.password && (
            <div className="field-error">{fieldErrors.password}</div>
          )}

          {formError && <div className="dark-error-message">{formError}</div>}
          {error && <div className="dark-error-message">{error}</div>}

          <button
            type="submit"
            disabled={loading || !isFormValid()}
            className="dark-login-button"
          >
            {loading ? "Вход..." : "Войти"}
          </button>

          <div className="dark-forgot-password">
            <Link to="/password-reset/telegram">Забыли пароль?</Link>
          </div>
        </form>

        <div className="dark-divider">
          <span>или</span>
        </div>

        <button
          type="button"
          className="dark-telegram-button"
          onClick={() => setShowTelegramModal(true)}
        >
          Войти через Telegram
        </button>
        <ToggleAuth />
      </div>

      {showTelegramModal && (
        <TelegramAuthModal
          mode="login"
          onSuccess={() => {
            setShowTelegramModal(false);
            navigate(CLIENT_ROUTES.MAIN);
          }}
          onClose={() => setShowTelegramModal(false)}
        />
      )}
    </div>
  );
};
export default LoginPage;
