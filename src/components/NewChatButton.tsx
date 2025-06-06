import { PiPlusBold } from 'react-icons/pi'
import { createChat, useChatStore } from '@/zustand/chats'
import { useMobileMenuStore } from '@/zustand/mobileMenu'
import { useUtilsStore } from '@/zustand/utils'

export default function NewChatButton() {
  const stopFunction = useUtilsStore((state) => state.stopFunction)
  const addChat = useChatStore((state) => state.addChat)
  const setIsOpen = useMobileMenuStore((state) => state.setIsOpen)

  const handleClick = () => {
    if (stopFunction) {
      stopFunction()
    }
    addChat(createChat())
    setIsOpen(false)
  }

  return (
    <button
      aria-label="new chat"
      className="flex gap-2 items-center p-4 rounded bg-neutral-800 active:text-green-200"
      onClick={handleClick}
    >
      <PiPlusBold />
      <p className="text-sm">New Chat</p>
    </button>
  )
}
