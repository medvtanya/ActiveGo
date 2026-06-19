import React from 'react';
import styles from './Input.module.css';

type Props = {
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  type?:
    | 'text'
    | 'password'
    | 'email'
    | 'number'
    | 'url'
    | 'search'
    | 'file'
    | 'checkbox';
  className?: string;
};

export const Input: React.FC<Props> = ({
  size = 'medium',
  type = 'text',
  className = '',
  disabled = false,
  value = '',
  placeholder = '',
  onChange = () => {},
  name,
}) => {
  const inputClass = `${styles.input} ${styles[size]} ${className}`;

  return (
    <input
      className={inputClass}
      disabled={disabled}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      name={name}
    />
  );
};
