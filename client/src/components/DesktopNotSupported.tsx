import React, { useEffect, useRef } from "react";
import "./DesktopNotSupported.css";

const DesktopNotSupported: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      const playVideo = async () => {
        try {
          videoRef.current!.volume = 0;
          await videoRef.current!.play();
        } catch (error) {
          console.error("Ошибка при запуске видео:", error);
        }
      };

      playVideo();
    }
  }, []);

  return (
    <div className="desktop-not-supported">
      <div className="video-background">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="background-video"
          poster={`${import.meta.env.VITE_API_URL}/images/event/1.jpg`}
        >
          <source src="/videoSport.MOV" type="video/mp4" />
          Ваш браузер не поддерживает видео.
        </video>
        <div className="video-overlay"></div>
      </div>

      <div className="desktop-container">
        <div className="desktop-content">
          <div className="desktop-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z" />
            </svg>
          </div>

          <h1 className="desktop-title">
            <span className="desktop-title-app">ActiveGo</span>
            <span className="desktop-title-main">МОБИЛЬНОЕ</span>
            <span className="desktop-title-accent">ПРИЛОЖЕНИЕ</span>
          </h1>

          <p className="desktop-message">
            Извините, но это приложение разработано специально для мобильных
            устройств
          </p>

          <div className="desktop-features">
            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <span>Оптимизировано для смартфонов</span>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <span>Удобная навигация</span>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <span>Быстрый доступ к функциям</span>
            </div>
          </div>

          <div className="desktop-cta">
            <p className="cta-text">Откройте приложение на вашем смартфоне</p>
            <div className="cta-buttons">
              <button className="cta-button primary">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                App Store
              </button>
              <button className="cta-button secondary">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                Google Play
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopNotSupported;
