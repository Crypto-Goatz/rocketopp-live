'use client'

import React from 'react'

interface SparkLogoProps {
  className?: string
}

const SparkLogo: React.FC<SparkLogoProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-16 h-16 ${className}`}
    >
      <defs>
        <linearGradient id="sparkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      {/* Outer circle */}
      <circle
        cx="50"
        cy="50"
        r="45"
        stroke="url(#sparkGradient)"
        strokeWidth="2"
        fill="none"
        className="animate-[draw_1.5s_ease-out_forwards]"
        strokeDasharray="283"
        strokeDashoffset="283"
        style={{
          animation: 'draw 1.5s ease-out forwards',
        }}
      />
      {/* Spark/Lightning bolt */}
      <path
        d="M55 20 L40 48 L50 48 L45 80 L65 45 L52 45 L60 20 Z"
        fill="url(#sparkGradient)"
        filter="url(#glow)"
        className="animate-[fadeIn_0.5s_ease-out_0.8s_forwards]"
        style={{
          opacity: 0,
          animation: 'fadeIn 0.5s ease-out 0.8s forwards',
        }}
      />
      {/* Spark particles */}
      <circle cx="30" cy="30" r="3" fill="#f97316" className="animate-pulse" />
      <circle cx="70" cy="25" r="2" fill="#ef4444" className="animate-pulse" style={{ animationDelay: '0.2s' }} />
      <circle cx="75" cy="70" r="2.5" fill="#f97316" className="animate-pulse" style={{ animationDelay: '0.4s' }} />
      <circle cx="25" cy="65" r="2" fill="#ef4444" className="animate-pulse" style={{ animationDelay: '0.6s' }} />
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

export default SparkLogo
