import React from 'react'

export default function LoadingChatMessage() {
  return (
    <div className="flex flex-row self-start gap-2 py-2">
      <div className="w-6 h-6 rounded-full bg-neutral-900 animate-pulse" />
      <div className="w-6 h-6 rounded-full bg-neutral-800 animate-pulse" />
      <div className="w-6 h-6 rounded-full bg-neutral-700 animate-pulse" />
    </div>
  )
}
