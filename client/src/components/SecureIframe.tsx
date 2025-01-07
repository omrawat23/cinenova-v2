import { useEffect, useRef } from 'react';

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
    const blockedScripts = [
      'https://www.intellipopup.com/PCslGU/E/xexceljs.min.js',
      'https://d3mr7y154d2qg5.cloudfront.net/udotdotdot.js',
      'https://dvxrxm-cxo.top/script/ut.js',
      'https://youradexchange.com/script/suurl5.php',
      'https://ejitmssx-rk.icu/eg',
      'https://www.pkgphtvnsfxfni.com/ydotdotdot.js'
    ];

    const preventNewTabOpening = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const blockScripts = () => {
      if (!iframeRef.current) return;

      try {
        const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
        if (!iframeDoc) return;

        // Block unwanted scripts
        const scripts = iframeDoc.querySelectorAll('script');
        scripts.forEach((script) => {
          const src = script.getAttribute('src');
          if (src && blockedScripts.some(blocked => src.includes(blocked))) {
            script.parentNode?.removeChild(script);
          }
        });

        // Handle mobile and desktop links
        const links = iframeDoc.getElementsByTagName('a');
        Array.from(links).forEach(link => {
          link.setAttribute('target', '_self');
          // Mobile-specific events
          link.addEventListener('touchstart', preventNewTabOpening, { passive: false });
          link.addEventListener('touchend', preventNewTabOpening, { passive: false });
          // Desktop events
          link.addEventListener('click', preventNewTabOpening);
          link.addEventListener('auxclick', preventNewTabOpening);
        });

        // Override window.open for both platforms
        if (iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.open = () => null;
          // Mobile popup blocking
          iframeRef.current.contentWindow.addEventListener('popstate', preventNewTabOpening);
        }

        // Enhanced CSS for mobile and desktop
        const style = iframeDoc.createElement('style');
        style.textContent = `
          * {
            pointer-events: none !important;
            user-select: none !important;
            -webkit-touch-callout: none !important;
            -webkit-tap-highlight-color: transparent !important;
          }
          video, .video-controls {
            pointer-events: auto !important;
            user-select: auto !important;
          }
        `;
        iframeDoc.head.appendChild(style);
      } catch (error) {
        console.warn('Failed to modify iframe:', error);
      }
    };

    // Run more frequently on mobile
    const intervalId = setInterval(blockScripts, 500);

    return () => {
      clearInterval(intervalId);
      if (!iframeRef.current) return;

      try {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
        if (!iframeDoc) return;

        const links = iframeDoc.getElementsByTagName('a');
        Array.from(links).forEach(link => {
          link.removeEventListener('touchstart', preventNewTabOpening);
          link.removeEventListener('touchend', preventNewTabOpening);
          link.removeEventListener('click', preventNewTabOpening);
          link.removeEventListener('auxclick', preventNewTabOpening);
        });
      } catch (error) {
        console.warn('Failed to cleanup iframe:', error);
      }
    };
  }, []);

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
    />
  );
}
