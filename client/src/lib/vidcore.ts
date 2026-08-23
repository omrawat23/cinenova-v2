export type VidCorePlayerType = 'movie' | 'tv';

export interface VidCorePlayerOptions {
  autoPlay?: boolean;
  theme?: string;
  title?: boolean;
  poster?: boolean;
  startAt?: number;
  sub?: string;
  server?: string;
  hideServer?: boolean;
  fullscreenButton?: boolean;
  chromecast?: boolean;
  nextButton?: boolean;
  autoNext?: boolean;
}

export interface WatchProgress {
  time: number;
  duration: number;
  percent: number;
}

export const VIDCORE_ORIGIN = 'https://vidcore.io';
export const VIDLINK_PROGRESS_KEY = 'vidLinkProgress';

export const getProgressStorageKey = (mediaId: string | number) => `progress_${mediaId}`;

const booleanParams = new Set([
  'autoPlay',
  'title',
  'poster',
  'hideServer',
  'fullscreenButton',
  'chromecast',
  'nextButton',
  'autoNext'
]);

export const buildVidCoreUrl = (
  id: string | number,
  type: VidCorePlayerType = 'movie',
  season = 1,
  episode = 1,
  options: VidCorePlayerOptions = {}
) => {
  const basePath =
    type === 'tv'
      ? `${VIDCORE_ORIGIN}/tv/${id}/${season}/${episode}`
      : `${VIDCORE_ORIGIN}/movie/${id}`;

  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(options)) {
    if (value === undefined || value === null) continue;

    if (key === 'theme' && typeof value === 'string' && value.length > 0) {
      params.append('theme', value.replace('#', ''));
      continue;
    }

    if (key === 'startAt' && typeof value === 'number' && Number.isFinite(value) && value > 0) {
      params.append('startAt', String(Math.floor(value)));
      continue;
    }

    if (key === 'sub' && typeof value === 'string' && value.length > 0) {
      params.append('sub', value);
      continue;
    }

    if (key === 'server' && typeof value === 'string' && value.length > 0) {
      params.append('server', value);
      continue;
    }

    if (booleanParams.has(key) && typeof value === 'boolean' && value) {
      if (type === 'movie' && (key === 'nextButton' || key === 'autoNext')) continue;
      if (key === 'autoNext' && !options.nextButton) continue;
      params.append(key, 'true');
    }
  }

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
};

export const readWatchProgress = (mediaId: string | number): WatchProgress | null => {
  try {
    const raw = localStorage.getItem(getProgressStorageKey(mediaId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<WatchProgress>;
    if (
      typeof parsed.time !== 'number' ||
      !Number.isFinite(parsed.time) ||
      typeof parsed.duration !== 'number' ||
      !Number.isFinite(parsed.duration) ||
      parsed.duration <= 0
    ) {
      return null;
    }
    const percent =
      typeof parsed.percent === 'number' && Number.isFinite(parsed.percent)
        ? parsed.percent
        : parsed.time / parsed.duration;
    return {
      time: Math.floor(parsed.time),
      duration: Math.floor(parsed.duration),
      percent
    };
  } catch {
    return null;
  }
};

export const writeWatchProgress = (mediaId: string | number, progress: WatchProgress) => {
  localStorage.setItem(getProgressStorageKey(mediaId), JSON.stringify(progress));
};

export const sendPlayerCommand = (
  iframeRef: HTMLIFrameElement,
  command: 'play' | 'pause' | 'seek' | 'volume' | 'mute' | 'getStatus',
  payload?: { time?: number; level?: number; muted?: boolean }
) => {
  if (!iframeRef?.contentWindow) return;
  iframeRef.contentWindow.postMessage({ command, ...payload }, '*');
};
