import { FaUserCog } from 'react-icons/fa'

export default function AssignRole() {
  const handleClick = () => {
    console.log('CLICK')
  }

  return (
    <button
      aria-label="assign role"
      className="flex gap-2 items-center p-4 rounded bg-gray-800 active:text-green-200"
      onClick={handleClick}
    >
      <FaUserCog />
    </button>
  )
}
