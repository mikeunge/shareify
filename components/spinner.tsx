import React from 'react';

export default function Spinner({
  size = 40,
  primaryColor = '#a78bfb',
  secondaryColor = '#8c5df8',
  tertiaryColor = '#16a085'
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      style={{
        width: size,
        height: size
      }}
    >
      {/* Outer Circle */}
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke={primaryColor}
        strokeWidth="6"
        strokeDasharray="62.83 188.5"
        style={{
          transformOrigin: 'center',
          animation: 'spin-reverse 3s ease-in-out infinite'
        }}
      />

      {/* Middle Circle */}
      <circle
        cx="50"
        cy="50"
        r="30"
        fill="none"
        stroke={secondaryColor}
        strokeWidth="6"
        strokeDasharray="47.12 141.37"
        style={{
          transformOrigin: 'center',
          animation: 'spin 2.5s linear infinite'
        }}
      />

      {/* Inner Circle */}
      <circle
        cx="50"
        cy="50"
        r="20"
        fill="none"
        stroke={tertiaryColor}
        strokeWidth="6"
        strokeDasharray="31.42 94.25"
        strokeLinecap="round"
        style={{
          transformOrigin: 'center',
          animation: 'spin-pulse 2s cubic-bezier(0.4, 0, 0.2, 1) infinite'
        }}
      />

      {/* Animated dots */}
      <circle
        cx="50"
        cy="10"
        r="4"
        fill={primaryColor}
        style={{
          transformOrigin: '50px 50px',
          animation: 'orbit 2s linear infinite'
        }}
      />

      <circle
        cx="50"
        cy="10"
        r="4"
        fill={secondaryColor}
        style={{
          transformOrigin: '50px 50px',
          animation: 'orbit 2s linear infinite',
          animationDelay: '0.5s'
        }}
      />

      <circle
        cx="50"
        cy="10"
        r="4"
        fill={tertiaryColor}
        style={{
          transformOrigin: '50px 50px',
          animation: 'orbit 2s linear infinite',
          animationDelay: '1s'
        }}
      />

      <style jsx={true}>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes spin-reverse {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(-180deg); }
          100% { transform: rotate(0deg); }
        }
        
        @keyframes spin-pulse {
          0% { transform: rotate(0deg); stroke-dashoffset: 0; }
          50% { stroke-dashoffset: 31.42; }
          100% { transform: rotate(360deg); stroke-dashoffset: 0; }
        }
        
        @keyframes orbit {
          0% { transform: rotate(0deg) translateX(40px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(40px) rotate(-360deg); }
        }
      `}</style>
    </svg>
  );
}
