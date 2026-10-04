import { usePlayer } from '../context/PlayerContext.jsx';

export function SongRow({ song, index, onMenu }) {
  const player = usePlayer();
  const currentSong = player?.currentSong ?? null;
  const isCurrent = currentSong && song && currentSong?.id === song?.id;
  const formatTime = player?.formatTime ?? ((s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`);
  const liked = player?.isLiked?.(song?.id) ?? player?.likedIds?.includes?.(song?.id) ?? false;
  const durSec = song?.durationSec ?? (typeof song?.duration === 'number' ? song.duration : null);
  const durLabel = durSec != null ? formatTime(durSec) : (song?.duration ?? '—');
  const isPlaying = player?.isPlaying ?? true;

  const handlePlay = () => player?.playSong?.(song);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePlay();
    }
  };

  return (
    <div
      onClick={handlePlay}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="group hover:bg-white/10 rounded-lg px-3 py-2 grid grid-cols-[24px_1fr_auto_auto] md:grid-cols-[24px_4fr_3fr_60px_32px_32px] gap-3 items-center cursor-pointer transition-colors"
    >
      <div className="text-sm text-[#B3B3B3] text-center flex items-center justify-center">
        {isCurrent && isPlaying ? (
          <span className="equalizer" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        ) : (
          <>
            <span className="group-hover:hidden">{(index ?? 0) + 1}</span>
            <span className="hidden group-hover:inline text-white">▶</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-3 min-w-0">
        <img
          src={song?.cover ?? song?.image ?? ''}
          alt={song?.title ?? 'kapak'}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://picsum.photos/seed/fallback/300/300';
          }}
          className="w-10 h-10 rounded object-cover bg-[#282828] shrink-0"
        />
        <div className="min-w-0">
          <p className={`text-sm font-medium truncate ${isCurrent ? 'text-[#1DB954]' : 'text-white'}`}>
            {song?.title ?? 'Bilinmeyen Şarkı'}
          </p>
          <p className="text-xs text-[#B3B3B3] truncate md:hidden">{song?.artist ?? ''}</p>
        </div>
      </div>

      <p className="hidden md:block text-sm text-[#B3B3B3] truncate">{song?.artist ?? ''}</p>
      <p className="hidden md:block text-sm text-[#B3B3B3] truncate">{song?.album ?? ''}</p>

      <div className="hidden md:flex items-center justify-end">
        <span className="text-sm text-[#B3B3B3]">{durLabel}</span>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          player?.toggleLike?.(song?.id ?? song);
        }}
        className={`text-base transition hover:scale-125 ${liked ? 'text-[#1DB954]' : 'text-[#B3B3B3] opacity-0 group-hover:opacity-100 hover:text-white'}`}
        aria-label="Beğen"
      >
        {liked ? '♥' : '♡'}
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onMenu?.(song, e);
        }}
        aria-label="Seçenekler"
        className="text-[#B3B3B3] hover:text-white text-lg leading-none px-1 opacity-0 group-hover:opacity-100 focus:opacity-100 transition"
      >
        ...
      </button>

      {/* Mobilde süre */}
      <span className="md:hidden text-xs text-[#B3B3B3] col-start-3 row-start-1">
        {durLabel}
      </span>
    </div>
  );
}
