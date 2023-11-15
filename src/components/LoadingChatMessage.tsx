import React from 'react'
import ChatMessage from './ChatMessage'

export default function LoadingChatMessage() {
  return (
    <ChatMessage
      key={'bot-message-loading'}
      message={{ id: 'bot-message-loading', content: '...', role: 'assistant' }}
    />
  )
}
