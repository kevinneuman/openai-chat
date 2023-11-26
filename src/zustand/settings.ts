import { v4 as uuidv4 } from 'uuid'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type SettingsState = {
  userId: string
  role: string
  updateRole: (newRole: string) => void
  apiKey: string
  updateApiKey: (newApiKey: string) => void
  useChat: boolean
  updateUseChat: (newVal: boolean) => void
  useImageGeneration: boolean
  updateUseImageGeneration: (newVal: boolean) => void
  useDocumentQuery: boolean
  updateUseDocumentQuery: (newVal: boolean) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      userId: uuidv4(),
      role: '',
      updateRole: (newRole) => set({ role: newRole }),
      apiKey: '',
      updateApiKey: (newApiKey) => set({ apiKey: newApiKey }),
      useChat: true,
      updateUseChat: (newVal) => set({ useChat: newVal }),
      useImageGeneration: false,
      updateUseImageGeneration: (newVal) => set({ useImageGeneration: newVal }),
      useDocumentQuery: false,
      updateUseDocumentQuery: (newVal) => set({ useDocumentQuery: newVal }),
    }),
    {
      name: 'settings',
    },
  ),
)
