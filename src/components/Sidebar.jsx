import { usePlayer } from '../context/PlayerContext.jsx';

export function Sidebar({ activeView, onNavigate, userPlaylists }) {
  const player = usePlayer();
  const currentType = activeView ?? player?.view?.type ?? 'home';
  const lists = userPlaylists ?? [...(player?.playlists ?? []), ...(player?.userPlaylists ?? [])];

  const handleCreate = () => {
    const name = window.prompt('Yeni çalma listesi adı:');
    if (name && name.trim()) {
      player?.createPlaylist?.(name.trim());
    }
  };

  const go = (view) => {
    if (onNavigate) onNavigate(view);
    else (player?.navigate ?? player?.setView)?.(view);
  };

  const btn = (view, icon, label) => (
    <button
      onClick={() => go(view)}
      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-semibold w-full text-left transition ${
        currentType === view?.type ? 'text-white bg-[#282828]' : 'text-[#B3B3B3] hover:text-white'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </button>
  );

  return (
    <aside className="hidden lg:flex flex-col w-60 bg-black p-4 gap-4 shrink-0 min-h-screen">
      <div className="flex items-center gap-2 px-2 py-1">
        <div className="w-8 h-8 rounded-full bg-[#1DB954] flex items-center justify-center text-black font-black text-lg">
          ♫
        </div>
        <span className="text-white font-bold text-xl tracking-tight">Spotiklon</span>
      </div>

      <nav className="flex flex-col gap-1">
        {btn({ type: 'home' }, '⌂', 'Ana Sayfa')}
        {btn({ type: 'search' }, '🔍', 'Ara')}
        {btn({ type: 'liked' }, '♥', 'Beğenilen Şarkılar')}
      </nav>

      <div className="mt-2 border-t border-[#282828] pt-4 flex flex-col gap-2 flex-1 min-h-0">
        <div className="flex items-center justify-between px-2">
          <span className="text-[#B3B3B3] text-sm font-semibold uppercase tracking-wider">Kitaplığın</span>
          <button
            onClick={handleCreate}
            title="Çalma Listesi Oluştur"
            className="text-[#B3B3B3] hover:text-white text-xl leading-none px-2"
          >
            +
          </button>
        </div>
        <button
          onClick={handleCreate}
          className="mx-1 mt-1 text-sm font-semibold text-black bg-white rounded-full px-4 py-2 hover:scale-105 transition"
        >
          Çalma Listesi Oluştur
        </button>
        <div className="flex flex-col gap-1 mt-2 overflow-y-auto px-1">
          {Array.isArray(lists) && lists.length > 0 ? (
            lists.map((pl) => (
              <button
                key={pl?.id ?? pl?.name}
                onClick={() => go({ type: 'playlist', playlistId: pl?.id })}
                className="text-left text-sm text-[#B3B3B3] hover:text-white truncate px-2 py-1.5 rounded hover:bg-[#181818]"
              >
                {pl?.name ?? 'İsimsiz çalma listesi'}
              </button>
            ))
          ) : (
            <p className="text-xs text-[#6a6a6a] px-2">Henüz çalma listen yok.</p>
          )}
        </div>
      </div>
    </aside>
  );
}
