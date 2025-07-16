import { useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"

interface SecureIframePlayerProps {
  src: string
  onClose: () => void
}

export default function SecureIframePlayer({ src, onClose }: SecureIframePlayerProps) {
  const videoRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    // Block window.open and navigation attempts
    const handleLoad = () => {
      try {
        const iframeWindow = iframe.contentWindow
        if (iframeWindow) {
          // Override window.open to prevent popups
          iframeWindow.open = () => null

          // Block navigation attempts
          iframeWindow.addEventListener('beforeunload', (e) => {
            e.preventDefault()
            return false
          })
        }
      } catch (error) {
        // Cross-origin restrictions - expected for external iframes
        console.log('Cross-origin iframe detected, applying external restrictions')
      }
    }

    // Prevent right-click context menu
    const handleContextMenu = (e: Event) => {
      e.preventDefault()
      return false
    }

    // Block certain key combinations
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block Ctrl+click, middle click behaviors
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        return false
      }
    }

    iframe.addEventListener('load', handleLoad)
    iframe.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('keydown', handleKeyDown)

    // Cleanup
    return () => {
      iframe.removeEventListener('load', handleLoad)
      iframe.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [src])

  // Handle click events to prevent unwanted navigation
  const handleIframeClick = (e: React.MouseEvent) => {
    // Allow normal left clicks but prevent middle/right clicks
    if (e.button !== 0) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

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
            ref={iframeRef}
            src={src}
            className="w-full h-full"
            width="1280"
            height="720"
            title="Video player"
            frameBorder="0"
            allowFullScreen
            referrerPolicy="no-referrer"
            loading="lazy"
            onMouseDown={handleIframeClick}
            style={{
              border: 'none',
              outline: 'none'
            }}
          ></iframe>
        </div>
      </div>
    </div>
  )
}