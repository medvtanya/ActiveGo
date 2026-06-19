import React from 'react';
import styles from './Button.module.css';

type Props = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  style?: React.CSSProperties;
};

export const Button: React.FC<Props> = ({
  children,
  variant = 'primary',
  size = 'medium',
  type = 'button',
  onClick = () => {},
  className = '',
  disabled = false,
  style,
}) => {
  const buttonClass = `${styles.button} ${styles[variant]} ${styles[size]} ${className}`;

  return (
    <button
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      type={type}
      style={style}
    >
      {children}
    </button>
  );
};
