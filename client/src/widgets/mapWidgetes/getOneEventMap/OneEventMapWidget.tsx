import { getAllEventsThunk } from "@/entities/event/api/eventApi";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxHooks";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    ymaps?: typeof import("yandex-maps");
  }
}

interface OneEventMapWidgetProps {
  eventId: number;
}

export function OneEventMapWidget({ eventId }: OneEventMapWidgetProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const mapInstance = useRef<globalThis.ymaps.Map | undefined>(undefined);
  const marksCollection = useRef<
    globalThis.ymaps.GeoObjectCollection | undefined
  >(undefined);
  const { events } = useAppSelector((state) => state.event);
  const { sports } = useAppSelector((state) => state.sport);

  const event = events.find((event) => event.id === eventId);

  const defaultCenter: [number, number] =
    Array.isArray(event?.coords) && event.coords.length === 2
      ? [event.coords[0], event.coords[1]]
      : [59.94, 30.32];

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
          zoom: 13,
          controls: [
            "zoomControl",
            "fullscreenControl",
            "typeSelector",
            "geolocationControl",
          ],
        }
      );
      marksCollection.current = new window.ymaps.GeoObjectCollection();
      mapInstance.current.geoObjects.add(marksCollection.current);
    });
  }, []);

  useEffect(() => {
    if (
      !window.ymaps ||
      !mapInstance.current ||
      !marksCollection.current ||
      !event
    )
      return;
    marksCollection.current.removeAll();

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
  }, [event]);

  useEffect(() => {
    if (!event || !mapInstance.current) return;
    if (Array.isArray(event.coords) && event.coords.length === 2) {
      mapInstance.current.setCenter([event.coords[0], event.coords[1]]);
    }
  }, [event]);

  return <div ref={mapRef} style={{ width: "100%", height: "300px" }} />;
}
