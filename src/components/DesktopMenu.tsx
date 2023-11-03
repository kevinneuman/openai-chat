'use client'

import ChatHistory from '@/components/ChatHistory'
import ModelSelect from '@/components/ModelSelect'
import NewChatButton from '@/components/NewChatButton'

export default function DesktopMenu() {
  return (
    <div className="max-md:hidden overflow-hidden flex flex-col gap-4 p-2 w-96 max-lg:w-64 rounded-lg bg-gray-900">
      <ModelSelect instanceId="model-select-desktop" />
      <NewChatButton />
      <ChatHistory />
    </div>
  )
}
