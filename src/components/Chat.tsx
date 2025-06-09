'use client'

import { useChat } from '@ai-sdk/react'
import { useEffect, useMemo, type FormEvent, type MouseEvent } from 'react'
import { PiPaperPlaneRightFill } from 'react-icons/pi'
import ChatMessages from './ChatMessages'
import ChatTextarea from './ChatTextarea'
import { useChatStore } from '@/zustand/chats'
import { useModelStore } from '@/zustand/models'
import { useSettingsStore } from '@/zustand/settings'
import { useUtilsStore } from '@/zustand/utils'

export default function Chat() {
  const chats = useChatStore((state) => state.chats)
  const updateChatInput = useChatStore((state) => state.updateChatInput)
  const updateChatMessages = useChatStore((state) => state.updateChatMessages)
  const models = useModelStore((state) => state.models)
  const selectedChat = useMemo(() => chats?.find((chat) => chat.isSelected), [chats])
  const selectedModel = models.find((model) => model.isSelected)
  const role = useSettingsStore((state) => state.role)
  const apiKey = useSettingsStore((state) => state.apiKey)
  const setStopFunction = useUtilsStore((state) => state.setStopFunction)
  const clearStopFunction = useUtilsStore((state) => state.clearStopFunction)

  const { error, handleInputChange, handleSubmit, input, status, messages, stop } = useChat({
    id: selectedChat?.id?.toString(), // Convert to string for useChat
    api: '/api/chat',
    initialInput: selectedChat?.input || '',
    initialMessages: selectedChat?.messages || [],
    onFinish: (message) => {
      // Update store when generation is complete
      if (selectedChat) {
        updateChatMessages([...messages, message])
      }
    },
    body: {
      model: selectedModel?.name,
      role,
      apiKey,
    },
  })

  useEffect(() => {
    setStopFunction(stop)
    return () => clearStopFunction()
  }, [stop, setStopFunction, clearStopFunction])

  const isLoading = status === 'streaming' || status === 'submitted'

  useEffect(() => {
    if (!selectedChat) return

    const timeoutId = setTimeout(() => {
      if (input !== selectedChat.input && !isLoading) {
        updateChatInput(input)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [input, selectedChat, updateChatInput, isLoading])

  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    handleSubmit(event)
  }

  const handleSendMessageClick = (event: MouseEvent<HTMLButtonElement>) => {
    handleSendMessage(event as unknown as FormEvent<HTMLFormElement>)
  }

  return (
    <div className="overflow-hidden flex flex-col flex-1 gap-2">
      <ChatMessages error={error} isLoading={isLoading} messages={messages} stop={stop} />

      <div className="flex items-center gap-2 p-2 m-2 md:mt-0 md:ml-0 max-md:mt-0 rounded-lg bg-neutral-900">
        <ChatTextarea
          selectedChatId={selectedChat?.id}
          input={input}
          onChange={handleInputChange}
          onSendMessage={handleSendMessage}
        />
        <button
          aria-label="send message"
          className="flex items-center justify-center p-4 rounded-full bg-green-500"
          onClick={handleSendMessageClick}
        >
          <PiPaperPlaneRightFill className="text-xl" />
        </button>
      </div>
    </div>
  )
}
