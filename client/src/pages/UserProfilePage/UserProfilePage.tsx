import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/shared/hooks/reduxHooks";
import type { RootState } from "@/app/store/store";
import type { UserType } from "@/entities/user/model";
import { axiosInstance } from "@/shared/lib/axiosInstance";
import "./UserProfilePage.css";

class UserProfileErrorBoundary extends React.Component<
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

const UserProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = useAppSelector((state: RootState) => state.user.user);
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!id) {
        setError("ID пользователя не указан");
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get(`/user/${id}`);
        setUser(response.data.data);
      } catch (err: unknown) {
        console.error("Ошибка при загрузке профиля:", err);
        if (
          err &&
          typeof err === "object" &&
          "response" in err &&
          err.response &&
          typeof err.response === "object" &&
          "status" in err.response &&
          err.response.status === 404
        ) {
          setError("Пользователь не найден");
        } else {
          setError("Ошибка при загрузке профиля");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="dark-loading">
        <span>Загрузка профиля...</span>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="dark-profile-container">
        <div className="dark-profile-page">
          <div className="dark-profile-main">
            <div className="dark-error-message">
              <h2>Ошибка</h2>
              <p>{error || "Пользователь не найден"}</p>
              <button onClick={handleBack} className="dark-profile-edit-btn">
                Назад
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === user.id;

  console.log("UserProfilePage - данные пользователя:", {
    userPhoto: user.photo,
    userTelegramPhoto: user.telegram_photo,
    hasPhoto: !!user.photo,
    photoStartsWithHttp: user.photo?.startsWith("http"),
    apiUrl: import.meta.env.VITE_API_URL,
  });

  return (
    <UserProfileErrorBoundary>
      <div className="dark-profile-container">
        <div className="dark-profile-page">
          <div
            className="dark-profile-main"
            style={{
              backgroundImage: user.photo
                ? user.photo.startsWith("http")
                  ? `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${user.photo})`
                  : `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${
                      import.meta.env.VITE_API_URL
                    }${user.photo})`
                : "none",
              backgroundSize: user.photo ? "cover" : "auto",
              backgroundPosition: user.photo ? "center" : "auto",
              backgroundRepeat: user.photo ? "no-repeat" : "auto",
              backgroundColor: user.photo ? "transparent" : "var(--dark)",
            }}
          >
            <div className="dark-profile-header">
              <div className="dark-profile-avatar-container">
                <img
                  src={
                    user.telegram_photo
                      ? user.telegram_photo.startsWith("http")
                        ? user.telegram_photo
                        : `${import.meta.env.VITE_API_URL}${
                            user.telegram_photo
                          }`
                      : user.photo
                      ? user.photo.startsWith("http")
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
                        width: "20px",
                        height: "20px",
                        marginRight: "2px",
                        filter: "brightness(0) invert(1)",
                      }}
                    />
                  </span>
                  <span className="dark-profile-info-value">{`${
                    user.firstName
                  } ${user.lastName || ""}`}</span>
                </div>
                <div className="dark-profile-info-box">
                  <span className="dark-profile-info-label">
                    <img
                      src="/avatar.svg"
                      alt="Логин"
                      style={{
                        width: "20px",
                        height: "20px",
                        marginRight: "2px",
                        filter: "brightness(0) invert(1)",
                      }}
                    />
                  </span>
                  <span className="dark-profile-info-value">
                    {user.userName || "Не указан"}
                  </span>
                </div>
                <div className="dark-profile-info-box">
                  <span className="dark-profile-info-label">
                    <img
                      src="/city.svg"
                      alt="Город"
                      style={{
                        width: "20px",
                        height: "20px",
                        marginRight: "2px",
                        filter: "brightness(0) invert(1)",
                      }}
                    />
                  </span>
                  <span className="dark-profile-info-value">
                    {user.city?.city || "Не указан"}
                  </span>
                </div>
                {user.link && (
                  <div className="dark-profile-info-box">
                    <span className="dark-profile-info-label">
                      <img
                        src="/link.svg"
                        alt="Ссылка"
                        style={{
                          width: "20px",
                          height: "20px",
                          marginRight: "2px",
                          filter: "brightness(0) invert(1)",
                        }}
                      />
                    </span>
                    <span className="dark-profile-info-value">
                      <a
                        href={user.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "var(--primary)",
                          textDecoration: "none",
                        }}
                      >
                        {user.link}
                      </a>
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="dark-profile-about-box">
              <span className="dark-profile-info-label">О себе:</span>
              <div className="dark-profile-about-value">
                {user.content || "—"}
              </div>
            </div>

            <div className="dark-profile-actions">
              <button onClick={handleBack} className="dark-profile-edit-btn">
                Назад
              </button>
              {isOwnProfile && (
                <button
                  onClick={() => navigate("/profile")}
                  className="dark-profile-edit-btn"
                  style={{ marginLeft: "1rem" }}
                >
                  Редактировать профиль
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </UserProfileErrorBoundary>
  );
};

export default UserProfilePage;
