import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./FirstPage.css";
import { CLIENT_ROUTES } from "@/shared/enums/clientRoutes";

const FirstPage = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      const playVideo = async () => {
        try {
          await videoRef.current!.play();
        } catch (error) {
          console.error("Ошибка при запуске видео:", error);
        }
      };

      setTimeout(playVideo, 100);
    }
  }, []);

  const handleEnterClick = () => {
    navigate(CLIENT_ROUTES.LOGIN);
  };

  return (
    <div className="first-page">
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
      <div className="main-content">
        <div className="logo-container">
          <img src="/logo.png" alt="SportApp Logo" className="logo-image" />
        </div>
        <h1 className="slogan">
          ТВОЙ МИР <span>СПОРТА</span>
          <br />— В ОДНОМ ПРИЛОЖЕНИИ
        </h1>
        <button onClick={handleEnterClick} className="enter-buttont">
          Войти
        </button>
      </div>
    </div>
  );
};

export default FirstPage;
