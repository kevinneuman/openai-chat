import { PiPlusBold } from 'react-icons/pi'
import { createChat, useChatStore } from '@/zustand/chats'
import { useMobileMenuStore } from '@/zustand/mobileMenu'

export default function NewChatButton() {
  const addChat = useChatStore((state) => state.addChat)
  const setIsOpen = useMobileMenuStore((state) => state.setIsOpen)

  const handleClick = () => {
    addChat(createChat())
    setIsOpen(false)
  }

  return (
    <button
      className="flex gap-2 items-center p-4 rounded bg-gray-800 active:text-green-200"
      onClick={handleClick}
    >
      <PiPlusBold />
      <p className="text-sm">New Chat</p>
    </button>
  )
}
