'use client'

import { useChat } from 'ai/react'
import { useEffect, useState, type FormEvent, type MouseEvent } from 'react'
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
  const selectedChat = chats?.find((chat) => chat.isSelected)
  const selectedModel = models.find((model) => model.isSelected)
  const role = useSettingsStore((state) => state.role)
  const apiKey = useSettingsStore((state) => state.apiKey)
  const setStopFunction = useUtilsStore((state) => state.setStopFunction)
  const clearStopFunction = useUtilsStore((state) => state.clearStopFunction)

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
  const [lastValidInput, setLastValidInput] = useState(input)

  useEffect(() => {
    if (stop) {
      setStopFunction(stop)
    }
    return () => clearStopFunction()
  }, [stop, setStopFunction, clearStopFunction])

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

  useEffect(() => {
    if (error) {
      setInput(lastValidInput)
    }
  }, [error, lastValidInput, setInput])

  const handleSendMessage = async (event: FormEvent<HTMLFormElement>) => {
    try {
      setLastValidInput(input)
      handleSubmit(event, {
        options: {
          body: {
            model: selectedModel?.name,
            role,
            apiKey,
          },
        },
      })
    } catch (e) {
      console.error(e)
    }
  }

  const handleSendMessageClick = (event: MouseEvent<HTMLButtonElement>) => {
    handleSendMessage(event as unknown as FormEvent<HTMLFormElement>)
  }

  return (
    <div className="overflow-hidden flex flex-col flex-1 gap-2">
      <ChatMessages error={error} isLoading={isLoading} messages={messages} stop={stop} />

      <div className="flex items-center gap-2 p-2 m-2 md:mt-0 md:ml-0 max-md:mt-0 rounded-lg bg-neutral-900">
        <ChatTextarea
          selectedChatId={selectedChatId}
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
