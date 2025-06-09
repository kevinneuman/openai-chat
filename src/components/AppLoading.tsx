import ThreeDotsLoader from './ThreeDotsLoader'

export default function AppLoading() {
  return (
    <div className="bg-neutral-950 h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <ThreeDotsLoader />
      </div>
    </div>
  )
}
