import { usePlayer } from '../context/PlayerContext.jsx';

export function Player() {
  const player = usePlayer();

  const currentSong = player?.currentSong ?? null;
  const isPlaying = player?.isPlaying ?? false;
  const currentTime = player?.currentTime ?? 0;
  const duration = player?.duration ?? 0;
  const volume = player?.volume ?? 0.8;
  const isMuted = player?.isMuted ?? false;
  const isShuffled = player?.isShuffled ?? false;
  const repeatMode = player?.repeatMode ?? 'off';
  const formatTime = player?.formatTime ?? ((s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`);

  const liked = currentSong ? player?.isLiked?.(currentSong?.id) ?? player?.likedIds?.includes?.(currentSong?.id) ?? false : false;

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = rect.width > 0 ? (e.clientX - rect.left) / rect.width : 0;
    const clamped = Math.min(1, Math.max(0, ratio));
    player?.seekTo?.(clamped * (duration || 0));
  };

  const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  if (!currentSong) {
    return (
      <footer className="h-[90px] bg-black border-t border-[#282828] grid grid-cols-[1fr_auto] md:grid-cols-3 px-4 items-center">
        <div className="text-[#B3B3B3] text-sm">Bir şarkı seçerek başla 🎵</div>
        <div />
        <div />
      </footer>
    );
  }

  return (
    <footer className="h-[90px] bg-black border-t border-[#282828] grid grid-cols-[1fr_auto] md:grid-cols-3 px-4 items-center gap-4">
      {/* Sol: şarkı bilgisi */}
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={currentSong?.cover ?? currentSong?.image ?? ''}
          alt={currentSong?.title ?? 'kapak'}
          loading="lazy"
          onError={(e) => { e.currentTarget.src = '/vite.svg'; }}
          className="w-12 h-12 rounded object-cover bg-[#282828] cursor-pointer hover:opacity-80 transition"
          onClick={() => window.dispatchEvent(new Event('spotiklon:open-full'))}
        />
        <div className="min-w-0">
          <p
            className="text-white text-sm font-semibold truncate cursor-pointer hover:underline"
            onClick={() => window.dispatchEvent(new Event('spotiklon:open-full'))}
            title="Tam ekran aç"
          >
            {currentSong?.title ?? 'Bilinmeyen Şarkı'}
          </p>
          <p
            className="text-[#B3B3B3] text-xs truncate cursor-pointer hover:text-white"
            onClick={() => window.dispatchEvent(new Event('spotiklon:open-full'))}
          >
            {currentSong?.artist ?? ''}
          </p>
        </div>
        <button
          onClick={() => player?.toggleLike?.(currentSong?.id ?? currentSong)}
          className={`ml-1 text-lg ${liked ? 'text-[#1DB954]' : 'text-[#B3B3B3] hover:text-white'}`}
          aria-label="Beğen"
        >
          {liked ? '♥' : '♡'}
        </button>
      </div>

      {/* Orta: kontroller + süre */}
      <div className="flex flex-col items-center gap-1 min-w-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => player?.toggleShuffle?.()}
            className={`hidden sm:flex text-base ${isShuffled ? 'text-[#1DB954]' : 'text-[#B3B3B3] hover:text-white'}`}
            aria-label="Karıştır"
          >
            🔀
          </button>
          <button
            onClick={() => player?.prev?.()}
            className="text-[#B3B3B3] hover:text-white text-xl"
            aria-label="Önceki"
          >
            ⏮
          </button>
          <button
            onClick={() => player?.togglePlay?.()}
            className="w-9 h-9 rounded-full bg-[#1DB954] text-black flex items-center justify-center hover:scale-105 transition"
            aria-label={isPlaying ? 'Duraklat' : 'Oynat'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button
            onClick={() => player?.next?.()}
            className="text-[#B3B3B3] hover:text-white text-xl"
            aria-label="Sonraki"
          >
            ⏭
          </button>
          <button
            onClick={() => player?.cycleRepeat?.()}
            className={`hidden sm:flex text-base relative ${repeatMode !== 'off' ? 'text-[#1DB954]' : 'text-[#B3B3B3] hover:text-white'}`}
            aria-label="Tekrar"
          >
            🔁
            {repeatMode === 'one' && (
              <span className="absolute -top-1 -right-2 text-[9px] font-bold bg-[#1DB954] text-black rounded-full w-3.5 h-3.5 flex items-center justify-center">1</span>
            )}
            {repeatMode === 'all' && (
              <span className="absolute -top-1 -right-2 text-[9px] font-bold bg-[#1DB954] text-black rounded-full w-3.5 h-3.5 flex items-center justify-center">∞</span>
            )}
          </button>
        </div>
        <div className="flex items-center gap-2 w-full max-w-xl">
          <span className="text-[11px] text-[#B3B3B3] w-10 text-right">{formatTime(currentTime || 0)}</span>
          <div onClick={handleSeek} className="flex-1 h-1 sm:h-1.5 bg-[#404040] rounded-full cursor-pointer group">
            <div className="h-full bg-[#1DB954] rounded-full group-hover:bg-[#1ed760]" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-[11px] text-[#B3B3B3] w-10">{formatTime(duration || 0)}</span>
          {Array.isArray(player?.queue) && player.queue.length > 1 && Number.isFinite(player?.queueIndex) && (
            <span className="text-[11px] text-[#B3B3B3] whitespace-nowrap">• {player.queueIndex + 1}/{player.queue.length}</span>
          )}
        </div>
      </div>

      {/* Sağ: ses */}
      <div className="hidden md:flex items-center justify-end gap-2">
        <button
          onClick={() => player?.toggleMute?.()}
          className="text-[#B3B3B3] hover:text-white text-lg"
          aria-label="Ses aç/kapat"
        >
          {isMuted || volume === 0 ? '🔇' : '🔊'}
        </button>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round((isMuted ? 0 : volume ?? 0) * 100)}
          onChange={(e) => player?.setVolumeLevel?.(Number(e.target.value) / 100)}
          className="w-24 accent-[#1DB954]"
          aria-label="Ses seviyesi"
        />
      </div>
    </footer>
  );
}
