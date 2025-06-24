import type { Message } from 'ai/react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Chat = {
  id: string
  input: string
  messages: Message[]
  isSelected: boolean
}

type ChatState = {
  chats: Chat[]
  updateChatInput: (input: string) => void
  updateChatMessages: (messages: Message[]) => void
  updateChatSelection: (chatId: string) => void
  addChat: (chat: Chat) => void
  delChat: (chatId: string) => void
}

export const createChat = (): Chat => ({
  id: Date.now().toString(),
  input: '',
  messages: [],
  isSelected: true,
})

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chats: [createChat()],
      updateChatInput: (input) =>
        set({
          chats: get().chats.map((chat) => (chat.isSelected ? { ...chat, input } : chat)),
        }),
      updateChatMessages: (messages) =>
        set({
          chats: get().chats.map((chat) => (chat.isSelected ? { ...chat, messages } : chat)),
        }),
      updateChatSelection: (chatId) =>
        set({
          chats: get().chats.map((chat) => ({
            ...chat,
            isSelected: chat.id === chatId,
          })),
        }),
      addChat: (chat) =>
        set({
          chats: [...get().chats.map((chat) => ({ ...chat, isSelected: false })), chat],
        }),
      delChat: (chatId) =>
        set({
          chats:
            get().chats.length === 1
              ? [createChat()]
              : get()
                  .chats.filter((chat) => chat.id !== chatId)
                  .map((chat, index, self) => ({
                    ...chat,
                    isSelected: index === self.length - 1,
                  })),
        }),
    }),
    {
      name: 'chats',
    },
  ),
)
