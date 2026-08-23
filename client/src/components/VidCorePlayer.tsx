import React, { useMemo } from 'react';
import { buildVidCoreUrl, type VidCorePlayerOptions, type VidCorePlayerType } from '@/lib/vidcore';

interface VidCorePlayerProps extends VidCorePlayerOptions {
  id: string | number;
  type?: VidCorePlayerType;
  season?: number;
  episode?: number;
  className?: string;
  iframeId?: string;
}

export const VidCorePlayer: React.FC<VidCorePlayerProps> = ({
  id,
  type = 'movie',
  season = 1,
  episode = 1,
  className = '',
  iframeId = 'vidcore-player',
  ...options
}) => {
  const iframeSrc = useMemo(
    () => buildVidCoreUrl(id, type, season, episode, options),
    [id, type, season, episode, options]
  );

  return (
    <div className={`relative w-full aspect-video ${className}`}>
      <iframe
        id={iframeId}
        src={iframeSrc}
        className="absolute top-0 left-0 w-full h-full border-0"
        allowFullScreen
        allow="encrypted-media; autoplay"
        frameBorder="0"
      />
    </div>
  );
};
