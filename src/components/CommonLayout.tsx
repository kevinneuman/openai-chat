import React from 'react'

type CommonLayoutProps = {
  isBotMessage: boolean
  children: React.ReactNode
}

export default function CommonLayout({ isBotMessage, children }: CommonLayoutProps) {
  const bgColor = isBotMessage ? 'bg-neutral-700' : 'bg-neutral-800'
  const alignSelf = isBotMessage ? 'md:self-start' : 'md:self-end'

  return (
    <div
      className={`flex flex-col gap-2 p-2 md:max-w-[80%] max-md:w-full rounded ${alignSelf} ${bgColor}`}
    >
      {children}
    </div>
  )
}
