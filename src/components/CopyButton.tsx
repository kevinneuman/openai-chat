import { PiCopyBold } from 'react-icons/pi'

type Props = {
  textToCopy: string
}

export default function CopyButton({ textToCopy }: Props) {
  const handleClick = () => {
    navigator.clipboard.writeText(textToCopy)
  }

  return (
    <button className="p-4 active:text-green-200" onClick={handleClick}>
      <PiCopyBold className="text-xl" />
    </button>
  )
}
