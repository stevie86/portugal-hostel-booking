import React from 'react';

export default function Button({ variant = 'primary', children, ...props }) {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2 min-h-[44px]';

  const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700',
    secondary: 'bg-white text-brand-600 border border-brand-600 hover:bg-brand-50',
    ghost: 'bg-transparent text-neutral-text-muted hover:text-brand-600 hover:underline',
  };

  return (
    <button
      type="button"
      className={`${baseClasses} ${variants[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
}
