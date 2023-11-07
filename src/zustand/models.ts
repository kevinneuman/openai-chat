import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Model = {
  name: string
  isSelected: boolean
}

type ModelsState = {
  models: Model[]
  updateModelSelection: (modelName: string) => void
}

export const useModelStore = create<ModelsState>()(
  persist(
    (set, get) => ({
      models: [
        { name: 'gpt-3.5-turbo-1106', isSelected: true },
        { name: 'gpt-4-1106-preview', isSelected: false },
      ],
      updateModelSelection: (modelName) =>
        set({
          models: get().models.map((model) => ({
            ...model,
            isSelected: model.name === modelName,
          })),
        }),
    }),
    {
      name: 'models',
    },
  ),
)
