import { useRef } from 'react'
import { Button } from "@/components/ui/button"

interface SecureIframePlayerProps {
  src: string
  onClose: () => void
}

export default function SecureIframePlayer({ src, onClose }: SecureIframePlayerProps) {
  const videoRef = useRef<HTMLDivElement>(null)


  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div ref={videoRef} className="relative w-full max-w-7xl">
        <Button
          className="absolute -top-12 right-0 text-white hover:text-gray-300"
          variant="ghost"
          onClick={onClose}
        >
          Close
        </Button>
        <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl">
          <iframe
            src={src}
            className="w-full h-full"
            width="1280"
            height="720"
            title="Video player"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  )
}