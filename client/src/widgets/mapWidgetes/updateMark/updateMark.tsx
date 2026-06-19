import { useEffect, useRef, useCallback } from "react";
import styles from "./styles.module.css";

declare global {
  interface Window {
    ymaps?: typeof import("yandex-maps");
  }
}

interface YandexMapProps {
  onCoordsSelect?: (coords: [number, number]) => void;
  initialCoords?: [number, number]; // Координаты старой метки
}

export function YandexMap({ onCoordsSelect, initialCoords }: YandexMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<globalThis.ymaps.Map | undefined>(undefined);
  const marksCollection = useRef<
    globalThis.ymaps.GeoObjectCollection | undefined
  >(undefined);
  const oldPlacemark = useRef<globalThis.ymaps.Placemark | undefined>(
    undefined
  );

  // Используем initialCoords как центр карты, если они есть
  const defaultCenter: [number, number] = initialCoords || [55.75, 37.62];

  const initMap = useCallback(() => {
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
            "searchControl",
            "geolocationControl",
          ],
        }
      );

      marksCollection.current = new window.ymaps.GeoObjectCollection();
      mapInstance.current.geoObjects.add(marksCollection.current);

      if (initialCoords && initialCoords[0] !== 0 && initialCoords[1] !== 0) {
        oldPlacemark.current = new window.ymaps.Placemark(
          initialCoords,
          {
            balloonContent: "Текущее местоположение события",
          },
          {
            preset: "islands#redDotIcon",
            iconColor: "#ff0000",
          }
        );
        marksCollection.current.add(oldPlacemark.current);
      }

      mapInstance.current.events.add("boundschange", handleBoundsChange);
    });
  }, [initialCoords, defaultCenter]);

  const handleCoords = () => {
    if (!mapInstance.current) return;
    const center = mapInstance.current.getCenter();
    const newCoords: [number, number] = [center[0], center[1]];

    if (oldPlacemark.current && marksCollection.current) {
      marksCollection.current.remove(oldPlacemark.current);
    }

    const newPlacemark = new window.ymaps.Placemark(
      newCoords,
      {
        balloonContent: "Новое местоположение события",
      },
      {
        preset: "islands#blueDotIcon",
        iconColor: "#007bff",
      }
    );

    if (marksCollection.current) {
      marksCollection.current.add(newPlacemark);
      oldPlacemark.current = newPlacemark;
    }

    if (onCoordsSelect) {
      onCoordsSelect(newCoords);
    }
  };

  const handleBoundsChange = () => {
    if (!mapInstance.current) return;

    const center = mapInstance.current.getCenter();

    const centerCoords: [number, number] = [center[0], center[1]];

    window.ymaps.geocode(centerCoords).then((res) => {
      const firstGeoObject = res.geoObjects.get(0);
      if (firstGeoObject) {
        try {
          const address = (
            firstGeoObject as unknown as { getAddressLine: () => string }
          ).getAddressLine();
          console.log("Адрес центра карты:", address);
        } catch {
          console.log("Адрес центра карты: не удалось получить");
        }
      }
    });
  };

  useEffect(() => {
    initMap();
  }, [initMap]);

  useEffect(() => {
    return () => {
      if (mapInstance.current) {
        mapInstance.current.destroy();
        mapInstance.current = undefined;
      }
    };
  }, []);

  return (
    <>
      <div style={{ position: "relative" }}>
        <div ref={mapRef} className={styles.map} />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "32px",
            height: "32px",
            backgroundImage: 'url("/icon.webp")',
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            pointerEvents: "none",
            zIndex: 1000,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "80%",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1001,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <button
            onClick={handleCoords}
            style={{
              background: "#007bff",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            {initialCoords && initialCoords[0] !== 0 && initialCoords[1] !== 0
              ? "Обновить местоположение"
              : "Добавить местоположение"}
          </button>
        </div>
      </div>
    </>
  );
}
