'use client'

import { useChat } from '@ai-sdk/react'
import type { ChangeEvent, FormEvent, MouseEvent } from 'react'
import { useEffect, useMemo, useRef, useCallback } from 'react'
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
  const selectedChat = useMemo(() => chats.find((chat) => chat.isSelected), [chats])
  const selectedModel = useMemo(() => models.find((model) => model.isSelected), [models])
  const role = useSettingsStore((state) => state.role)
  const apiKey = useSettingsStore((state) => state.apiKey)
  const setStopFunction = useUtilsStore((state) => state.setStopFunction)
  const clearStopFunction = useUtilsStore((state) => state.clearStopFunction)
  const currentChatIdRef = useRef<string | undefined>(undefined)

  const { error, handleInputChange, handleSubmit, input, status, messages, stop, setInput } =
    useChat({
      id: selectedChat?.id,
      api: '/api/chat',
      initialInput: selectedChat?.input || '',
      initialMessages: selectedChat?.messages || [],
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

  useEffect(() => {
    if (!selectedChat) {
      return
    }

    const chatSwitched = currentChatIdRef.current !== selectedChat.id

    if (chatSwitched) {
      setInput(selectedChat.input || '')
      currentChatIdRef.current = selectedChat.id
      return
    }

    if (status === 'streaming' || messages.length === 0) {
      return
    }

    const messagesChanged =
      messages.length !== selectedChat.messages.length ||
      messages.some(
        (msg, index) =>
          !selectedChat.messages[index] ||
          msg.id !== selectedChat.messages[index].id ||
          msg.content !== selectedChat.messages[index].content,
      )

    if (messagesChanged) {
      updateChatMessages(messages)
    }
  }, [selectedChat, messages, status, setInput, updateChatMessages])

  const isLoading = status === 'streaming' || status === 'submitted'

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      updateChatInput(event.target.value)
      handleInputChange(event)
    },
    [updateChatInput, handleInputChange],
  )

  const handleSendMessage = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      updateChatInput('')
      handleSubmit(event)
    },
    [updateChatInput, handleSubmit],
  )

  const handleSendMessageClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      handleSendMessage(event as unknown as FormEvent<HTMLFormElement>)
    },
    [handleSendMessage],
  )

  return (
    <div className="overflow-hidden flex flex-col flex-1 gap-2">
      <ChatMessages error={error} isLoading={isLoading} messages={messages} stop={stop} />

      <div className="flex items-center gap-2 p-2 m-2 md:mt-0 md:ml-0 max-md:mt-0 rounded-lg bg-neutral-900">
        <ChatTextarea
          selectedChatId={selectedChat?.id}
          input={input}
          onChange={handleChange}
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
