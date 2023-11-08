'use client'

import { PiListBold, PiXBold } from 'react-icons/pi'
import AssignRole from './AssignRole'
import ChatHistory from './ChatHistory'
import ModelSelect from './ModelSelect'
import NewChatButton from './NewChatButton'
import { useMobileMenuStore } from '@/zustand/mobileMenu'

export default function MobileMenu() {
  const isOpen = useMobileMenuStore((state) => state.isOpen)
  const setIsOpen = useMobileMenuStore((state) => state.setIsOpen)

  const open = () => {
    setIsOpen(true)
  }

  const close = () => {
    setIsOpen(false)
  }

  if (isOpen) {
    return (
      <div className="md:hidden overflow-auto absolute inset-0 flex flex-col gap-2 h-screen p-2 bg-gray-950">
        <div className="flex gap-2 items-center justify-between p-2 rounded-lg bg-gray-900">
          <ModelSelect instanceId="model-select-mobile" />
          <button
            aria-label="close menu"
            className="flex items-center justify-center p-4 rounded outline-none bg-gray-800"
            onClick={close}
          >
            <PiXBold className="flex text-xl text-gray-200" />
          </button>
        </div>

        <div className="overflow-auto flex flex-col flex-1 gap-4 p-2 rounded-lg bg-gray-900">
          <NewChatButton />
          <ChatHistory />
        </div>
      </div>
    )
  }

  return (
    <div className="md:hidden flex gap-2 items-center justify-between p-2 rounded-lg bg-gray-900">
      <ModelSelect instanceId="model-select-mobile" />
      <AssignRole />
      <button
        aria-label="open menu"
        className="flex items-center justify-center p-4 rounded outline-none bg-gray-800"
        onClick={open}
      >
        <PiListBold className="flex text-xl text-gray-200" />
      </button>
    </div>
  )
}
