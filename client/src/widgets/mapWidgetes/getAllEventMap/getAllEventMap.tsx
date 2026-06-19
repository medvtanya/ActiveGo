import { getAllEventsThunk } from "@/entities/event/api/eventApi";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxHooks";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    ymaps?: typeof import("yandex-maps");
  }
}

export function AllEventsMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const mapInstance = useRef<globalThis.ymaps.Map | undefined>(undefined);
  const marksCollection = useRef<
    globalThis.ymaps.GeoObjectCollection | undefined
  >(undefined);
  const { events } = useAppSelector((state) => state.event);
  const { sports } = useAppSelector((state) => state.sport);
  console.log("events =======>>>>", JSON.parse(JSON.stringify(events)));
  const defaultCenter: [number, number] = [59.94, 30.32];

  useEffect(() => {
    dispatch(getAllEventsThunk());
  }, [dispatch]);

  useEffect(() => {
    if (!window.ymaps || !mapRef.current) return;
    window.ymaps.ready(() => {
      if (mapInstance.current) {
        mapInstance.current.destroy();
        mapInstance.current = undefined;
      }
      mapInstance.current = new window.ymaps.Map(
        mapRef.current as HTMLElement,
        {
          center: defaultCenter,
          zoom: 12,
          controls: ["zoomControl", "fullscreenControl", "typeSelector"],
        }
      );
      marksCollection.current = new window.ymaps.GeoObjectCollection();
      mapInstance.current.geoObjects.add(marksCollection.current);

      mapInstance.current.events.add("boundschange", handleBoundsChange);
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // @ts-expect-error: Добавляем функцию в window для доступа из balloonContent
    window.handlePlacemarkClick = (id: string) => {
      navigate(`/events/${id}`);
    };
    return () => {
      // @ts-expect-error: Удаляем функцию из window при размонтировании
      delete window.handlePlacemarkClick;
    };
  }, [navigate]);

  useEffect(() => {
    if (!window.ymaps || !mapInstance.current || !marksCollection.current)
      return;
    marksCollection.current.removeAll();

    events.forEach((event) => {
      const eventDate = new Date(event.date);
      const formattedDate = eventDate.toLocaleDateString();
      const formattedTime = eventDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const balloonContent = `
        <div style="
          background: #23262a;
          border: 1.5px solid #a3ff12;
          border-radius: 18px;
          box-shadow: 0 2px 16px 0 rgba(163,255,18,0.10);
          padding: 16px 14px 12px 14px;
          min-width: 200px;
          font-family: 'Inter', Arial, sans-serif;
          color: #fff;
        ">
          <div style="
            display: inline-block;
            background: #a3ff12;
            color: #23262a;
            font-weight: 700;
            font-size: 15px;
            border-radius: 16px;
            padding: 5px 18px;
            margin-bottom: 10px;
            letter-spacing: 1px;
            box-shadow: 0 0 12px 0 #a3ff12;
          ">
            ${(sports || []).find((s) => s.id === event.sportId)?.type || ""}
          </div>
          <h3 style="
            margin: 10px 0 10px 0;
            font-size: 20px;
            font-weight: 800;
            color: #d1d1d1;
            line-height: 1.1;
          ">${event.title}</h3>
          <div style="margin-bottom: 8px;">
            <span style="font-family: 'Fira Mono', monospace; color: #a3ff12; font-size: 14px;">Дата: ${formattedDate}</span><br/>
            <span style="font-family: 'Fira Mono', monospace; color: #a3ff12; font-size: 14px;">Время: ${formattedTime}</span>
          </div>
          <div style="margin-bottom: 6px; display: flex; align-items: center;">
            <span style="font-size: 16px; margin-right: 6px;">📍</span>
            <span style="font-size: 14px; color: #fff;">${
              event.location || ""
            }</span>
          </div>
          <div style="margin-bottom: 10px; display: flex; align-items: center;">
            <span style="font-size: 16px; margin-right: 6px;">👥</span>
            <span style="font-size: 14px; color: #fff;">Участников: ${
              event.member
            }</span>
          </div>
          <button onclick="window.handlePlacemarkClick('${event.id}')"
            style="
              background: #a3ff12;
              color: #23262a;
              border: none;
              border-radius: 10px;
              padding: 8px 14px;
              font-size: 15px;
              font-weight: 700;
              cursor: pointer;
              margin-top: 6px;
              transition: background 0.2s;
              box-shadow: 0 0 8px 0 #a3ff12;
            "
            onmouseover="this.style.background='#bfff4d'"
            onmouseout="this.style.background='#a3ff12'"
          >Перейти на событие</button>
        </div>
      `;
      const placemark = new window.ymaps.Placemark(
        event.coords,
        { balloonContentBody: balloonContent },
        {
          preset: "islands#redDotIcon",
          balloonPanelMaxMapArea: 0,
          balloonShadow: false,
        }
      );
      marksCollection.current!.add(placemark);
    });
  }, [events]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleBoundsChange = () => {
    if (!mapInstance.current) return;
    const center = mapInstance.current.getCenter();
    console.log("Центр карты:", center);
  };

  return (
    <>
      <div
        ref={mapRef}
        style={{
          width: "100vw",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1000,
        }}
      >
        <button
          className="back-button"
          onClick={handleGoBack}
          aria-label="Назад"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 12H5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 19L5 12L12 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </>
  );
}
