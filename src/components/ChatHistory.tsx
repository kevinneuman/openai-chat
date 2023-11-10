import { PiChatBold, PiTrashBold } from 'react-icons/pi'
import { useChatStore, type Chat } from '@/zustand/chats'
import { useMobileMenuStore } from '@/zustand/mobileMenu'
import { useUtilsStore } from '@/zustand/utils'

export default function ChatHistory() {
  const stopFunction = useUtilsStore((state) => state.stopFunction)
  const chats = useChatStore((state) => state.chats)
  const updateChatSelection = useChatStore((state) => state.updateChatSelection)
  const delChat = useChatStore((state) => state.delChat)
  const setIsOpen = useMobileMenuStore((state) => state.setIsOpen)

  const handleChatClick = (chat: Chat) => {
    if (stopFunction) {
      stopFunction()
    }
    updateChatSelection(chat.id)
    setIsOpen(false)
  }

  const title = (chat: Chat): string => {
    if (chat.input && !chat.isSelected) {
      return `Draft: ${chat.input}`
    }

    if (chat.messages.length) {
      return chat.messages[chat.messages.length - 1].content
    }

    if (chat.input) {
      return chat.input
    }

    return 'Empty Chat'
  }

  const handleDelChat = (chatId: number) => {
    if (stopFunction) {
      stopFunction()
    }
    delChat(chatId)
  }

  return (
    <ul className="overflow-auto flex flex-col-reverse gap-2">
      {chats.map((chat) => (
        <li
          key={chat.id}
          className={`flex rounded ${chat.isSelected ? 'bg-gray-600' : 'bg-gray-800'}`}
        >
          <button
            aria-label={title(chat)}
            className="overflow-hidden flex flex-1 items-center gap-2 p-4"
            onClick={() => handleChatClick(chat)}
          >
            <PiChatBold className="shrink-0" />
            <label className="overflow-hidden whitespace-nowrap text-ellipsis text-sm">
              {title(chat)}
            </label>
          </button>
          <button
            aria-label="remove chat"
            className="flex items-center p-4 rounded-r bg-gray-700 active:text-red-200"
            onClick={() => handleDelChat(chat.id)}
          >
            <PiTrashBold className="shrink-0" />
          </button>
        </li>
      ))}
    </ul>
  )
}
