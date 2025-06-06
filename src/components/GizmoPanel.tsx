import { useState, useCallback } from 'react'
import { FaRegImage } from 'react-icons/fa'
import { HiOutlineDocumentSearch } from 'react-icons/hi'
import { IoMdCheckboxOutline } from 'react-icons/io'
import { PiChatBold } from 'react-icons/pi'
import Modal from './Modal'
import { useSettingsStore } from '@/zustand/settings'

type FeatureTypes = {
  chat: string
  imageGeneration: string
  documentQuery: string
}

const featureTypes: FeatureTypes = {
  chat: 'chat',
  imageGeneration: 'image generation',
  documentQuery: 'document query (RAG)',
}

export const getSelectedFeature = (
  useChat: boolean,
  useImageGeneration: boolean,
  useDocumentQuery: boolean,
) => {
  if (useChat) return featureTypes.chat
  if (useImageGeneration) return featureTypes.imageGeneration
  if (useDocumentQuery) return featureTypes.documentQuery
  return featureTypes.chat
}

type CheckboxProps = {
  label: string
  feature: string
  selectedFeature: string | null
  onSelectFeature: (feature: string) => void
  disabled?: boolean
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  feature,
  selectedFeature,
  onSelectFeature,
  disabled = false,
}) => {
  return (
    <div className="flex justify-center items-center">
      <input
        id={`checkbox-${feature}`}
        type="checkbox"
        className="w-4 h-4 bg-neutral-100 border-gray-300 rounded"
        checked={selectedFeature === feature}
        onChange={() => onSelectFeature(feature)}
        disabled={disabled}
      />
      <label htmlFor={`checkbox-${feature}`} className="ms-2 text-sm font-medium text-gray-200">
        {label}
      </label>
    </div>
  )
}

export default function GizmoPanel() {
  const [modalOpen, setModalOpen] = useState(false)

  const useChat = useSettingsStore((state) => state.useChat)
  const updateUseChat = useSettingsStore((state) => state.updateUseChat)

  const useImageGeneration = useSettingsStore((state) => state.useImageGeneration)
  const updateUseImageGeneration = useSettingsStore((state) => state.updateUseImageGeneration)

  const useDocumentQuery = useSettingsStore((state) => state.useDocumentQuery)
  const updateUseDocumentQuery = useSettingsStore((state) => state.updateUseDocumentQuery)

  const [selectedFeature, setSelectedFeature] = useState<string | null>(
    getSelectedFeature(useChat, useImageGeneration, useDocumentQuery),
  )

  const handleSelectFeature = useCallback(
    (feature: string) => {
      setSelectedFeature(feature)
      updateUseChat(feature === featureTypes.chat)
      updateUseImageGeneration(feature === featureTypes.imageGeneration)
      updateUseDocumentQuery(feature === featureTypes.documentQuery)
    },
    [updateUseChat, updateUseImageGeneration, updateUseDocumentQuery],
  )

  const getSelectedFeatureIcon = () => {
    switch (selectedFeature) {
      case featureTypes.chat:
        return <PiChatBold />
      case featureTypes.imageGeneration:
        return <FaRegImage />
      case featureTypes.documentQuery:
        return <HiOutlineDocumentSearch />
    }
  }

  return (
    <>
      <button
        aria-label="Features"
        className="flex items-center justify-between p-4 rounded font-medium text-xl bg-neutral-800 active:text-green-200"
        onClick={() => setModalOpen(true)}
      >
        <div className="flex gap-2">
          <IoMdCheckboxOutline />
          <p className="text-sm">Features</p>
        </div>
        <div className="text-green-500">{getSelectedFeatureIcon()}</div>
      </button>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="flex flex-col items-start gap-2">
          {Object.entries(featureTypes).map(([key, feature]) => (
            <Checkbox
              key={key}
              label={`Use ${feature}`}
              feature={feature}
              selectedFeature={selectedFeature}
              onSelectFeature={handleSelectFeature}
            />
          ))}
        </div>
      </Modal>
    </>
  )
}
