import Link from 'next/link'
import { useState } from 'react'
import { AiOutlineFileSearch } from 'react-icons/ai'
import { FaRegImage } from 'react-icons/fa'
import { TbBoxMultiple } from 'react-icons/tb'
import Modal from './Modal'

export default function GizmoPanel() {
  const [modalOpen, setModalOpen] = useState(false)

  const handleOpenModal = () => setModalOpen(true)
  const handleCloseModal = () => setModalOpen(false)

  return (
    <>
      <button
        aria-label="Try other features"
        className="flex gap-2 items-center p-4 rounded font-medium text-xl bg-gray-800 active:text-green-200"
        onClick={handleOpenModal}
      >
        <TbBoxMultiple />
        <p className="text-sm">Try other features</p>
      </button>
      <Modal isOpen={modalOpen} onClose={handleCloseModal}>
        <div className="flex flex-col gap-2">
          <Link href="/dalle">
            <button
              aria-label="Dalle 3"
              className="flex w-full gap-2 items-center p-4 rounded font-medium text-xl bg-gray-800 active:text-green-200"
            >
              <FaRegImage />
              <p className="text-sm">Dalle 3</p>
            </button>
          </Link>
          <button
            aria-label="Document search"
            className="flex gap-2 items-center p-4 rounded font-medium text-xl bg-gray-800 active:text-green-200"
            onClick={() => alert('Not implemented yet!')}
          >
            <AiOutlineFileSearch />
            <p className="text-sm">Document search</p>
          </button>
        </div>
      </Modal>
    </>
  )
}
