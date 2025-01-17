import { useRef } from 'react';

interface SecureIframeProps {
  src: string;
  title: string;
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function SecureIframe({ src, title, className, width, height }: SecureIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

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
    />
  );
}
