'use client'

import { useChat } from 'ai/react'
import { useEffect, useState, type FormEvent, type MouseEvent } from 'react'
import { PiPaperPlaneRightFill } from 'react-icons/pi'
import ChatMessages from './ChatMessages'
import ChatTextarea from './ChatTextarea'
import { useChatStore } from '@/zustand/chats'
import { useModelStore } from '@/zustand/models'
import { useRolesStore } from '@/zustand/roles'

export default function Chat() {
  const chats = useChatStore((state) => state.chats)
  const updateChatInput = useChatStore((state) => state.updateChatInput)
  const updateChatMessages = useChatStore((state) => state.updateChatMessages)
  const models = useModelStore((state) => state.models)
  const selectedChat = chats?.find((chat) => chat.isSelected)
  const selectedModel = models.find((model) => model.isSelected)
  const role = useRolesStore((state) => state.role)
  const {
    error,
    handleInputChange,
    handleSubmit,
    input,
    isLoading,
    messages,
    setInput,
    setMessages,
    stop,
  } = useChat({
    initialInput: selectedChat?.input,
    initialMessages: selectedChat?.messages,
  })
  const [selectedChatId, setSelectedChatId] = useState<number | undefined>(selectedChat?.id)

  useEffect(() => {
    if (selectedChat && selectedChat.id !== selectedChatId) {
      setInput(selectedChat.input)
      setMessages(selectedChat.messages)
      setSelectedChatId(selectedChat.id)
    }
  }, [selectedChat, selectedChatId, setInput, setMessages])

  useEffect(() => {
    updateChatInput(input)
  }, [input, updateChatInput])

  useEffect(() => {
    updateChatMessages(messages)
  }, [messages, updateChatMessages])

  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    handleSubmit(event, {
      options: {
        body: { model: selectedModel?.name, role: role.trim() },
      },
    })
  }

  const handleSendMessageClick = (event: MouseEvent<HTMLButtonElement>) => {
    handleSendMessage(event as unknown as FormEvent<HTMLFormElement>)
  }

  return (
    <div className="overflow-hidden flex flex-col flex-1 gap-2">
      <ChatMessages error={error} isLoading={isLoading} messages={messages} stop={stop} />

      <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-900">
        <ChatTextarea
          selectedChatId={selectedChatId}
          input={input}
          onChange={handleInputChange}
          onSendMessage={handleSendMessage}
        />
        <button
          aria-label="send message"
          className="flex items-center justify-center p-4 rounded bg-green-500"
          onClick={handleSendMessageClick}
        >
          <PiPaperPlaneRightFill className="text-xl" />
        </button>
      </div>
    </div>
  )
}
