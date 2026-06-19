import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxHooks";
import {
  getOneEventThunk,
  updateEventThunk,
} from "@/entities/event/api/eventApi";
import { useEffect, useState } from "react";
import { Button } from "@/shared/ui/Button";
import { useDropzone } from "react-dropzone";
import "./GalleryEventPage.css";

const GalleryEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { event } = useAppSelector((state) => state.event);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(getOneEventThunk(Number(id)));
    }
  }, [dispatch, id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png"] },
    maxFiles: 10,
    onDrop: (acceptedFiles) => {
      setSelectedFiles((prev) => [...prev, ...acceptedFiles].slice(0, 10));
    },
  });

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadPhotos = async () => {
    if (!selectedFiles.length || !event) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("existingPhotos", JSON.stringify(event.photos));

      selectedFiles.forEach((file) => {
        formData.append("photos", file);
      });

      await dispatch(
        updateEventThunk({
          id: event.id,
          data: formData,
        })
      ).unwrap();

      setSelectedFiles([]);
      dispatch(getOneEventThunk(Number(id)));
    } catch (error) {
      console.error("Ошибка при загрузке фото:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const openFullscreen = (index: number) => {
    setFullscreenIndex(index);
  };

  const closeFullscreen = () => {
    setFullscreenIndex(null);
  };

  const goToNextFullscreen = () => {
    if (fullscreenIndex === null || !event) return;
    setFullscreenIndex((prev) =>
      prev === event.photos.length - 1 ? 0 : prev! + 1
    );
  };

  const goToPrevFullscreen = () => {
    if (fullscreenIndex === null || !event) return;
    setFullscreenIndex((prev) =>
      prev === 0 ? event.photos.length - 1 : prev! - 1
    );
  };

  if (!event) {
    return <div className="loading">Загрузка галереи...</div>;
  }

  return (
    <div className="gallery-page">
      <div className="gallery-header">
        <button className="backe-button" onClick={handleGoBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5" stroke="currentColor" strokeWidth="2" />
            <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
        <h1>Галерея события: {event.title}</h1>
      </div>

      <div className="add-photo-section">
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? "active" : ""}`}
        >
          <input {...getInputProps()} />
          {selectedFiles.length > 0 ? (
            <div className="preview-grid">
              {selectedFiles.map((file, idx) => (
                <div key={idx} className="preview-item">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${idx}`}
                    className="preview-image"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSelectedFile(idx);
                    }}
                    className="remove-photo-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : isDragActive ? (
            <p>Отпустите файлы здесь...</p>
          ) : (
            <p>Кликните для выбора фото</p>
          )}
        </div>

        {selectedFiles.length > 0 && (
          <div className="upload-actions">
            <Button
              variant="primary"
              onClick={handleUploadPhotos}
              disabled={isUploading}
            >
              {isUploading ? "Загрузка..." : "Загрузить фото"}
            </Button>
            <Button variant="secondary" onClick={() => setSelectedFiles([])}>
              Отмена
            </Button>
          </div>
        )}
      </div>

      <div className="photo-grid">
        {event.photos.map((photo, index) => (
          <div
            key={index}
            className="photo-card"
            onClick={() => openFullscreen(index)}
          >
            <img
              src={`${import.meta.env.VITE_API_URL}/${photo}`}
              alt={`Фото события ${index + 1}`}
              className="photo-image"
            />
            <div className="photo-number">{index + 1}</div>
          </div>
        ))}
      </div>

      {fullscreenIndex !== null && (
        <div className="fullscreen-overlay" onClick={closeFullscreen}>
          <div
            className="fullscreen-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="nav-button prev"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevFullscreen();
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </button>

            <img
              src={`${import.meta.env.VITE_API_URL}/${
                event.photos[fullscreenIndex]
              }`}
              alt={`Фото ${fullscreenIndex + 1}`}
              className="fullscreen-image"
            />

            <button
              className="nav-button next"
              onClick={(e) => {
                e.stopPropagation();
                goToNextFullscreen();
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </button>

            <div className="photo-counter">
              {fullscreenIndex + 1} / {event.photos.length}
            </div>

            <button className="close-button" onClick={closeFullscreen}>
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryEventPage;
