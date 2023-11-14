import { useState } from 'react'
import { PiCopyBold, PiCheckCircle } from 'react-icons/pi'

type Props = {
  textToCopy: string
}

export default function CopyButton({ textToCopy }: Props) {
  const [copied, setCopied] = useState(false)

  const handleClick = () => {
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button aria-label="copy text" className="p-4 active:text-green-200" onClick={handleClick}>
      {copied ? (
        <PiCheckCircle className="text-xl text-green-500" />
      ) : (
        <PiCopyBold className="text-xl" />
      )}
    </button>
  )
}
