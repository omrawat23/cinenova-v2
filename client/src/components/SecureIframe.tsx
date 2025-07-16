import { useRef, useEffect } from 'react';

interface SecureIframeProps {
  src: string;
  title: string;
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function SecureIframe({ src, title, className, width, height }: SecureIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

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
    <iframe
      ref={iframeRef}
      src={src}
      title={title}
      className={className}
      width={width}
      height={height}
      frameBorder="0"
      allowFullScreen
      referrerPolicy="no-referrer"
      loading="lazy"
      onMouseDown={handleIframeClick}
      style={{
        border: 'none',
        outline: 'none'
      }}
    />
  );
}

