import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type SettingsState = {
  role: string
  updateRole: (newRole: string) => void
  apiKey: string
  updateApiKey: (newApiKey: string) => void
  useChat: boolean
  updateUseChat: (newVal: boolean) => void
  useImageGeneration: boolean
  updateUseImageGeneration: (newVal: boolean) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      role: '',
      updateRole: (newRole) => set({ role: newRole }),
      apiKey: '',
      updateApiKey: (newApiKey) => set({ apiKey: newApiKey }),
      useChat: true,
      updateUseChat: (newVal) => set({ useChat: newVal }),
      useImageGeneration: false,
      updateUseImageGeneration: (newVal) => set({ useImageGeneration: newVal }),
    }),
    {
      name: 'settings',
      version: 2,
    },
  ),
)
