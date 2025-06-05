'use client'

import type { Message } from 'ai/react'
import { useChat } from 'ai/react'
import { useEffect, useState, type FormEvent, type MouseEvent } from 'react'
import { PiPaperPlaneRightFill } from 'react-icons/pi'
import ChatMessages from './ChatMessages'
import ChatTextarea from './ChatTextarea'
import { getSelectedFeature } from './GizmoPanel'
import UploadDocumentsInput from './UploadDocumentsInput'
import UploadImageInput from './UploadImageInput'
import { useToast } from '@/hooks/useToast'
import { convertToBase64, getMessageFromResponse } from '@/utils/helpers'
import { useChatStore } from '@/zustand/chats'
import { useFilesStore } from '@/zustand/files'
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
  const documents = useFilesStore((state) => state.documents)

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
    onFinish: () => handleStreamFinish(),
  })

  const [selectedChatId, setSelectedChatId] = useState<number | undefined>(selectedChat?.id)
  const [lastValidInput, setLastValidInput] = useState(input)
  const [image, setImage] = useState<File | undefined>(undefined)
  const [documentQueryLoading, setDocumentQueryLoading] = useState(false)

  const chatFeatureSelected = useSettingsStore((state) => state.useChat)
  const imageGeneratorFeatureSelected = useSettingsStore((state) => state.useImageGeneration)
  const documentQueryFeatureSelected = useSettingsStore((state) => state.useDocumentQuery)

  const { toastError } = useToast()

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
    setLastValidInput(input)

    if (chatFeatureSelected || imageGeneratorFeatureSelected) {
      await handleChatOrImageFeature(event)
    } else if (documentQueryFeatureSelected) {
      await handleDocumentQueryFeature()
    } else {
      console.error('Unknown feature selected')
    }
  }

  const handleChatOrImageFeature = async (event: FormEvent<HTMLFormElement>) => {
    try {
      const selectedFeature = getSelectedFeature(
        chatFeatureSelected,
        imageGeneratorFeatureSelected,
        documentQueryFeatureSelected,
      )

      handleSubmit(event, {
        options: {
          body: {
            model: selectedModel?.name,
            role,
            apiKey,
            selectedFeature,
            file: image ? await convertToBase64(image) : undefined,
          },
        },
      })
    } catch (e) {
      console.error(e)
    }
  }

  const handleDocumentQueryFeature = async () => {
    try {
      setDocumentQueryLoading(true)
      const fileURLs = documents.map((doc) => doc.url)

      const userQuestion: Message = {
        id: messages.length.toString(),
        content: input,
        role: 'user',
      }

      const messagesWithUserQuestion = [...messages, userQuestion]
      setInput('')
      setMessages(messagesWithUserQuestion)

      const response = await fetch('/api/langchain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileURLs, messages: messagesWithUserQuestion }),
      })

      if (!response.ok) {
        throw await getMessageFromResponse(response)
      }

      if (!response.body) {
        throw new Error('Response body missing!')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      const chatId = (messages.length + 1).toString()
      const prevMessage: Message = { id: chatId, content: '', role: 'assistant' }

      let reading = true
      while (reading) {
        const { done, value } = await reader.read()
        if (done) {
          reading = false
          continue
        }

        prevMessage.content += decoder.decode(value, { stream: true })
        setMessages([...messagesWithUserQuestion, prevMessage])
      }
    } catch (e) {
      console.error(e)
      toastError(e as string)
    } finally {
      setDocumentQueryLoading(false)
    }
  }

  const handleSendMessageClick = (event: MouseEvent<HTMLButtonElement>) => {
    handleSendMessage(event as unknown as FormEvent<HTMLFormElement>)
  }

  const handleImageChange = (file?: File) => {
    setImage(file)

    const text = 'Generate variation of the provided image'
    if (file) {
      setInput(text)
    } else if (input === text) {
      setInput('')
    }
  }

  const handleStreamFinish = () => {
    setImage(undefined)
  }

  return (
    <div className="overflow-hidden flex flex-col flex-1 gap-2">
      <ChatMessages
        error={error}
        isLoading={isLoading || documentQueryLoading}
        messages={messages}
        stop={stop}
      />

      <div className="flex items-center gap-2 p-2 bg-neutral-900">
        <ChatTextarea
          selectedChatId={selectedChatId}
          input={input}
          onChange={handleInputChange}
          onSendMessage={handleSendMessage}
          file={image}
        />
        {imageGeneratorFeatureSelected && (
          <UploadImageInput onImageChange={handleImageChange} file={image} />
        )}
        {documentQueryFeatureSelected && <UploadDocumentsInput />}
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
