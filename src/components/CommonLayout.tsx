import React from 'react'

type CommonLayoutProps = {
  isBotMessage: boolean
  children: React.ReactNode
}

export default function CommonLayout({ isBotMessage, children }: CommonLayoutProps) {
  const bgColor = isBotMessage ? 'bg-neutral-700' : 'bg-neutral-800'
  const nameColor = isBotMessage ? 'text-green-500' : 'text-gray-200'
  const alignSelf = isBotMessage ? 'md:self-start' : 'md:self-end'

  return (
    <div className={`flex flex-col gap-2 p-2 max-md:w-full rounded ${alignSelf} ${bgColor}`}>
      <h3 className={`${nameColor} text-sm font-bold`}>{isBotMessage ? 'Bot' : 'Me'}</h3>
      {children}
    </div>
  )
}
