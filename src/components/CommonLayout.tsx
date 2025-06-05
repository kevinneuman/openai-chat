import React from 'react'

type CommonLayoutProps = {
  isBotMessage: boolean
  children: React.ReactNode
}

export default function CommonLayout({ isBotMessage, children }: CommonLayoutProps) {
  const bgColor = isBotMessage ? 'bg-neutral-700' : 'bg-neutral-800'
  const nameColor = isBotMessage ? 'text-green-500' : 'text-gray-200'
  return (
    <div className={`flex flex-col gap-2 p-2 w-full ${bgColor}`}>
      <h3 className={`${nameColor} text-sm font-bold`}>{isBotMessage ? 'Bot' : 'Me'}</h3>
      {children}
    </div>
  )
}
