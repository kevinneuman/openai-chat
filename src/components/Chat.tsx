'use client'

import { useChat } from 'ai/react'
import { useEffect, useState, type FormEvent, type MouseEvent } from 'react'
import { PiPaperPlaneRightFill } from 'react-icons/pi'
import ChatMessages from './ChatMessages'
import ChatTextarea from './ChatTextarea'
import { getSelectedFeature } from './GizmoPanel'
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

  const chatFeatureSelected = useSettingsStore((state) => state.useChat)
  const imageGeneratorFeatureSelected = useSettingsStore((state) => state.useImageGeneration)
  const documentQueryFeatureSelected = useSettingsStore((state) => state.useDocumentQuery)

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

  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    setLastValidInput(input)

    handleSubmit(event, {
      options: {
        body: {
          model: selectedModel?.name,
          role,
          apiKey,
          selectedFeature: getSelectedFeature(
            chatFeatureSelected,
            imageGeneratorFeatureSelected,
            documentQueryFeatureSelected,
          ),
        },
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
