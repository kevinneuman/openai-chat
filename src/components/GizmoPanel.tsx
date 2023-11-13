import { useState, useCallback } from 'react'
import { IoMdCheckboxOutline } from 'react-icons/io'
import Modal from './Modal'
import { useSettingsStore } from '@/zustand/settings'

const featureTypes = {
  chat: 'chat',
  imageGeneration: 'image generation',
  documentQuery: 'document query',
}

type CheckboxProps = {
  label: string
  feature: string
  selectedFeature: string | null
  onSelectFeature: (feature: string) => void
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  feature,
  selectedFeature,
  onSelectFeature,
}) => {
  return (
    <div className="flex justify-center items-center">
      <input
        id={`checkbox-${feature}`}
        type="checkbox"
        className="w-4 h-4 bg-gray-100 border-gray-300 rounded"
        checked={selectedFeature === feature}
        onChange={() => onSelectFeature(feature)}
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

  const getDefaultFeature = () => {
    if (useChat) return featureTypes.chat
    if (useImageGeneration) return featureTypes.imageGeneration
    if (useDocumentQuery) return featureTypes.documentQuery
    return null
  }

  const [selectedFeature, setSelectedFeature] = useState<string | null>(getDefaultFeature())

  const handleSelectFeature = useCallback(
    (feature: string) => {
      setSelectedFeature(feature)
      updateUseChat(feature === featureTypes.chat)
      updateUseImageGeneration(feature === featureTypes.imageGeneration)
      updateUseDocumentQuery(feature === featureTypes.documentQuery)
    },
    [updateUseChat, updateUseImageGeneration, updateUseDocumentQuery],
  )

  return (
    <>
      <button
        aria-label="Features"
        className="flex gap-2 items-center p-4 rounded font-medium text-xl bg-gray-800 active:text-green-200"
        onClick={() => setModalOpen(true)}
      >
        <IoMdCheckboxOutline />
        <p className="text-sm">Features</p>
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
