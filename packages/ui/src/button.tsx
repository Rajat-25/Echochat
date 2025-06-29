'use client';

import { ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
  className?: string;
  type: 'button' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
};

export const Button = ({
  children,
  disabled,
  className,
  onClick,
  type = 'button',
}: ButtonProps) => {
  return (
    <button
      disabled={disabled}
      type={type}
      className={className}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
