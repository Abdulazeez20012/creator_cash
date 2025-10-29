import React from 'react';

// This is a stylized version of the "Gye Nyame" Adinkra symbol, 
// representing the supremacy and omnipotence of God. It's a symbol of deep cultural 
// significance in Ghana, here adapted with a modern, digital aesthetic to embody
// the limitless power of creation for the CreatorCash brand.
export const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg 
      viewBox="0 0 50 50" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'var(--brand-gold)' }} />
          <stop offset="50%" style={{ stopColor: 'var(--brand-green)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--brand-blue)' }} />
        </linearGradient>
      </defs>
      <path 
        d="M25.0239 2.12207L13.784 13.362L20.4039 19.982L2.12207 24.998L20.4039 30.018L13.784 36.638L25.0239 47.878L36.2639 36.638L29.6439 30.018L47.9258 24.998L29.6439 19.982L36.2639 13.362L25.0239 2.12207Z" 
        stroke="url(#logo-gradient)" 
        strokeWidth="4" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Logo;
