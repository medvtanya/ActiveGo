import React, { useRef } from 'react';

interface ButtonAddProps {
  onFileSelect?: (file: File) => void;
  className?: string;
}

const ButtonAdd: React.FC<ButtonAddProps> = ({ onFileSelect, className = "add-file" }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
    // Сбрасываем значение input для возможности выбора того же файла
    if (event.target) {
      event.target.value = '';
    }
  };

  return (
    <>
      <button
        className={className}
        onClick={handleClick}
        type="button"
      >
        📎︎
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </>
  );
};

export default ButtonAdd; 