'use client'

import { PiListBold, PiXBold } from 'react-icons/pi'
import ChatHistory from './ChatHistory'
import ModelSelect from './ModelSelect'
import NewChatButton from './NewChatButton'
import SettingsModal from './SettingsModal'
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
      <div className="md:hidden overflow-auto absolute inset-0 flex flex-col gap-2 h-screen bg-neutral-950">
        <div className="flex gap-2 items-center justify-between p-2 bg-neutral-900">
          <ModelSelect instanceId="model-select-mobile" />
          <SettingsModal />
          <button
            aria-label="close menu"
            className="flex items-center justify-center p-4 rounded outline-none bg-neutral-800"
            onClick={close}
          >
            <PiXBold className="flex text-xl text-gray-200" />
          </button>
        </div>

        <div className="overflow-auto flex flex-col flex-1 gap-4 p-2 bg-neutral-900">
          <NewChatButton />
          <ChatHistory />
        </div>
      </div>
    )
  }

  return (
    <div className="md:hidden flex gap-2 items-center justify-between p-2 bg-neutral-900">
      <ModelSelect instanceId="model-select-mobile" />
      <SettingsModal />
      <button
        aria-label="open menu"
        className="flex items-center justify-center p-4 rounded outline-none bg-neutral-800"
        onClick={open}
      >
        <PiListBold className="flex text-xl text-gray-200" />
      </button>
    </div>
  )
}
