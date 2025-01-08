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
      'https://www.pkgphtvnsfxfni.com/ydotdotdot.js',
      'https://s0-greate.net/p/1345575',
      'https://mc.yandex.ru/metrika/tag.js',
      'https://mc.yandex.ru/watch/98154677',
      'https://www.clarity.ms/tag/nske6pmog4',
      'https://static.cloudflareinsights.com/beacon.min.js/vcd15cbe7772f49c399c6a5babf22c1241717689176015',
      'https://cdn.jwplayer.com/libraries/KB5zFt7A.js',
    ];

    const preventNewTabOpening = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const blockUnwantedContent = () => {
      if (!iframeRef.current) return;

      try {
        const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
        if (!iframeDoc) return;

        // Block unwanted scripts
        const scripts = iframeDoc.querySelectorAll('script');
        scripts.forEach((script) => {
          const src = script.getAttribute('src');
          if (src && blockedScripts.some((blocked) => src.includes(blocked))) {
            script.parentNode?.removeChild(script);
          }
        });

        // Prevent new tabs and modify links
        const links = iframeDoc.getElementsByTagName('a');
        Array.from(links).forEach((link) => {
          link.setAttribute('target', '_self');
          link.addEventListener('click', preventNewTabOpening);
          link.addEventListener('auxclick', preventNewTabOpening);
          link.addEventListener('touchstart', preventNewTabOpening, { passive: false });
          link.addEventListener('touchend', preventNewTabOpening, { passive: false });
        });

        // Disable window.open
        if (iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.open = () => null;
        }

        // Apply enhanced styles for interaction
        const style = iframeDoc.createElement('style');
        style.textContent = `
          * {
            pointer-events: none !important;
            user-select: none !important;
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

    const intervalId = setInterval(blockUnwantedContent, 500);

    return () => {
      clearInterval(intervalId);
      if (!iframeRef.current) return;

      try {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
        if (!iframeDoc) return;

        const links = iframeDoc.getElementsByTagName('a');
        Array.from(links).forEach((link) => {
          link.removeEventListener('click', preventNewTabOpening);
          link.removeEventListener('auxclick', preventNewTabOpening);
          link.removeEventListener('touchstart', preventNewTabOpening);
          link.removeEventListener('touchend', preventNewTabOpening);
        });
      } catch (error) {
        console.warn('Failed to clean up iframe:', error);
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
