import { useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"

interface SecureIframePlayerProps {
  src: string
  onClose: () => void
}

export default function SecureIframePlayer({ src, onClose }: SecureIframePlayerProps) {
  const videoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (videoRef.current && !videoRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  useEffect(() => {
    const blockedScripts = [
      'https://www.intellipopup.com/PCslGU/E/xexceljs.min.js',
      'https://d3mr7y154d2qg5.cloudfront.net/udotdotdot.js',
      'https://dvxrxm-cxo.top/script/ut.js?cb=1735910227421',
      'https://youradexchange.com/script/suurl5.php?r=8802910',
      'https://ejitmssx-rk.icu/eg?7VLn02vw9NlQswer0rnQh',
      'https://www.pkgphtvnsfxfni.com/ydotdotdot.js',
    ]

    const blockedPatterns = [
      /\.xyz/,
      /\.top/,
      /\.icu/,
      /adexchange/,
      /popup/,
      /overlay/,
      /\.ads\./,
      /tracking/,
      /analytics/
    ]

    const preventNavigation = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
      return false
    }

    const blockScripts = () => {
      const iframe = document.querySelector('iframe')
      if (!iframe) return

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
      if (!iframeDoc) return

      try {
        // Block scripts and iframes
        [...iframeDoc.querySelectorAll('script, iframe')].forEach(el => {
          const src = el.getAttribute('src')
          if (src && (blockedScripts.includes(src) || blockedPatterns.some(pattern => pattern.test(src)))) {
            el.parentNode?.removeChild(el)
          }
        })

        // Block all links and redirects
        const links = iframeDoc.getElementsByTagName('a');
        Array.from(links).forEach(link => {
          link.setAttribute('target', '_self');
          link.style.pointerEvents = 'none';
          ['click', 'touchstart', 'touchend', 'mousedown', 'mouseup'].forEach(evt => {
            link.addEventListener(evt, preventNavigation, { capture: true });
          });
        });

        // Override window.open and similar methods
        if (iframe.contentWindow) {
          iframe.contentWindow.open = () => window
          iframe.contentWindow.alert = () => undefined
          iframe.contentWindow.confirm = () => false
          iframe.contentWindow.prompt = () => null
        }

        // Add comprehensive CSS blocking
        const style = iframeDoc.createElement('style')
        style.textContent = `
          * { pointer-events: none !important; }
          video, .video-controls, .vjs-control-bar, .plyr__controls {
            pointer-events: auto !important;
          }
          [class*="ad"], [class*="Ad"], [class*="popup"], [class*="overlay"],
          [id*="ad"], [id*="Ad"], [id*="popup"], [id*="overlay"] {
            display: none !important;
          }
          iframe:not([src*="vidlink.pro"]) { display: none !important; }
        `
        iframeDoc.head.appendChild(style)

        // Block touch events on mobile
        iframeDoc.body.addEventListener('touchstart', e => {
          const target = e.target as HTMLElement
          if (!target.closest('video, .video-controls, .vjs-control-bar, .plyr__controls')) {
            e.preventDefault()
            e.stopPropagation()
          }
        }, true)

      } catch (error) {
        console.warn('Failed to modify iframe content:', error)
      }
    }

    const intervalId = setInterval(blockScripts, 500)

    return () => {
      clearInterval(intervalId)
      const iframe = document.querySelector('iframe')
      if (iframe?.contentDocument) {
        const links = iframe.contentDocument.getElementsByTagName('a')
        Array.from(links).forEach(link => {
          ['click', 'touchstart', 'touchend', 'mousedown', 'mouseup'].forEach(evt => {
            link.removeEventListener(evt, preventNavigation, { capture: true })
          })
        })
      }
    }
  }, [])

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