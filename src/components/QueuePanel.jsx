import { usePlayer } from '../context/PlayerContext.jsx';

function safePlayer() {
  try {
    return usePlayer();
  } catch {
    return null;
  }
}

export function QueuePanel() {
  const player = safePlayer();

  const queue = player?.queue ?? [];
  const currentSong = player?.currentSong ?? null;

  if (!player || queue.length === 0) {
    return (
      <div className="rounded-lg bg-[#121212] p-4">
        <h3 className="text-white text-sm font-bold mb-2">Sıradaki şarkılar</h3>
        <p className="text-[#B3B3B3] text-sm">Kuyruk boş — bir playlist çal</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-[#121212] p-4">
      <h3 className="text-white text-sm font-bold mb-2">Sıradaki şarkılar</h3>
      <ul className="max-h-96 overflow-y-auto space-y-1">
        {queue.map((song) => {
          const isCurrent = song?.id === currentSong?.id;
          return (
            <li key={song?.id ?? song?.title}>
              <button
                onClick={() => player?.playSong?.(song, queue)}
                className={`w-full flex items-center gap-3 rounded-md px-2 py-1.5 text-left transition hover:bg-white/10 ${
                  isCurrent ? 'bg-white/5' : ''
                }`}
              >
                <img
                  src={song?.cover ?? song?.image ?? ''}
                  alt={song?.title ?? 'kapak'}
                  className="w-10 h-10 rounded object-cover bg-[#282828] shrink-0"
                />
                <span className="min-w-0 flex-1">
                  <span
                    className={`block text-sm truncate ${
                      isCurrent ? 'text-[#1DB954] font-semibold' : 'text-white'
                    }`}
                  >
                    {song?.title ?? 'Bilinmeyen Şarkı'}
                  </span>
                  <span className="block text-xs text-[#B3B3B3] truncate">
                    {song?.artist ?? ''}
                  </span>
                </span>
                {isCurrent && (
                  <span className="text-[#1DB954] text-xs font-bold shrink-0">▶ Çalıyor</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
