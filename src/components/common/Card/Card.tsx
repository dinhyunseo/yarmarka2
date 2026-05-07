import React, { type HTMLAttributes } from 'react';
import styles from './Card.module.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  variant = 'default', 
  ...props 
}) => {
  const cardClass = `${styles.card} ${styles[variant]} ${className || ''}`;
  
  return (
    <div className={cardClass} {...props}>
      {children}
    </div>
  );
};
