import { useState } from "react";
import { Button } from "@/shared/ui/Button";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/shared/hooks/reduxHooks";
import { updateSportClubThunk } from "@/entities/sportClub/api/sportClubApi";
import type { SportClubType } from "@/entities/sportClub/model";
import "./UpdateSportClub.css";

type Props = {
  club: SportClubType;
  onClose: () => void;
  onSuccess: () => void;
};

export const UpdateSportClub = ({ club, onClose, onSuccess }: Props) => {
  const dispatch = useAppDispatch();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<Partial<SportClubType>>({
    title: club.title,
    content: club.content,
    openCommunity: club.openCommunity,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title || "");
      formDataToSend.append("content", formData.content || "");
      formDataToSend.append("openCommunity", String(formData.openCommunity));

      if (selectedFile) {
        formDataToSend.append("photo", selectedFile);
      }

      await dispatch(
        updateSportClubThunk({ id: club.id, data: formDataToSend })
      ).unwrap();
      toast.success("Данные клуба успешно обновлены");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Ошибка при обновлении клуба");
      console.error("Update club error:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Редактирование клуба</h2>
        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-section">
            <label>Новая фотография:</label>
            <div className="photo-upload">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="photo-input"
              />
              <label htmlFor="photo-input">
                {selectedFile ? (
                  <div className="preview-item">
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Preview"
                      className="preview-image"
                    />
                  </div>
                ) : (
                  <span>Кликните для выбора фото</span>
                )}
              </label>
            </div>
            {selectedFile && (
              <p className="file-info">Выбран файл: {selectedFile.name}</p>
            )}
          </div>

          <div className="form-section">
            <label>Название клуба:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Название клуба*"
              required
            />
          </div>

          <div className="form-section">
            <label>Описание клуба:</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
              placeholder="Опишите ваш клуб, его цели и особенности..."
              rows={4}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                fontFamily: "inherit",
                fontSize: "0.95rem",
                color: "var(--text)",
                backgroundColor: "hsl(240deg 15% 8%)",
                border: "1px solid hsl(240deg 10% 25%)",
                borderRadius: "8px",
                resize: "vertical",
                minHeight: "100px",
              }}
            />
          </div>

          <div className="form-section">
            <label>Тип клуба:</label>
            <div className="club-type-buttons">
              <button
                type="button"
                className={`type-button ${
                  formData.openCommunity ? "active" : ""
                }`}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, openCommunity: true }))
                }
              >
                Открытый
              </button>
              <button
                type="button"
                className={`type-button ${
                  !formData.openCommunity ? "active" : ""
                }`}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, openCommunity: false }))
                }
              >
                Закрытый
              </button>
            </div>
          </div>

          <div className="modal-actions">
            <Button variant="secondary" onClick={onClose}>
              Отмена
            </Button>
            <Button variant="primary" type="submit">
              Сохранить
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
