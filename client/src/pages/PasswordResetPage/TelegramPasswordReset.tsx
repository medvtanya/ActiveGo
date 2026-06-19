import React, { useState } from "react";
import axios from "axios";
import { IMaskInput } from "react-imask";
import { useNavigate } from "react-router-dom";
import { Button } from "../../shared/ui/Button";
import { Input } from "../../shared/ui/Input";
import styles from "./TelegramPasswordReset.module.css";
import { CLIENT_ROUTES } from "@/shared/enums/clientRoutes";

const TelegramPasswordReset: React.FC = () => {
  const [step, setStep] = useState<"request" | "verify" | "success">("request");
  const [iphone, setIphone] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [telegramId, setTelegramId] = useState<string | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (step === "success") {
      const timer = setTimeout(() => {
        navigate(CLIENT_ROUTES.LOGIN);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step, navigate]);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    try {
      const res = await axios.post("/api/user/auth/request-reset", {
        iphone,
      });
      setInfo(res.data.message || "Код отправлен в Telegram");
      if (res.data.telegram_id) setTelegramId(res.data.telegram_id);
      setStep("verify");
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        setError(e.response?.data?.message || "Ошибка отправки кода");
      } else {
        setError("Ошибка отправки кода");
      }
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    if (password.length < 6) {
      setError("Пароль должен быть не менее 6 символов");
      return;
    }
    if (password !== confirm) {
      setError("Пароли не совпадают");
      return;
    }
    try {
      const res = await axios.post("/api/user/auth/verify-reset", {
        telegram_id: telegramId,
        code,
        password,
      });
      setInfo(res.data.message || "Пароль успешно сброшен");
      setStep("success");
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        setError(e.response?.data?.message || "Ошибка сброса пароля");
      } else {
        setError("Ошибка сброса пароля");
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Восстановление пароля через Telegram</h2>

      {step === "request" && (
        <form onSubmit={handleRequest} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Ваш телефон:</label>
            <IMaskInput
              mask={"+7 (000) 000-00-00"}
              value={iphone}
              onAccept={(value: string) => setIphone(value)}
              required
              className="phone-input"
              placeholder="+7 (___) ___-__-__"
              style={{
                caretColor: "hsl(81deg 70% 65%)",
              }}
              definitions={{
                "#": /[1-9]/,
              }}
              lazy={false}
              overwrite
            />
          </div>
          <Button type="submit" className={styles.submitButton}>
            Получить код
          </Button>
        </form>
      )}

      {step === "verify" && (
        <form onSubmit={handleVerify} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Код из Telegram:</label>
            <Input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={styles.input}
              placeholder="Введите код"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Новый пароль:</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="Введите новый пароль"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Повторите пароль:</label>
            <Input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={styles.input}
              placeholder="Повторите пароль"
            />
          </div>
          <Button type="submit" className={styles.submitButton}>
            Сбросить пароль
          </Button>

          {error === "Код истёк или не найден" && (
            <div className={styles.errorContainer}>
              <p className={styles.errorText}>
                Код истёк или не найден.
                <br />
                Код для восстановления пароля действует 10 минут.
                <br />
                Пожалуйста, запросите новый код.
              </p>
              <Button
                type="button"
                variant="secondary"
                className={styles.newCodeButton}
                onClick={() => {
                  setStep("request");
                  setCode("");
                  setPassword("");
                  setConfirm("");
                  setError("");
                  setInfo("");
                  setTelegramId(null);
                }}
              >
                Запросить новый код
              </Button>
            </div>
          )}
        </form>
      )}

      {step === "success" && (
        <div className={styles.successContainer}>
          <p className={styles.successText}>
            Пароль успешно сброшен! Теперь вы можете войти с новым паролем.
          </p>
          <p className={styles.redirectText}>
            Вы будете перенаправлены на страницу входа через 3 секунды...
          </p>
          <Button
            variant="secondary"
            className={styles.loginButton}
            onClick={() => navigate(CLIENT_ROUTES.LOGIN)}
          >
            На страницу входа
          </Button>
        </div>
      )}

      {error && <div className={styles.errorMessage}>{error}</div>}
      {info && <div className={styles.infoMessage}>{info}</div>}
    </div>
  );
};

export default TelegramPasswordReset;
