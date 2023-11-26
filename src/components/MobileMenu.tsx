'use client'

import { PiListBold, PiXBold } from 'react-icons/pi'
import ChatHistory from './ChatHistory'
import FileUploads from './FileUploads'
import GizmoPanel from './GizmoPanel'
import ModelSelect from './ModelSelect'
import NewChatButton from './NewChatButton'
import SettingsModal from './SettingsModal'
import { useMobileMenuStore } from '@/zustand/mobileMenu'
import { useSettingsStore } from '@/zustand/settings'

export default function MobileMenu() {
  const isOpen = useMobileMenuStore((state) => state.isOpen)
  const setIsOpen = useMobileMenuStore((state) => state.setIsOpen)
  const documentQueryFeatureSelected = useSettingsStore((state) => state.useDocumentQuery)

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
          <SettingsModal />
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
          {documentQueryFeatureSelected && <FileUploads />}
          <hr className="h-px m-auto w-full border-0 bg-gray-700" />
          <GizmoPanel />
        </div>
      </div>
    )
  }

  return (
    <div className="md:hidden flex gap-2 items-center justify-between p-2 rounded-lg bg-gray-900">
      <ModelSelect instanceId="model-select-mobile" />
      <SettingsModal />
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
