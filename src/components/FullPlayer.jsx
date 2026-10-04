import { useEffect, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext.jsx';
import { getLyrics } from '../data/lyrics.js';

function safePlayer() {
  try {
    return usePlayer();
  } catch {
    return null;
  }
}

export function FullPlayer({ onClose }) {
  const player = safePlayer();
  const activeRef = useRef(null);

  const currentSong = player?.currentSong ?? null;
  const isPlaying = player?.isPlaying ?? false;
  const currentTime = player?.currentTime ?? 0;
  const duration = player?.duration ?? 0;
  const volume = player?.volume ?? 0.8;
  const isMuted = player?.isMuted ?? false;
  const isShuffled = player?.isShuffled ?? false;
  const repeatMode = player?.repeatMode ?? 'off';
  const formatTime =
    player?.formatTime ??
    ((s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`);

  const lines = currentSong ? getLyrics(currentSong?.id) : [];

  let activeIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if ((currentTime ?? 0) >= (lines[i]?.time ?? 0)) activeIndex = i;
  }

  useEffect(() => {
    activeRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
  }, [activeIndex]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const liked =
    currentSong != null
      ? player?.isLiked?.(currentSong?.id) ??
        player?.likedIds?.includes?.(currentSong?.id) ??
        false
      : false;

  const progress = duration > 0 ? Math.min(100, ((currentTime || 0) / duration) * 100) : 0;

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = rect.width > 0 ? (e.clientX - rect.left) / rect.width : 0;
    const clamped = Math.min(1, Math.max(0, ratio));
    player?.seekTo?.(clamped * (duration || 0));
  };

  if (!player || !currentSong) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center transition-opacity duration-300">
        <div className="text-center">
          <p className="text-white text-lg mb-4">Şarkı seçilmedi</p>
          <button
            onClick={() => onClose?.()}
            className="px-4 py-2 rounded-full bg-white text-black text-sm font-semibold hover:scale-105 transition"
            aria-label="Kapat"
          >
            ✕ Kapat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden transition-opacity duration-300"
      style={{ animation: 'fadeIn 0.3s ease' }}
      role="dialog"
      aria-modal="true"
      aria-label="Tam ekran oynatıcı"
    >
      {/* Arka plan: bulanık kapak + gradient */}
      <div className="absolute inset-0 bg-black">
        {currentSong?.cover ? (
          <img
            src={currentSong.cover}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover blur-3xl scale-125 opacity-30"
          />
        ) : null}
        <div
          className="absolute inset-0"
          style={{
            background:
              currentSong?.gradient ??
              'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.9) 100%)',
            opacity: 0.55,
          }}
        />
      </div>

      {/* İçerik */}
      <div className="relative h-full flex flex-col items-center justify-center gap-5 px-6 py-8 overflow-y-auto">
        <button
          onClick={() => onClose?.()}
          className="absolute top-5 right-6 px-3 py-1.5 rounded-full bg-black/60 text-white text-sm hover:bg-black/80 transition"
          aria-label="Kapat"
        >
          ✕ Kapat
        </button>

        <img
          src={currentSong?.cover ?? ''}
          alt={currentSong?.title ?? 'kapak'}
          className="w-56 h-56 sm:w-72 sm:h-72 rounded-xl shadow-2xl object-cover bg-[#282828]"
        />

        <div className="text-center">
          <h2 className="text-white text-2xl font-bold">{currentSong?.title ?? 'Bilinmeyen Şarkı'}</h2>
          <p className="text-[#B3B3B3] text-sm mt-1">{currentSong?.artist ?? ''}</p>
          {currentSong?.album ? (
            <p className="text-[#6a6a6a] text-xs mt-0.5">{currentSong.album}</p>
          ) : null}
        </div>

        {/* Söz senkronu */}
        <div className="w-full max-w-md max-h-44 overflow-y-auto rounded-lg bg-black/40 p-4 text-center space-y-2">
          {lines.map((line, i) => (
            <p
              key={`${line.time}-${i}`}
              ref={i === activeIndex ? activeRef : null}
              className={`text-sm transition-colors ${
                i === activeIndex ? 'text-[#1DB954] font-bold' : 'text-[#B3B3B3]'
              }`}
            >
              {line.text}
            </p>
          ))}
        </div>

        {/* Süre çubuğu */}
        <div className="flex items-center gap-2 w-full max-w-md">
          <span className="text-[11px] text-[#B3B3B3] w-10 text-right">
            {formatTime(currentTime || 0)}
          </span>
          <div
            onClick={handleSeek}
            className="flex-1 h-1.5 bg-white/20 rounded-full cursor-pointer group"
          >
            <div
              className="h-full bg-[#1DB954] rounded-full group-hover:bg-[#1ed760]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[11px] text-[#B3B3B3] w-10">{formatTime(duration || 0)}</span>
        </div>

        {/* Kontroller */}
        <div className="flex items-center gap-4 sm:gap-5">
          <button
            onClick={() => player?.toggleLike?.(currentSong?.id)}
            className={`text-xl ${liked ? 'text-[#1DB954]' : 'text-[#B3B3B3] hover:text-white'}`}
            aria-label="Beğen"
          >
            {liked ? '♥' : '♡'}
          </button>
          <button
            onClick={() => player?.toggleShuffle?.()}
            className={`text-lg ${isShuffled ? 'text-[#1DB954]' : 'text-[#B3B3B3] hover:text-white'}`}
            aria-label="Karıştır"
          >
            🔀
          </button>
          <button
            onClick={() => player?.prev?.()}
            className="text-white text-2xl hover:scale-110 transition"
            aria-label="Önceki"
          >
            ⏮
          </button>
          <button
            onClick={() => player?.togglePlay?.()}
            className="w-14 h-14 rounded-full bg-[#1DB954] text-black text-2xl flex items-center justify-center hover:scale-105 transition"
            aria-label={isPlaying ? 'Duraklat' : 'Oynat'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button
            onClick={() => player?.next?.()}
            className="text-white text-2xl hover:scale-110 transition"
            aria-label="Sonraki"
          >
            ⏭
          </button>
          <button
            onClick={() => player?.cycleRepeat?.()}
            className={`text-lg relative ${
              repeatMode !== 'off' ? 'text-[#1DB954]' : 'text-[#B3B3B3] hover:text-white'
            }`}
            aria-label="Tekrar"
          >
            🔁
            {repeatMode === 'one' && (
              <span className="absolute -top-1 -right-2 text-[9px] font-bold bg-[#1DB954] text-black rounded-full w-3.5 h-3.5 flex items-center justify-center">
                1
              </span>
            )}
            {repeatMode === 'all' && (
              <span className="absolute -top-1 -right-2 text-[9px] font-bold bg-[#1DB954] text-black rounded-full w-3.5 h-3.5 flex items-center justify-center">
                ∞
              </span>
            )}
          </button>
        </div>

        {/* Ses */}
        <div className="hidden sm:flex items-center gap-2">
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
            className="w-28 accent-[#1DB954]"
            aria-label="Ses seviyesi"
          />
        </div>
      </div>
    </div>
  );
}
