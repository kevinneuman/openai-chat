import type { ChangeEvent, FC } from 'react'
import React, { useRef } from 'react'
import { FaFileUpload } from 'react-icons/fa'
import { PiTrashBold } from 'react-icons/pi'

type UploadImageInputProps = {
  onImageChange: (file?: File) => void
  file?: File
}

const UploadImageInput: FC<UploadImageInputProps> = ({ onImageChange, file }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newfile = event.target.files && event.target.files[0]
    if (newfile) {
      onImageChange(newfile)
    }
  }

  const handleClear = () => {
    onImageChange(undefined)
  }

  return (
    <>
      {file ? (
        <>
          <button
            aria-label="clear file"
            className={'flex items-center justify-center p-4 rounded bg-red-500 text-white'}
            onClick={handleClear}
          >
            <PiTrashBold className="text-xl" />
          </button>
        </>
      ) : (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/png"
            className="hidden"
            onChange={handleChange}
          />
          <button
            aria-label="select file"
            className={'flex items-center justify-center p-4 rounded bg-green-500 text-white'}
            onClick={handleClick}
          >
            <FaFileUpload className="text-xl" />
          </button>
        </>
      )}
    </>
  )
}

export default UploadImageInput
