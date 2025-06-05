'use client'

import type { Message } from 'ai/react'
import { useEffect, useRef, useState } from 'react'
import { PiStopFill } from 'react-icons/pi'
import ChatMessage from './ChatMessage'
import LoadingChatMessage from './LoadingChatMessage'
import { useSettingsStore } from '@/zustand/settings'

type Props = {
  error?: Error
  isLoading: boolean
  messages: Message[]
  stop: () => void
}

export default function ChatMessages({ isLoading, messages, stop, error }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true)
  const useDocumentQuery = useSettingsStore((state) => state.useDocumentQuery)

  let errorMessage = ''
  if (error) {
    try {
      const errorObject = JSON.parse(error.message)
      errorMessage = errorObject.message
    } catch (e) {
      errorMessage = 'An unexpected error has occurred'
    }
  }

  const justify = messages.length === 0 ? 'justify-center' : 'justify-start'

  useEffect(() => {
    if (ref.current && shouldScrollToBottom) {
      ref.current.scrollTop = ref.current.scrollHeight
    }
  }, [messages, shouldScrollToBottom])

  const handleScroll = () => {
    if (ref.current) {
      const isAtBottom =
        ref.current.scrollTop + ref.current.clientHeight === ref.current.scrollHeight
      setShouldScrollToBottom(isAtBottom)
    }
  }

  const lastMessage = messages?.[messages.length - 1]

  const shouldShowBotLoadingMessage = isLoading && lastMessage && lastMessage.role === 'user'

  return (
    <div
      className={`overflow-auto flex flex-col flex-1 gap-2 items-center ${justify} md:pt-2 max-md:pl-2 pr-2`}
      ref={ref}
      onScroll={handleScroll}
    >
      {messages.map((message: Message) => (
        <ChatMessage key={message.id} message={message} />
      ))}

      {shouldShowBotLoadingMessage && <LoadingChatMessage />}

      {!isLoading && !errorMessage && messages.length === 0 && (
        <p className="text-gray-400">No messages</p>
      )}

      {(isLoading || errorMessage) && (
        <div className="flex flex-col flex-1 items-center justify-end">
          {isLoading && !useDocumentQuery && (
            <button
              aria-label="stop generate"
              className="flex gap-2 items-center p-4 rounded bg-neutral-800"
              onClick={stop}
            >
              <PiStopFill />
              <p className="text-sm">Stop</p>
            </button>
          )}
          {errorMessage && <p className="text-center text-red-500">{errorMessage}</p>}
        </div>
      )}
    </div>
  )
}
