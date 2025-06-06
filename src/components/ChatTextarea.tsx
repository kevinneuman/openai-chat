'use client'

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from 'react'
import { useSettingsStore } from '@/zustand/settings'

type Props = {
  selectedChatId?: number
  input: string
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
  onSendMessage: (event: FormEvent<HTMLFormElement>) => void
  file?: File
}

const lineHeight = 32
const maxHeight = 384

export default function ChatTextarea({
  selectedChatId,
  input,
  onChange,
  onSendMessage,
  file,
}: Props) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const [overflow, setOverflow] = useState('overflow-hidden')
  const [rows, setRows] = useState(1)

  const useImageGeneration = useSettingsStore((state) => state.useImageGeneration)
  const useDocumentQuery = useSettingsStore((state) => state.useDocumentQuery)

  useEffect(() => {
    const textarea = ref.current

    if (selectedChatId && textarea) {
      textarea.focus()
    }
  }, [selectedChatId])

  useEffect(() => {
    const hasInput = input.split(/\r?\n/).length > 1 || input.length > 0
    const textarea = ref.current

    if (!hasInput || !textarea) {
      setRows(1)
      setOverflow('overflow-hidden')
      return
    }

    setRows(textarea.scrollHeight / lineHeight - 1)

    if (textarea.scrollHeight > maxHeight) {
      setOverflow('overflow-auto')
    }
  }, [input])

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      if (event.shiftKey || /Mobi|Android/i.test(navigator.userAgent)) {
        return
      }

      event.preventDefault()
      onSendMessage(event as unknown as FormEvent<HTMLFormElement>)
      return
    }
  }

  let placeholderText

  if (useDocumentQuery) {
    placeholderText = 'Query documents'
  } else if (useImageGeneration) {
    if (file) {
      placeholderText = 'Edit image'
    } else {
      placeholderText = 'Create image'
    }
  } else {
    placeholderText = 'Ask a question'
  }

  return (
    <textarea
      className={`flex flex-1 p-4 max-h-96 rounded outline-none resize-none bg-neutral-900 leading-8 ${overflow}`}
      id="chat-textarea"
      ref={ref}
      autoFocus
      placeholder={placeholderText}
      value={input}
      rows={rows}
      onChange={onChange}
      onKeyDown={handleKeyDown}
    />
  )
}
