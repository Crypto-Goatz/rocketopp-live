'use client'

import React from 'react'

interface ApexLogoProps {
  className?: string
}

const ApexLogo: React.FC<ApexLogoProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-16 h-16 ${className}`}
    >
      <defs>
        <linearGradient id="apexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>
      {/* Outer hexagon */}
      <path
        d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z"
        stroke="url(#apexGradient)"
        strokeWidth="2"
        fill="none"
        className="animate-[draw_1.5s_ease-out_forwards]"
        strokeDasharray="300"
        strokeDashoffset="300"
        style={{
          animation: 'draw 1.5s ease-out forwards',
        }}
      />
      {/* Inner A shape */}
      <path
        d="M50 20 L70 70 L60 70 L55 55 L45 55 L40 70 L30 70 L50 20 Z M50 35 L45 50 L55 50 L50 35 Z"
        fill="url(#apexGradient)"
        className="animate-[fadeIn_0.5s_ease-out_0.8s_forwards]"
        style={{
          opacity: 0,
          animation: 'fadeIn 0.5s ease-out 0.8s forwards',
        }}
      />
      {/* Accent dots */}
      <circle cx="50" cy="10" r="3" fill="#f97316" className="animate-pulse" />
      <circle cx="87" cy="27" r="2" fill="#ef4444" className="animate-pulse" style={{ animationDelay: '0.2s' }} />
      <circle cx="87" cy="73" r="2" fill="#ef4444" className="animate-pulse" style={{ animationDelay: '0.4s' }} />
      <style jsx>{`
        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
      `}</style>
    </svg>
  )
}

export default ApexLogo
