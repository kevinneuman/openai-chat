'use client'

import FileUploads from './FileUploads'
import GizmoPanel from './GizmoPanel'
import SettingsModal from './SettingsModal'
import ChatHistory from '@/components/ChatHistory'
import ModelSelect from '@/components/ModelSelect'
import NewChatButton from '@/components/NewChatButton'
import { useSettingsStore } from '@/zustand/settings'

export default function DesktopMenu() {
  const documentQueryFeatureSelected = useSettingsStore((state) => state.useDocumentQuery)

  return (
    <div className="max-md:hidden overflow-hidden flex flex-col gap-4 p-2 w-96 max-lg:w-64 bg-neutral-900">
      <div className="flex flex-row gap-2">
        <ModelSelect instanceId="model-select-desktop" />
        <SettingsModal />
      </div>
      <NewChatButton />
      <ChatHistory />
      {documentQueryFeatureSelected && <FileUploads />}
      <hr className="h-px m-auto w-full border-0 bg-neutral-700" />
      <GizmoPanel />
    </div>
  )
}
