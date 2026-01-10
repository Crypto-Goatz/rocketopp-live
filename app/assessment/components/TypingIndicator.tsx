'use client'

import React from 'react'

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      <div
        className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"
        style={{ animationDelay: '0ms' }}
      />
      <div
        className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"
        style={{ animationDelay: '150ms' }}
      />
      <div
        className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"
        style={{ animationDelay: '300ms' }}
      />
    </div>
  )
}

export default TypingIndicator
