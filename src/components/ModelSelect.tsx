'use client'

import ReactSelect, { type SingleValue } from 'react-select'
import { useModelStore } from '@/zustand/models'

type Props = {
  instanceId: string
}

export default function ModelSelect({ instanceId }: Props) {
  const models = useModelStore((state) => state.models)
  const updateModelSelection = useModelStore((state) => state.updateModelSelection)

  const options = models.map((model) => ({
    value: model.name,
    label: model.name.toUpperCase(),
  }))
  const selectedModel = models.find((model) => model.isSelected)

  const handleChange = (newValue: SingleValue<(typeof options)[number]>) => {
    if (newValue) {
      updateModelSelection(newValue.value)
    }
  }

  return (
    <ReactSelect
      aria-label="select model"
      classNames={{
        container: () => 'w-full',
        control: () => 'p-2 !border-none !bg-neutral-800',
        singleValue: () => '!text-gray-200 text-sm',
        menuList: () => 'text-gray-950 text-sm',
      }}
      instanceId={instanceId}
      options={options}
      value={options.find((option) => option.value === selectedModel?.name)}
      onChange={handleChange}
    />
  )
}
