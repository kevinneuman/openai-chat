import type { Message } from 'ai/react'
import React from 'react'
import ChatLayout from './ChatLayout'
import DalleLayout from './DalleLayout'
import { isValidJson } from '@/utils/helpers'

type Props = {
  message: Message
}

export default function ChatMessage({ message }: Props) {
  const isDalleResponse = isValidJson(message.content)

  if (isDalleResponse) {
    return <DalleLayout message={message} />
  }

  return <ChatLayout message={message} />
}
